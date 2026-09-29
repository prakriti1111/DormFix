const Counter = require("../models/Counter");

/**
 * Atomically increments the "complaintId" counter and returns a
 * formatted ID like HF-0001, HF-0002, ... Using findOneAndUpdate with
 * upsert avoids race conditions under concurrent requests.
 */
const generateComplaintId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { _id: "complaintId" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return `HF-${String(counter.seq).padStart(4, "0")}`;
};

module.exports = generateComplaintId;
