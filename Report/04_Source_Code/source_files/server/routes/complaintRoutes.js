const express = require("express");
const router = express.Router();
const {
  createComplaint,
  getMyComplaints,
  getComplaintById,
  getAllComplaints,
  updateStatus,
  reorderComplaint,
} = require("../controllers/complaintController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");
const upload = require("../middleware/upload");

// All complaint routes require authentication
router.use(protect);

// Resident routes
router.post(
  "/",
  authorize("resident"),
  upload.single("image"),
  createComplaint
);
router.get("/my", authorize("resident"), getMyComplaints);

// Warden routes
router.get("/", authorize("warden"), getAllComplaints);
router.patch("/reorder", authorize("warden"), reorderComplaint);
router.patch("/:id/status", authorize("warden"), updateStatus);

// Shared (ownership checked inside service for residents)
router.get("/:id", getComplaintById);

module.exports = router;
