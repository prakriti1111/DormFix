const StatisticsCard = ({ label, value, overdue }) => (
  <div className={`stat-card ${overdue ? "overdue" : ""}`}>
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
  </div>
);

export default StatisticsCard;
