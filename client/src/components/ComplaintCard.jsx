import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

const ComplaintCard = ({ complaint, basePath }) => {
  return (
    <div
      className={`card ${
        complaint.isOverdue ? "overdue-row" : ""
      }`}
      style={{
        marginBottom: "0.85rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              color: "#b895a8",
              fontSize: "0.7rem",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              fontWeight: 800,
              marginBottom: "0.25rem",
            }}
          >
            Complaint
          </div>

          <strong
            style={{
              fontSize: "1rem",
            }}
          >
            {complaint.complaintId}
          </strong>

          <div
            style={{
              fontSize: "0.85rem",
              color: "#b895a8",
              marginTop: "0.4rem",
              lineHeight: 1.5,
            }}
          >
            {complaint.description.length > 80
              ? `${complaint.description.slice(
                  0,
                  80
                )}...`
              : complaint.description}
          </div>
        </div>

        <div
          style={{
            textAlign: "right",
            whiteSpace: "nowrap",
          }}
        >
          <StatusBadge
            status={complaint.status}
          />

          {complaint.isOverdue && (
            <span className="overdue-badge">
              Overdue
            </span>
          )}
        </div>
      </div>

      <div
        style={{
          marginTop: "0.9rem",
          paddingTop: "0.75rem",
          borderTop:
            "1px solid rgba(223,182,178,0.1)",
          fontSize: "0.76rem",
          color: "#8f7387",
        }}
      >
        Submitted{" "}
        {new Date(
          complaint.createdAt
        ).toLocaleString()}
      </div>

      <Link
        to={`${basePath}/${complaint._id}`}
        className="btn btn-secondary btn-sm"
        style={{ marginTop: "0.75rem" }}
      >
        View Details →
      </Link>
    </div>
  );
};

export default ComplaintCard;