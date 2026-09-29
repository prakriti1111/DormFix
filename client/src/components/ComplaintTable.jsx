import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

const ComplaintTable = ({ complaints, onReorder, showReorder = false }) => {
  if (complaints.length === 0) {
    return <div className="empty-state">No complaints found.</div>;
  }

  return (
    <div className="table-wrapper card">
      <table className="complaint-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Resident</th>
            <th>Reg. No.</th>
            <th>Room</th>
            <th>Description</th>
            <th>Submitted</th>
            <th>Status</th>
            <th>Overdue</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((c) => (
            <tr key={c._id} className={c.isOverdue ? "overdue-row" : ""}>
              <td>{c.complaintId}</td>
              <td>{c.residentName}</td>
              <td>{c.registrationNumber}</td>
              <td>{c.roomNumber}</td>
              <td style={{ maxWidth: "220px", whiteSpace: "normal" }}>
                {c.description.length > 60 ? `${c.description.slice(0, 60)}...` : c.description}
              </td>
              <td>{new Date(c.createdAt).toLocaleDateString()}</td>
              <td><StatusBadge status={c.status} /></td>
              <td>{c.isOverdue ? <span className="overdue-badge">Overdue</span> : "-"}</td>
              <td>
                <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                  <Link to={`/warden/complaints/${c._id}`} className="btn btn-secondary btn-sm">
                    View
                  </Link>
                  {showReorder && (
                    <div className="reorder-btns">
                      <button className="btn btn-secondary btn-sm" onClick={() => onReorder(c._id, "up")}>
                        ↑
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={() => onReorder(c._id, "down")}>
                        ↓
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComplaintTable;
