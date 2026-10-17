const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const Complaint = require("../../models/Complaint");
const Counter = require("../../models/Counter");

const HOUR = 60 * 60 * 1000;
let n = 0;

const tokenFor = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

const createResident = async (overrides = {}) => {
  n += 1;
  return User.create({
    fullName: `Resident ${n}`,
    registrationNumber: `REGT${String(n).padStart(4, "0")}`,
    roomNumber: `A-${100 + n}`,
    email: `resident${n}@dormfix.test`,
    password: "Resident@123",
    role: "resident",
    ...overrides,
  });
};

const createWarden = async (overrides = {}) => {
  n += 1;
  return User.create({
    fullName: "Test Warden",
    email: `warden${n}@dormfix.test`,
    password: "Warden@123",
    role: "warden",
    ...overrides,
  });
};

/** Insert a complaint directly (bypasses the API) with a chosen age. */
const createComplaint = async (resident, overrides = {}) => {
  const { hoursAgo = 0, ...rest } = overrides;
  const createdAt = new Date(Date.now() - hoursAgo * HOUR);
  const counter = await Counter.findOneAndUpdate(
    { _id: "complaintId" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return Complaint.create({
    complaintId: `HF-${String(counter.seq).padStart(4, "0")}`,
    residentId: resident._id,
    residentName: resident.fullName,
    registrationNumber: resident.registrationNumber,
    roomNumber: resident.roomNumber,
    description: "Seeded test complaint: fan is noisy.",
    status: "SUBMITTED",
    priorityOrder: createdAt.getTime(),
    createdAt,
    ...rest,
  });
};

// Tiny valid 1x1 PNG (so the upload is a real image)
const PNG_1x1 = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64"
);

module.exports = {
  HOUR,
  tokenFor,
  createResident,
  createWarden,
  createComplaint,
  PNG_1x1,
};
