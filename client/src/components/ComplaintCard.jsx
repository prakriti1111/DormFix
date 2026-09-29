import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

const ComplaintCard = ({ complaint, basePath }) => {
  return (
    <div className={`card ${complaint.isOverdue ? "overdue-row" : ""}`} style={{ marginBottom: "0.75rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <strong>{complaint.complaintId}</strong>
          <div style={{ fontSize: "0.85rem", color: "#6b7280", marginTop: "0.2rem" }}>
            {complaint.description.length > 80
              ? `${complaint.description.slice(0, 80)}...`
              : complaint.description}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <StatusBadge status={complaint.status} />
          {complaint.isOverdue && <span className="overdue-badge">Overdue</span>}
        </div>
      </div>
      <div style={{ marginTop: "0.6rem", fontSize: "0.8rem", color: "#6b7280" }}>
        Submitted {new Date(complaint.createdAt).toLocaleString()}
      </div>
      <Link to={`${basePath}/${complaint._id}`} className="btn btn-secondary btn-sm" style={{ marginTop: "0.6rem" }}>
        View Details
      </Link>
    </div>
  );
};

export default ComplaintCard;
