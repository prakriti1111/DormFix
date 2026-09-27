import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchComplaintById } from "../api/complaintApi";
import StatusBadge from "../components/StatusBadge";

const API_ORIGIN = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
).replace(/\/api\/?$/, "");

const ComplaintDetails = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchComplaintById(id);
        setComplaint(res.data.data.complaint);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load complaint.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="loading-state">Loading...</div>;

  if (error) {
    return (
      <div className="page-container">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  if (!complaint) return null;

  const imageUrl = complaint.imagePath ? `${API_ORIGIN}/${complaint.imagePath}` : null;

  return (
    <div className="page-container">
      <Link to="/resident/dashboard" className="back-link">
        ← Back to Dashboard
      </Link>

      <div className="card complaint-details">
        <div className="complaint-details-header">
          <h2>{complaint.complaintId}</h2>
          <StatusBadge status={complaint.status} isOverdue={complaint.isOverdue} />
        </div>

        <p className="complaint-meta">Room: {complaint.roomNumber}</p>
        <p className="complaint-meta">
          Raised on {new Date(complaint.createdAt).toLocaleString()}
        </p>

        <div className="complaint-description-full">
          <h4>Description</h4>
          <p>{complaint.description}</p>
        </div>

        {imageUrl && (
          <div className="complaint-image">
            <h4>Attached Photo</h4>
            <img src={imageUrl} alt="Complaint" />
          </div>
        )}

        {complaint.status === "RESOLVED" && complaint.resolvedAt && (
          <p className="complaint-meta">
            Resolved on {new Date(complaint.resolvedAt).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
};

export default ComplaintDetails;
