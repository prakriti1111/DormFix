import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

const ComplaintCard = ({ complaint }) => {
  const { _id, complaintId, description, status, isOverdue, createdAt, imagePath } =
    complaint;

  const shortDescription =
    description.length > 120 ? `${description.slice(0, 120)}...` : description;

  return (
    <Link to={`/resident/complaints/${_id}`} className="complaint-card card">
      <div className="complaint-card-header">
        <span className="complaint-id">{complaintId}</span>
        <StatusBadge status={status} isOverdue={isOverdue} />
      </div>
      <p className="complaint-description">{shortDescription}</p>
      <div className="complaint-card-footer">
        <span className="complaint-date">
          {new Date(createdAt).toLocaleDateString()}
        </span>
        {imagePath && <span className="complaint-has-image">📷 Attached</span>}
      </div>
    </Link>
  );
};

export default ComplaintCard;
