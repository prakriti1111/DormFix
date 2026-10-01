const STATUS_LABELS = {
  SUBMITTED: "Submitted",
  UNDER_PROGRESS: "Under Progress",
  RESOLVED: "Resolved",
};

const StatusBadge = ({ status }) => (
  <span
    className={`status-badge status-${status}`}
  >
    {STATUS_LABELS[status] || status}
  </span>
);

export default StatusBadge;