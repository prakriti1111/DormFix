import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMyComplaints, fetchComplaintStats } from "../api/complaintApi";
import ComplaintCard from "../components/ComplaintCard";
import StatisticsCard from "../components/StatisticsCard";

const ResidentDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [complaintsRes, statsRes] = await Promise.all([
          fetchMyComplaints(),
          fetchComplaintStats(),
        ]);
        setComplaints(complaintsRes.data.data.complaints);
        setStats(statsRes.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="loading-state">Loading...</div>;

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <h2>My Complaints</h2>
        <Link to="/resident/complaints/new" className="btn btn-primary">
          + New Complaint
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {stats && (
        <div className="stats-grid">
          <StatisticsCard label="Total" value={stats.total} variant="default" />
          <StatisticsCard label="Submitted" value={stats.submitted} variant="submitted" />
          <StatisticsCard label="Under Progress" value={stats.underProgress} variant="progress" />
          <StatisticsCard label="Resolved" value={stats.resolved} variant="resolved" />
          <StatisticsCard label="Overdue" value={stats.overdue} variant="overdue" />
        </div>
      )}

      {complaints.length === 0 ? (
        <div className="empty-state card">
          <p>You haven't raised any complaints yet.</p>
          <Link to="/resident/complaints/new" className="btn btn-primary">
            Raise your first complaint
          </Link>
        </div>
      ) : (
        <div className="complaints-grid">
          {complaints.map((c) => (
            <ComplaintCard key={c._id} complaint={c} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ResidentDashboard;
