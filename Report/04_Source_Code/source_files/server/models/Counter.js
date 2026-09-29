const mongoose = require("mongoose");

// Used to atomically generate sequential complaint IDs like HF-0001
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // e.g. "complaintId"
  seq: { type: Number, default: 0 },
});

module.exports = mongoose.model("Counter", counterSchema);
