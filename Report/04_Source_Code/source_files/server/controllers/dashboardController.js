const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/apiResponse");
const dashboardService = require("../services/dashboardService");

// GET /api/dashboard/warden  (warden only)
const getWardenDashboard = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getWardenStats();
  return success(res, 200, "Dashboard stats fetched.", { stats });
});

module.exports = { getWardenDashboard };
