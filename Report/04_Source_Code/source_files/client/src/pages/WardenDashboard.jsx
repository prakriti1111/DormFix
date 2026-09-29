import { useEffect, useState } from "react";
import { getWardenDashboard } from "../api/dashboardApi";
import { getAllComplaints, reorderComplaint } from "../api/complaintApi";
import StatisticsCard from "../components/StatisticsCard";
import FilterControls from "../components/FilterControls";
import ComplaintTable from "../components/ComplaintTable";

const WardenDashboard = () => {
  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [filters, setFilters] = useState({ sortBy: "priority" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = async () => {
    try {
      const res = await getWardenDashboard();
      setStats(res.data.data.stats);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard stats.");
    }
  };

  const loadComplaints = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.overdue) params.overdue = filters.overdue;
      if (filters.roomNumber) params.roomNumber = filters.roomNumber;
      if (filters.sortBy) params.sortBy = filters.sortBy;
      const res = await getAllComplaints(params);
      setComplaints(res.data.data.complaints);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load complaints.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    loadComplaints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleReorder = async (complaintId, direction) => {
    try {
      await reorderComplaint(complaintId, direction);
      loadComplaints();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reorder complaint.");
    }
  };

  const maxResolvedPerDay = stats
    ? Math.max(1, ...stats.resolvedPerDay.map((d) => d.count))
    : 1;

  return (
    <div className="page-container">
      <h2>Warden Dashboard</h2>
      {error && <div className="alert alert-error">{error}</div>}

      {stats && (
        <>
          <div className="stats-grid">
            <StatisticsCard label="Total Complaints" value={stats.total} />
            <StatisticsCard label="Submitted" value={stats.submitted} />
            <StatisticsCard label="Under Progress" value={stats.underProgress} />
            <StatisticsCard label="Resolved" value={stats.resolved} />
            <StatisticsCard label="Overdue" value={stats.overdue} overdue />
            <StatisticsCard
              label="Avg. Resolution (hrs)"
              value={stats.avgResolutionHours ?? "N/A"}
            />
          </div>

          <div className="card" style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ marginTop: 0 }}>Complaints Resolved Per Day (last 14 days)</h3>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "100px" }}>
              {stats.resolvedPerDay.map((d) => (
                <div
                  key={d.date}
                  title={`${d.date}: ${d.count}`}
                  style={{
                    flex: 1,
                    background: "#1e4d8b",
                    height: `${(d.count / maxResolvedPerDay) * 100}%`,
                    minHeight: d.count > 0 ? "4px" : "1px",
                    borderRadius: "2px",
                  }}
                />
              ))}
            </div>
          </div>
        </>
      )}

      <div className="section-title">All Complaints</div>
      <FilterControls filters={filters} onChange={setFilters} />

      {loading ? (
        <div className="loading-state">Loading complaints...</div>
      ) : (
        <ComplaintTable
          complaints={complaints}
          onReorder={handleReorder}
          showReorder={filters.sortBy === "priority" || !filters.sortBy}
        />
      )}
    </div>
  );
};

export default WardenDashboard;
