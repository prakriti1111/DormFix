const Complaint = require("../models/Complaint");
const generateComplaintId = require("../utils/generateComplaintId");
const { refreshOverdueForList, refreshOverdueStatus } = require("../utils/overdue");

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const ALLOWED_TRANSITIONS = {
  SUBMITTED: ["UNDER_PROGRESS", "RESOLVED"],
  UNDER_PROGRESS: ["RESOLVED"],
  RESOLVED: [], // terminal
};

/**
 * Creates a complaint. Resident identity fields are taken from the
 * authenticated user, never trusted from the request body.
 */
const createComplaint = async (residentUser, { description }, imagePath) => {
  if (!description || description.trim().length < 5) {
    throw new AppError(
      "Description is required and must be at least 5 characters.",
      400
    );
  }
  if (!residentUser.roomNumber || !residentUser.registrationNumber) {
    throw new AppError(
      "Resident profile is incomplete (missing room/registration number).",
      400
    );
  }

  const complaintId = await generateComplaintId();

  // New complaints default to "newest first" ordering — use current
  // timestamp (ms) as the initial priorityOrder so it naturally sorts
  // above older complaints when sorted descending. The warden can
  // later override this via manual reordering.
  const priorityOrder = Date.now();

  const complaint = await Complaint.create({
    complaintId,
    residentId: residentUser._id,
    residentName: residentUser.fullName,
    registrationNumber: residentUser.registrationNumber,
    roomNumber: residentUser.roomNumber,
    description: description.trim(),
    imagePath,
    status: "SUBMITTED",
    priorityOrder,
  });

  return complaint;
};

const getMyComplaints = async (residentId) => {
  const complaints = await Complaint.find({ residentId }).sort({
    createdAt: -1,
  });
  await refreshOverdueForList(complaints);
  return complaints;
};

const getComplaintById = async (complaintObjectId, requestingUser) => {
  const complaint = await Complaint.findById(complaintObjectId);
  if (!complaint) {
    throw new AppError("Complaint not found.", 404);
  }

  // Residents may only view their own complaints
  if (
    requestingUser.role === "resident" &&
    complaint.residentId.toString() !== requestingUser._id.toString()
  ) {
    throw new AppError("Forbidden. This complaint does not belong to you.", 403);
  }

  await refreshOverdueStatus(complaint);
  return complaint;
};

/**
 * Warden-only: list all complaints with optional filtering/sorting.
 */
const getAllComplaints = async ({ status, overdue, roomNumber, sortBy }) => {
  const filter = {};
  if (status) filter.status = status;
  if (roomNumber) filter.roomNumber = roomNumber;

  let complaints = await Complaint.find(filter);
  await refreshOverdueForList(complaints);

  if (overdue === "true") {
    complaints = complaints.filter((c) => c.isOverdue);
  } else if (overdue === "false") {
    complaints = complaints.filter((c) => !c.isOverdue);
  }

  const sorters = {
    newest: (a, b) => b.createdAt - a.createdAt,
    oldest: (a, b) => a.createdAt - b.createdAt,
    status: (a, b) => a.status.localeCompare(b.status),
    resolutionDate: (a, b) =>
      new Date(b.resolvedAt || 0) - new Date(a.resolvedAt || 0),
    overdue: (a, b) => Number(b.isOverdue) - Number(a.isOverdue),
    priority: (a, b) => b.priorityOrder - a.priorityOrder,
  };

  const sortFn = sorters[sortBy] || sorters.priority;
  complaints.sort(sortFn);

  return complaints;
};

const updateStatus = async (complaintObjectId, newStatus) => {
  const complaint = await Complaint.findById(complaintObjectId);
  if (!complaint) {
    throw new AppError("Complaint not found.", 404);
  }

  const allowedNext = ALLOWED_TRANSITIONS[complaint.status] || [];
  if (!allowedNext.includes(newStatus)) {
    throw new AppError(
      `Invalid status transition from ${complaint.status} to ${newStatus}.`,
      400
    );
  }

  complaint.status = newStatus;
  if (newStatus === "RESOLVED") {
    complaint.resolvedAt = new Date();
    complaint.isOverdue = false;
  }

  await complaint.save();
  return complaint;
};

/**
 * Manual reordering: move a complaint above or below another complaint,
 * or set an explicit direction. We implement it as "move complaint A
 * to the position of complaint B" by swapping priorityOrder ranks.
 */
const reorderComplaint = async (complaintId, direction) => {
  if (!["up", "down"].includes(direction)) {
    throw new AppError("Direction must be 'up' or 'down'.", 400);
  }

  const complaint = await Complaint.findById(complaintId);
  if (!complaint) {
    throw new AppError("Complaint not found.", 404);
  }

  // "up" = higher priority = should appear earlier in the newest-first
  // list, so it needs a LARGER priorityOrder than its current neighbor.
  const neighbor =
    direction === "up"
      ? await Complaint.findOne({
          priorityOrder: { $gt: complaint.priorityOrder },
        }).sort({ priorityOrder: 1 })
      : await Complaint.findOne({
          priorityOrder: { $lt: complaint.priorityOrder },
        }).sort({ priorityOrder: -1 });

  if (!neighbor) {
    // Already at the top/bottom — nothing to do
    return complaint;
  }

  const tempOrder = complaint.priorityOrder;
  complaint.priorityOrder = neighbor.priorityOrder;
  neighbor.priorityOrder = tempOrder;

  await complaint.save();
  await neighbor.save();

  return complaint;
};

module.exports = {
  createComplaint,
  getMyComplaints,
  getComplaintById,
  getAllComplaints,
  updateStatus,
  reorderComplaint,
  AppError,
};
