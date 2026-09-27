const STATUS_LABELS = {
  SUBMITTED: "Submitted",
  UNDER_PROGRESS: "Under Progress",
  RESOLVED: "Resolved",
};

const STATUS_CLASSES = {
  SUBMITTED: "status-badge status-submitted",
  UNDER_PROGRESS: "status-badge status-progress",
  RESOLVED: "status-badge status-resolved",
};

const StatusBadge = ({ status, isOverdue }) => {
  return (
    <span className="status-badge-wrapper">
      <span className={STATUS_CLASSES[status] || "status-badge"}>
        {STATUS_LABELS[status] || status}
      </span>
      {isOverdue && status !== "RESOLVED" && (
        <span className="status-badge status-overdue">Overdue</span>
      )}
    </span>
  );
};

export default StatusBadge;
