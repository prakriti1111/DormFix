const express = require("express");
const router = express.Router();
const {
  createComplaint,
  getMyComplaints,
  getMyStats,
  getComplaintById,
} = require("../controllers/complaintController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");
const upload = require("../middleware/upload");

// All complaint routes require a logged-in resident.
router.use(protect, authorize("resident"));

router.post("/", upload.single("image"), createComplaint);
router.get("/", getMyComplaints);
router.get("/stats", getMyStats);
router.get("/:id", getComplaintById);

module.exports = router;
