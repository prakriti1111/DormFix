// A complaint is considered overdue if it hasn't been resolved within this window.
const OVERDUE_THRESHOLD_HOURS = 48;

const isOverdue = (complaint) => {
  if (!complaint || complaint.status === "RESOLVED") return false;
  const hoursSinceCreated =
    (Date.now() - new Date(complaint.createdAt).getTime()) / (1000 * 60 * 60);
  return hoursSinceCreated > OVERDUE_THRESHOLD_HOURS;
};

// Attaches a fresh (always up-to-date) isOverdue flag to a Mongoose doc or plain object.
const withOverdueFlag = (doc) => {
  const obj = doc.toObject ? doc.toObject() : doc;
  return { ...obj, isOverdue: isOverdue(obj) };
};

module.exports = { isOverdue, withOverdueFlag, OVERDUE_THRESHOLD_HOURS };
