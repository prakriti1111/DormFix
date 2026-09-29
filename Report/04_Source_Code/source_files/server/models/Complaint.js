const mongoose = require("mongoose");

const COMPLAINT_STATUSES = ["SUBMITTED", "UNDER_PROGRESS", "RESOLVED"];

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    residentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    residentName: { type: String, required: true, trim: true },
    registrationNumber: { type: String, required: true, trim: true },
    roomNumber: { type: String, required: true, trim: true },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: 5,
      maxlength: 1000,
    },
    imagePath: { type: String, default: null },
    status: {
      type: String,
      enum: COMPLAINT_STATUSES,
      default: "SUBMITTED",
      index: true,
    },
    isOverdue: { type: Boolean, default: false },
    priorityOrder: { type: Number, required: true, index: true },
    resolvedAt: { type: Date, default: null },
    feedbackSubmitted: { type: Boolean, default: false },
  },
  { timestamps: true } // createdAt, updatedAt
);

complaintSchema.index({ createdAt: -1 });
complaintSchema.index({ priorityOrder: -1 });

module.exports = mongoose.model("Complaint", complaintSchema);
module.exports.COMPLAINT_STATUSES = COMPLAINT_STATUSES;
