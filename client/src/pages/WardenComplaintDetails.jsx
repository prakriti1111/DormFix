import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getComplaintById,
  updateComplaintStatus,
} from "../api/complaintApi";
import { getFeedback } from "../api/feedbackApi";
import StatusBadge from "../components/StatusBadge";

const API_ORIGIN = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
).replace("/api", "");

const NEXT_STATUS_OPTIONS = {
  SUBMITTED: ["UNDER_PROGRESS", "RESOLVED"],
  UNDER_PROGRESS: ["RESOLVED"],
  RESOLVED: [],
};

const WardenComplaintDetails = () => {
  const { id } = useParams();

  const [complaint, setComplaint] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await getComplaintById(id);
      const c = res.data.data.complaint;

      setComplaint(c);

      if (c.feedbackSubmitted) {
        const fbRes = await getFeedback(id);
        setFeedback(fbRes.data.data.feedback);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load complaint."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    setError("");

    try {
      const res = await updateComplaintStatus(id, newStatus);
      setComplaint(res.data.data.complaint);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update status."
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container loading-state">
        Loading...
      </div>
    );
  }

  if (error && !complaint) {
    return (
      <div className="page-container">
        <div className="alert alert-error">
          {error}
        </div>

        <Link
          to="/warden/dashboard"
          className="btn btn-secondary"
        >
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  if (!complaint) return null;

  const nextOptions =
    NEXT_STATUS_OPTIONS[complaint.status] || [];

  return (
    <div className="page-container">
      <Link
        to="/warden/dashboard"
        style={{
          fontSize: "0.85rem",
          display: "inline-block",
          marginBottom: "0.25rem",
        }}
      >
        ← Back to Dashboard
      </Link>

      {error && (
        <div
          className="alert alert-error"
          style={{ marginTop: "1rem" }}
        >
          {error}
        </div>
      )}

      <div className="card" style={{ marginTop: "1rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                color: "#b895a8",
                fontSize: "0.72rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 800,
                marginBottom: "0.35rem",
              }}
            >
              Complaint Details
            </div>

            <h2
              style={{
                margin: 0,
                color: "#fbe4d8",
              }}
            >
              {complaint.complaintId}
            </h2>
          </div>

          <div>
            <StatusBadge status={complaint.status} />

            {complaint.isOverdue && (
              <span className="overdue-badge">
                Overdue
              </span>
            )}
          </div>
        </div>

        <div className="detail-grid">
          <div className="detail-item">
            <div className="label">Resident</div>
            <div className="value">
              {complaint.residentName}
            </div>
          </div>

          <div className="detail-item">
            <div className="label">
              Registration Number
            </div>

            <div className="value">
              {complaint.registrationNumber}
            </div>
          </div>

          <div className="detail-item">
            <div className="label">Room Number</div>
            <div className="value">
              {complaint.roomNumber}
            </div>
          </div>

          <div className="detail-item">
            <div className="label">Submitted</div>
            <div className="value">
              {new Date(
                complaint.createdAt
              ).toLocaleString()}
            </div>
          </div>

          <div className="detail-item">
            <div className="label">Last Updated</div>
            <div className="value">
              {new Date(
                complaint.updatedAt
              ).toLocaleString()}
            </div>
          </div>

          {complaint.resolvedAt && (
            <div className="detail-item">
              <div className="label">Resolved On</div>
              <div className="value">
                {new Date(
                  complaint.resolvedAt
                ).toLocaleString()}
              </div>
            </div>
          )}
        </div>

        <div className="detail-item">
          <div className="label">Description</div>
          <div className="value">
            {complaint.description}
          </div>
        </div>

        {complaint.imagePath && (
          <div
            className="detail-item"
            style={{ marginTop: "0.75rem" }}
          >
            <div className="label">
              Attached Image
            </div>

            <img
              src={`${API_ORIGIN}${complaint.imagePath}`}
              alt="Complaint"
              className="complaint-image"
            />
          </div>
        )}

        {nextOptions.length > 0 && (
          <div style={{ marginTop: "1.5rem" }}>
            <div
              className="label"
              style={{
                marginBottom: "0.65rem",
                color: "#dfb6b2",
              }}
            >
              Update Status
            </div>

            <div
              style={{
                display: "flex",
                gap: "0.6rem",
                flexWrap: "wrap",
              }}
            >
              {nextOptions.map((status) => (
                <button
                  key={status}
                  className="btn btn-primary btn-sm"
                  disabled={updating}
                  onClick={() =>
                    handleStatusChange(status)
                  }
                >
                  Mark as{" "}
                  {status.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3 style={{ marginTop: 0 }}>
          Resident Feedback
        </h3>

        {feedback ? (
          <>
            <div className="star-rating">
              {"★".repeat(feedback.rating)}
              {"☆".repeat(5 - feedback.rating)}
            </div>

            {feedback.comment && (
              <p
                style={{
                  color: "#dfb6b2",
                  lineHeight: 1.6,
                }}
              >
                {feedback.comment}
              </p>
            )}

            <div
              style={{
                fontSize: "0.8rem",
                color: "#b895a8",
              }}
            >
              Submitted{" "}
              {new Date(
                feedback.createdAt
              ).toLocaleString()}
            </div>
          </>
        ) : (
          <p style={{ color: "#b895a8" }}>
            No feedback submitted yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default WardenComplaintDetails;