const Complaint = require("../models/Complaint");
const Feedback = require("../models/Feedback");

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const submitFeedback = async (complaintObjectId, residentUser, { rating, comment }) => {
  const complaint = await Complaint.findById(complaintObjectId);
  if (!complaint) {
    throw new AppError("Complaint not found.", 404);
  }

  if (complaint.residentId.toString() !== residentUser._id.toString()) {
    throw new AppError(
      "Forbidden. You can only give feedback on your own complaints.",
      403
    );
  }

  if (complaint.status !== "RESOLVED") {
    throw new AppError(
      "Feedback can only be submitted after the complaint is resolved.",
      400
    );
  }

  if (complaint.feedbackSubmitted) {
    throw new AppError("Feedback has already been submitted for this complaint.", 409);
  }

  if (!rating || rating < 1 || rating > 5) {
    throw new AppError("Rating must be between 1 and 5.", 400);
  }

  const feedback = await Feedback.create({
    complaintId: complaint._id,
    residentId: residentUser._id,
    rating,
    comment: (comment || "").trim(),
  });

  complaint.feedbackSubmitted = true;
  await complaint.save();

  return feedback;
};

const getFeedbackForComplaint = async (complaintObjectId, requestingUser) => {
  const complaint = await Complaint.findById(complaintObjectId);
  if (!complaint) {
    throw new AppError("Complaint not found.", 404);
  }

  if (
    requestingUser.role === "resident" &&
    complaint.residentId.toString() !== requestingUser._id.toString()
  ) {
    throw new AppError("Forbidden.", 403);
  }

  const feedback = await Feedback.findOne({ complaintId: complaint._id });
  return feedback; // may be null
};

module.exports = { submitFeedback, getFeedbackForComplaint, AppError };
