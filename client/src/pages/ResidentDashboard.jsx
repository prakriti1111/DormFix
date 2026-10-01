import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyComplaints } from "../api/complaintApi";
import StatisticsCard from "../components/StatisticsCard";
import ComplaintCard from "../components/ComplaintCard";
import useAuth from "../hooks/useAuth";

const ResidentDashboard = () => {
  const { user } = useAuth();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadComplaints = async () => {
    setLoading(true);

    try {
      const res = await getMyComplaints();
      setComplaints(res.data.data.complaints);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load complaints."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const total = complaints.length;
  const submitted = complaints.filter(
    (c) => c.status === "SUBMITTED"
  ).length;

  const underProgress = complaints.filter(
    (c) => c.status === "UNDER_PROGRESS"
  ).length;

  const resolved = complaints.filter(
    (c) => c.status === "RESOLVED"
  ).length;

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <div>
          <div
            style={{
              color: "#dfb6b2",
              fontSize: "0.72rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontWeight: 800,
              marginBottom: "0.35rem",
            }}
          >
            Resident Dashboard
          </div>

          <h2 style={{ margin: 0 }}>
            Welcome, {user?.fullName}
          </h2>

          <div
            style={{
              color: "#6b7280",
              fontSize: "0.9rem",
              marginTop: "0.35rem",
            }}
          >
            Room {user?.roomNumber}
          </div>
        </div>

        <Link
          to="/resident/complaints/new"
          className="btn btn-primary"
        >
          + Create Complaint
        </Link>
      </div>

      <div className="stats-grid">
        <StatisticsCard
          label="Total Complaints"
          value={total}
        />

        <StatisticsCard
          label="Submitted"
          value={submitted}
        />

        <StatisticsCard
          label="Under Progress"
          value={underProgress}
        />

        <StatisticsCard
          label="Resolved"
          value={resolved}
        />
      </div>

      <div className="section-title">
        Complaint History
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          Loading complaints...
        </div>
      ) : complaints.length === 0 ? (
        <div className="empty-state card">
          <div
            style={{
              fontSize: "2rem",
              marginBottom: "0.75rem",
            }}
          >
            ◇
          </div>

          <div
            style={{
              color: "#fbe4d8",
              fontWeight: 700,
              marginBottom: "0.4rem",
            }}
          >
            No complaints yet
          </div>

          <div>
            You haven't submitted any complaints yet.
          </div>

          <div style={{ marginTop: "1rem" }}>
            <Link
              to="/resident/complaints/new"
              className="btn btn-primary"
            >
              Submit your first complaint
            </Link>
          </div>
        </div>
      ) : (
        complaints.map((c) => (
          <ComplaintCard
            key={c._id}
            complaint={c}
            basePath="/resident/complaints"
          />
        ))
      )}
    </div>
  );
};

export default ResidentDashboard;