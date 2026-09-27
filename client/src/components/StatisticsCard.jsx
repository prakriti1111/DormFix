const StatisticsCard = ({ label, value, variant = "default" }) => {
  return (
    <div className={`stat-card stat-card-${variant} card`}>
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
};

export default StatisticsCard;
