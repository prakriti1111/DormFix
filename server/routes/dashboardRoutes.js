const express = require("express");
const router = express.Router();
const { getWardenDashboard } = require("../controllers/dashboardController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");

router.get("/warden", protect, authorize("warden"), getWardenDashboard);

module.exports = router;
