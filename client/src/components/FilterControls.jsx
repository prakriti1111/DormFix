const FilterControls = ({ filters, onChange }) => {
  const handle = (field) => (e) => onChange({ ...filters, [field]: e.target.value });

  return (
    <div className="filters-bar card">
      <div className="form-group">
        <label>Status</label>
        <select value={filters.status || ""} onChange={handle("status")}>
          <option value="">All</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="UNDER_PROGRESS">Under Progress</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>

      <div className="form-group">
        <label>Overdue</label>
        <select value={filters.overdue || ""} onChange={handle("overdue")}>
          <option value="">All</option>
          <option value="true">Overdue only</option>
          <option value="false">Non-overdue only</option>
        </select>
      </div>

      <div className="form-group">
        <label>Room Number</label>
        <input
          type="text"
          placeholder="e.g. A-101"
          value={filters.roomNumber || ""}
          onChange={handle("roomNumber")}
        />
      </div>

      <div className="form-group">
        <label>Sort By</label>
        <select value={filters.sortBy || "priority"} onChange={handle("sortBy")}>
          <option value="priority">Manual Priority</option>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="status">Status</option>
          <option value="resolutionDate">Resolution Date</option>
          <option value="overdue">Overdue First</option>
        </select>
      </div>
    </div>
  );
};

export default FilterControls;
