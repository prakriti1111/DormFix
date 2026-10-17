
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
      setError(
        err.response?.data?.message ||
          "Failed to load dashboard stats."
      );
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
      setError(
        err.response?.data?.message ||
          "Failed to load complaints."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    loadComplaints();
   
  }, [filters]);

  const handleReorder = async (complaintId, direction) => {
    try {
      await reorderComplaint(complaintId, direction);
      loadComplaints();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to reorder complaint."
      );
    }
  };

  const maxResolvedPerDay = stats
    ? Math.max(1, ...stats.resolvedPerDay.map((d) => d.count))
    : 1;

    //console.log("Resolved per day:", stats?.resolvedPerDay);

  return (
    <div className="page-container warden-dashboard">
      <div className="dashboard-title-block">
        <div>
          <span className="eyebrow">HOSTEL MANAGEMENT</span>
          <h2>Warden Dashboard</h2>
          <p>Monitor complaints, track resolutions, and manage priorities.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {stats && (
        <>
          <div className="stats-grid">
            <StatisticsCard
              label="Total Complaints"
              value={stats.total}
            />
            <StatisticsCard
              label="Submitted"
              value={stats.submitted}
            />
            <StatisticsCard
              label="Under Progress"
              value={stats.underProgress}
            />
            <StatisticsCard
              label="Resolved"
              value={stats.resolved}
            />
            <StatisticsCard
              label="Overdue"
              value={stats.overdue}
              overdue
            />
            <StatisticsCard
              label="Avg. Resolution (hrs)"
              value={stats.avgResolutionHours ?? "N/A"}
            />
          </div>

          <section className="card resolution-card">
            <div className="resolution-heading">
              <div>
                <span className="eyebrow">PERFORMANCE OVERVIEW</span>
                <h3>Resolution Activity</h3>
                <p>
                  Complaints resolved per day over the last 14 days
                </p>
              </div>

              <div className="resolution-period">
                LAST 14 DAYS
              </div>
            </div>

            <div
              className="resolution-chart"
              role="img"
              aria-label="Bar chart of complaints resolved per day over the last 14 days"
            >
              {stats.resolvedPerDay.map((d) => {
                const barHeight =
                  d.count > 0
                    ? Math.max(
                        (d.count / maxResolvedPerDay) * 100,
                        12
                      )
                    : 0;

                return (
                  <div
                    className="resolution-column"
                    key={d.date}
                    title={`${d.date}: ${d.count} resolved`}
                  >
                    <span className="resolution-count">
                      {d.count > 0 ? d.count : ""}
                    </span>

                    <div className="resolution-bar-area">
                      <div
                        className={`resolution-bar ${
                          d.count === 0 ? "zero" : ""
                        }`}
                        style={{
                          height: d.count > 0 ? `${barHeight}%` : "50px",
                          minHeight: d.count > 0 ? "100px" : "50px",
                        }}
                      />
                    </div>

                    <span className="resolution-date">
                      {new Date(
                        `${d.date.slice(0, 10)}T00:00:00`
                      ).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}

      <div className="section-title">All Complaints</div>

      <FilterControls
        filters={filters}
        onChange={setFilters}
      />

      {loading ? (
        <div className="loading-state">
          Loading complaints...
        </div>
      ) : (
        <ComplaintTable
          complaints={complaints}
          onReorder={handleReorder}
          showReorder={
            filters.sortBy === "priority" || !filters.sortBy
          }
        />
      )}
    </div>
  );
};

export default WardenDashboard;
