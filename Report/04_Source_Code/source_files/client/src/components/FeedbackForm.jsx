import { useState } from "react";

const FeedbackForm = ({ onSubmit, submitting, error }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating || rating < 1 || rating > 5) {
      setLocalError("Please select a rating between 1 and 5.");
      return;
    }
    setLocalError("");
    onSubmit({ rating, comment: comment.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ marginTop: "1rem" }}>
      <h3 style={{ marginTop: 0 }}>Give Feedback</h3>
      {(error || localError) && <div className="alert alert-error">{error || localError}</div>}

      <div className="form-group">
        <label>Rating</label>
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              onClick={() => setRating(n)}
              style={{ cursor: "pointer", marginRight: "0.2rem" }}
            >
              {n <= rating ? "★" : "☆"}
            </span>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Comment (optional)</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={500}
          placeholder="Share your experience with how this complaint was handled."
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? "Submitting..." : "Submit Feedback"}
      </button>
    </form>
  );
};

export default FeedbackForm;
