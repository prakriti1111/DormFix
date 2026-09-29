const OVERDUE_THRESHOLD_MS = 48 * 60 * 60 * 1000; // 48 hours

/**
 * Computes whether a complaint should be flagged overdue.
 * Resolved complaints are never overdue. Calculation is based on
 * server timestamps only — never trusts a frontend-supplied value.
 */
const computeIsOverdue = (complaint) => {
  if (complaint.status === "RESOLVED") return false;
  const age = Date.now() - new Date(complaint.createdAt).getTime();
  return age > OVERDUE_THRESHOLD_MS;
};

/**
 * Recalculates and persists isOverdue for a single complaint document
 * if it has changed. Returns the (possibly updated) document.
 */
const refreshOverdueStatus = async (complaintDoc) => {
  const shouldBeOverdue = computeIsOverdue(complaintDoc);
  if (complaintDoc.isOverdue !== shouldBeOverdue) {
    complaintDoc.isOverdue = shouldBeOverdue;
    await complaintDoc.save();
  }
  return complaintDoc;
};

/**
 * Bulk refresh for a list of complaint documents (e.g. before listing).
 */
const refreshOverdueForList = async (complaints) => {
  const bulkOps = [];
  for (const c of complaints) {
    const shouldBeOverdue = computeIsOverdue(c);
    if (c.isOverdue !== shouldBeOverdue) {
      c.isOverdue = shouldBeOverdue;
      bulkOps.push({
        updateOne: {
          filter: { _id: c._id },
          update: { $set: { isOverdue: shouldBeOverdue } },
        },
      });
    }
  }
  if (bulkOps.length > 0) {
    const Complaint = require("../models/Complaint");
    await Complaint.bulkWrite(bulkOps);
  }
  return complaints;
};

module.exports = {
  OVERDUE_THRESHOLD_MS,
  computeIsOverdue,
  refreshOverdueStatus,
  refreshOverdueForList,
};
