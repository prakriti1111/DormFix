const Complaint = require("../models/Complaint");
const generateComplaintId = require("../utils/generateComplaintId");
const { withOverdueFlag } = require("../utils/overdue");

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const createComplaint = async ({ resident, description, imagePath }) => {
  const complaintId = await generateComplaintId();

  const complaint = await Complaint.create({
    complaintId,
    residentId: resident._id,
    residentName: resident.fullName,
    registrationNumber: resident.registrationNumber,
    roomNumber: resident.roomNumber,
    description,
    imagePath,
    status: "SUBMITTED",
    priorityOrder: Date.now(),
  });

  return withOverdueFlag(complaint);
};

const getComplaintsByResident = async (residentId) => {
  const complaints = await Complaint.find({ residentId }).sort({ createdAt: -1 });
  return complaints.map(withOverdueFlag);
};

const getComplaintByIdForResident = async (complaintId, residentId) => {
  const complaint = await Complaint.findById(complaintId);

  if (!complaint) {
    throw new AppError("Complaint not found.", 404);
  }
  if (complaint.residentId.toString() !== residentId.toString()) {
    throw new AppError("You are not authorized to view this complaint.", 403);
  }

  return withOverdueFlag(complaint);
};

const getResidentStats = async (residentId) => {
  const complaints = await Complaint.find({ residentId });
  const flagged = complaints.map(withOverdueFlag);

  return {
    total: flagged.length,
    submitted: flagged.filter((c) => c.status === "SUBMITTED").length,
    underProgress: flagged.filter((c) => c.status === "UNDER_PROGRESS").length,
    resolved: flagged.filter((c) => c.status === "RESOLVED").length,
    overdue: flagged.filter((c) => c.isOverdue).length,
  };
};

module.exports = {
  createComplaint,
  getComplaintsByResident,
  getComplaintByIdForResident,
  getResidentStats,
  AppError,
};
