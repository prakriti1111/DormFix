const express = require("express");
const router = express.Router({ mergeParams: true });
const { submitFeedback, getFeedback } = require("../controllers/feedbackController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");

router.use(protect);

// POST /api/complaints/:id/feedback  (resident only)
router.post("/", authorize("resident"), submitFeedback);

// GET /api/complaints/:id/feedback  (resident: own, warden: any — checked in service)
router.get("/", getFeedback);

module.exports = router;
