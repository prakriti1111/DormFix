const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/apiResponse");
const feedbackService = require("../services/feedbackService");

// POST /api/complaints/:id/feedback  (resident)
const submitFeedback = asyncHandler(async (req, res) => {
  const feedback = await feedbackService.submitFeedback(
    req.params.id,
    req.user,
    req.body
  );
  return success(res, 201, "Feedback submitted.", { feedback });
});

// GET /api/complaints/:id/feedback  (resident: own only, warden: any)
const getFeedback = asyncHandler(async (req, res) => {
  const feedback = await feedbackService.getFeedbackForComplaint(
    req.params.id,
    req.user
  );
  return success(res, 200, "Feedback fetched.", { feedback });
});

module.exports = { submitFeedback, getFeedback };
