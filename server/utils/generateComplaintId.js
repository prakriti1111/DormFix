const Counter = require("../models/Counter");

// Generates IDs like CMP-2026-0001, resetting the sequence every year.
const generateComplaintId = async () => {
  const year = new Date().getFullYear();
  const counterId = `complaint_${year}`;

  const counter = await Counter.findByIdAndUpdate(
    counterId,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const padded = String(counter.seq).padStart(4, "0");
  return `CMP-${year}-${padded}`;
};

module.exports = generateComplaintId;
