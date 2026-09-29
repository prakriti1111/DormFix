/**
 * Seed script — creates a demo warden, demo residents, and sample
 * complaints in various statuses. Run with: npm run seed
 *
 * This is the documented, controlled way to create the initial
 * warden account (wardens are never created via public registration).
 */
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const Complaint = require("../models/Complaint");
const Feedback = require("../models/Feedback");
const Counter = require("../models/Counter");

const WARDEN_PASSWORD = process.env.SEED_WARDEN_PASSWORD || "Warden@123";
const RESIDENT_PASSWORD = process.env.SEED_RESIDENT_PASSWORD || "Resident@123";

const run = async () => {
  await connectDB();

  console.log("Clearing existing data...");
  await Promise.all([
    User.deleteMany({}),
    Complaint.deleteMany({}),
    Feedback.deleteMany({}),
    Counter.deleteMany({}),
  ]);

  console.log("Creating demo warden...");
  const warden = await User.create({
    fullName: "Mr. R. K. Sharma",
    email: "warden@hostelfix.edu",
    password: WARDEN_PASSWORD,
    role: "warden",
  });

  console.log("Creating demo residents...");
  const residentsData = [
    { fullName: "Aarav Mehta", registrationNumber: "REG2024001", roomNumber: "A-101", email: "aarav@hostelfix.edu" },
    { fullName: "Priya Nair", registrationNumber: "REG2024002", roomNumber: "A-102", email: "priya@hostelfix.edu" },
    { fullName: "Rohan Gupta", registrationNumber: "REG2024003", roomNumber: "B-201", email: "rohan@hostelfix.edu" },
    { fullName: "Sneha Iyer", registrationNumber: "REG2024004", roomNumber: "B-202", email: "sneha@hostelfix.edu" },
  ];

  const residents = [];
  for (const data of residentsData) {
    const resident = await User.create({
      ...data,
      password: RESIDENT_PASSWORD,
      role: "resident",
    });
    residents.push(resident);
  }

  console.log("Creating sample complaints...");
  const now = Date.now();
  const sampleComplaints = [
    {
      resident: residents[0],
      description: "The tube light in the room keeps flickering at night.",
      status: "SUBMITTED",
      hoursAgo: 5,
    },
    {
      resident: residents[1],
      description: "Window latch is broken and does not close properly.",
      status: "UNDER_PROGRESS",
      hoursAgo: 30,
    },
    {
      resident: residents[2],
      description: "Tap in the common bathroom on the 2nd floor is leaking continuously.",
      status: "SUBMITTED",
      hoursAgo: 60, // overdue
    },
    {
      resident: residents[3],
      description: "Ceiling fan makes a loud grinding noise when switched on.",
      status: "RESOLVED",
      hoursAgo: 80,
      resolvedHoursAgo: 10,
    },
    {
      resident: residents[0],
      description: "Room door does not lock properly, latch is misaligned.",
      status: "RESOLVED",
      hoursAgo: 100,
      resolvedHoursAgo: 40,
    },
  ];

  let seq = 0;
  for (const item of sampleComplaints) {
    seq += 1;
    const createdAt = new Date(now - item.hoursAgo * 60 * 60 * 1000);
    const resolvedAt =
      item.status === "RESOLVED"
        ? new Date(now - (item.resolvedHoursAgo || 0) * 60 * 60 * 1000)
        : null;
    const isOverdue =
      item.status !== "RESOLVED" && item.hoursAgo > 48 ? true : false;

    const complaint = await Complaint.create({
      complaintId: `HF-${String(seq).padStart(4, "0")}`,
      residentId: item.resident._id,
      residentName: item.resident.fullName,
      registrationNumber: item.resident.registrationNumber,
      roomNumber: item.resident.roomNumber,
      description: item.description,
      status: item.status,
      isOverdue,
      priorityOrder: createdAt.getTime(),
      resolvedAt,
      createdAt,
      updatedAt: resolvedAt || createdAt,
    });

    if (item.status === "RESOLVED") {
      await Feedback.create({
        complaintId: complaint._id,
        residentId: item.resident._id,
        rating: 4,
        comment: "Issue was fixed satisfactorily. Thank you.",
      });
      complaint.feedbackSubmitted = true;
      await complaint.save();
    }
  }

  await Counter.findOneAndUpdate(
    { _id: "complaintId" },
    { $set: { seq } },
    { upsert: true }
  );

  console.log("\nSeed complete.\n");
  console.log("Demo credentials (development only):");
  console.log(`  Warden   -> email: warden@hostelfix.edu   password: ${WARDEN_PASSWORD}`);
  console.log(`  Resident -> email: aarav@hostelfix.edu    password: ${RESIDENT_PASSWORD}`);
  console.log("");

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
