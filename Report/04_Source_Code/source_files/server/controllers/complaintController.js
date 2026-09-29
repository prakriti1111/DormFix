const asyncHandler = require("../utils/asyncHandler");
const { success, error } = require("../utils/apiResponse");
const complaintService = require("../services/complaintService");
const { COMPLAINT_STATUSES } = require("../models/Complaint");

// POST /api/complaints  (resident)
const createComplaint = asyncHandler(async (req, res) => {
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
  const complaint = await complaintService.createComplaint(
    req.user,
    req.body,
    imagePath
  );
  return success(res, 201, "Complaint submitted successfully.", { complaint });
});

// GET /api/complaints/my  (resident)
const getMyComplaints = asyncHandler(async (req, res) => {
  const complaints = await complaintService.getMyComplaints(req.user._id);
  return success(res, 200, "Complaints fetched.", { complaints });
});

// GET /api/complaints/:id  (resident: own only, warden: any)
const getComplaintById = asyncHandler(async (req, res) => {
  const complaint = await complaintService.getComplaintById(
    req.params.id,
    req.user
  );
  return success(res, 200, "Complaint fetched.", { complaint });
});

// GET /api/complaints  (warden only)
const getAllComplaints = asyncHandler(async (req, res) => {
  const { status, overdue, roomNumber, sortBy } = req.query;

  if (status && !COMPLAINT_STATUSES.includes(status)) {
    return error(res, 400, "Invalid status filter.");
  }

  const complaints = await complaintService.getAllComplaints({
    status,
    overdue,
    roomNumber,
    sortBy,
  });
  return success(res, 200, "Complaints fetched.", { complaints });
});

// PATCH /api/complaints/:id/status  (warden only)
const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!status || !COMPLAINT_STATUSES.includes(status)) {
    return error(res, 400, "A valid status is required.");
  }
  const complaint = await complaintService.updateStatus(req.params.id, status);
  return success(res, 200, "Status updated.", { complaint });
});

// PATCH /api/complaints/reorder  (warden only)
// body: { complaintId: <mongo _id>, direction: "up" | "down" }
const reorderComplaint = asyncHandler(async (req, res) => {
  const { complaintId, direction } = req.body;
  if (!complaintId || !direction) {
    return error(res, 400, "complaintId and direction are required.");
  }
  const complaint = await complaintService.reorderComplaint(
    complaintId,
    direction
  );
  return success(res, 200, "Complaint reordered.", { complaint });
});

module.exports = {
  createComplaint,
  getMyComplaints,
  getComplaintById,
  getAllComplaints,
  updateStatus,
  reorderComplaint,
};
