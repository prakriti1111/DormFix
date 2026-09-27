const asyncHandler = require("../utils/asyncHandler");
const { success, error } = require("../utils/apiResponse");
const complaintService = require("../services/complaintService");

// POST /api/complaints
const createComplaint = asyncHandler(async (req, res) => {
  const { description } = req.body;

  if (!description || description.trim().length < 5) {
    return error(res, 400, "Description must be at least 5 characters long.");
  }

  const imagePath = req.file ? `uploads/${req.file.filename}` : null;

  const complaint = await complaintService.createComplaint({
    resident: req.user,
    description: description.trim(),
    imagePath,
  });

  return success(res, 201, "Complaint submitted successfully.", { complaint });
});

// GET /api/complaints
const getMyComplaints = asyncHandler(async (req, res) => {
  const complaints = await complaintService.getComplaintsByResident(req.user._id);
  return success(res, 200, "Complaints fetched.", { complaints });
});

// GET /api/complaints/stats
const getMyStats = asyncHandler(async (req, res) => {
  const stats = await complaintService.getResidentStats(req.user._id);
  return success(res, 200, "Statistics fetched.", stats);
});

// GET /api/complaints/:id
const getComplaintById = asyncHandler(async (req, res) => {
  const complaint = await complaintService.getComplaintByIdForResident(
    req.params.id,
    req.user._id
  );
  return success(res, 200, "Complaint fetched.", { complaint });
});

module.exports = { createComplaint, getMyComplaints, getMyStats, getComplaintById };
