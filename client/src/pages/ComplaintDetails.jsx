import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getComplaintById } from "../api/complaintApi";
import { submitFeedback, getFeedback } from "../api/feedbackApi";
import StatusBadge from "../components/StatusBadge";
import FeedbackForm from "../components/FeedbackForm";

const API_ORIGIN = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
).replace("/api", "");

const ComplaintDetails = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedbackError, setFeedbackError] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await getComplaintById(id);
      const c = res.data.data.complaint;

      setComplaint(c);

      if (c.status === "RESOLVED" && c.feedbackSubmitted) {
        const fbRes = await getFeedback(id);
        setFeedback(fbRes.data.data.feedback);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load complaint.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleFeedbackSubmit = async (payload) => {
    setSubmittingFeedback(true);
    setFeedbackError("");

    try {
      const res = await submitFeedback(id, payload);
      setFeedback(res.data.data.feedback);
      setComplaint({ ...complaint, feedbackSubmitted: true });
    } catch (err) {
      setFeedbackError(
        err.response?.data?.message || "Failed to submit feedback."
      );
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (loading) {
    return <div className="page-container loading-state">Loading...</div>;
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="alert alert-error">{error}</div>

        <Link to="/resident/dashboard" className="btn btn-secondary">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  if (!complaint) return null;

  return (
    <div className="page-container">
      <Link
        to="/resident/dashboard"
        style={{
          fontSize: "0.85rem",
          display: "inline-block",
          marginBottom: "0.25rem",
        }}
      >
        ← Back to Dashboard
      </Link>

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
              Complaint
            </div>

            <h2
              style={{
                margin: 0,
                color: "#fbe4d8",
                fontSize: "1.65rem",
              }}
            >
              {complaint.complaintId}
            </h2>
          </div>

          <div>
            <StatusBadge status={complaint.status} />

            {complaint.isOverdue && (
              <span className="overdue-badge">Overdue</span>
            )}
          </div>
        </div>

        <div className="detail-grid">
          <div className="detail-item">
            <div className="label">Room Number</div>
            <div className="value">{complaint.roomNumber}</div>
          </div>

          <div className="detail-item">
            <div className="label">Submitted</div>
            <div className="value">
              {new Date(complaint.createdAt).toLocaleString()}
            </div>
          </div>

          <div className="detail-item">
            <div className="label">Last Updated</div>
            <div className="value">
              {new Date(complaint.updatedAt).toLocaleString()}
            </div>
          </div>

          {complaint.resolvedAt && (
            <div className="detail-item">
              <div className="label">Resolved On</div>
              <div className="value">
                {new Date(complaint.resolvedAt).toLocaleString()}
              </div>
            </div>
          )}
        </div>

        <div className="detail-item">
          <div className="label">Description</div>
          <div className="value">{complaint.description}</div>
        </div>

        {complaint.imagePath && (
          <div
            className="detail-item"
            style={{ marginTop: "0.75rem" }}
          >
            <div className="label">Attached Image</div>

            <img
              src={`${API_ORIGIN}${complaint.imagePath}`}
              alt="Complaint"
              className="complaint-image"
            />
          </div>
        )}
      </div>

      {complaint.status === "RESOLVED" &&
        !complaint.feedbackSubmitted && (
          <FeedbackForm
            onSubmit={handleFeedbackSubmit}
            submitting={submittingFeedback}
            error={feedbackError}
          />
        )}

      {feedback && (
        <div className="card" style={{ marginTop: "1rem" }}>
          <h3 style={{ marginTop: 0 }}>Your Feedback</h3>

          <div className="star-rating">
            {"★".repeat(feedback.rating)}
            {"☆".repeat(5 - feedback.rating)}
          </div>

          {feedback.comment && <p>{feedback.comment}</p>}

          <div
            style={{
              fontSize: "0.8rem",
              color: "#b895a8",
            }}
          >
            Submitted {new Date(feedback.createdAt).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintDetails;