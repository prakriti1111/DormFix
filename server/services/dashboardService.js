const Complaint = require("../models/Complaint");
const { refreshOverdueForList } = require("../utils/overdue");

const getWardenStats = async () => {
  const complaints = await Complaint.find({});
  await refreshOverdueForList(complaints);

  const total = complaints.length;
  const submitted = complaints.filter((c) => c.status === "SUBMITTED").length;
  const underProgress = complaints.filter(
    (c) => c.status === "UNDER_PROGRESS"
  ).length;
  const resolved = complaints.filter((c) => c.status === "RESOLVED").length;
  const overdue = complaints.filter((c) => c.isOverdue).length;

  const resolvedComplaints = complaints.filter(
    (c) => c.status === "RESOLVED" && c.resolvedAt
  );
  let avgResolutionHours = null;
  if (resolvedComplaints.length > 0) {
    const totalHours = resolvedComplaints.reduce((sum, c) => {
      const hours =
        (new Date(c.resolvedAt) - new Date(c.createdAt)) / (1000 * 60 * 60);
      return sum + hours;
    }, 0);
    avgResolutionHours = Number((totalHours / resolvedComplaints.length).toFixed(1));
  }

  // Resolved-per-day for the last 14 days (simple chart data)
  const days = {};
  const now = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days[key] = 0;
  }
  resolvedComplaints.forEach((c) => {
    const key = new Date(c.resolvedAt).toISOString().slice(0, 10);
    if (key in days) days[key] += 1;
  });
  const resolvedPerDay = Object.entries(days).map(([date, count]) => ({
    date,
    count,
  }));

  return {
    total,
    submitted,
    underProgress,
    resolved,
    overdue,
    avgResolutionHours,
    resolvedPerDay,
  };
};

module.exports = { getWardenStats };
