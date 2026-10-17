import { useState } from "react";

const FeedbackForm = ({
  onSubmit,
  submitting,
  error,
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [localError, setLocalError] =
    useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!rating || rating < 1 || rating > 5) {
      setLocalError(
        "Please select a rating between 1 and 5."
      );
      return;
    }

    setLocalError("");

    onSubmit({
      rating,
      comment: comment.trim(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card"
      style={{ marginTop: "1rem" }}
    >
      <div
        style={{
          color: "#dfb6b2",
          fontSize: "0.7rem",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          fontWeight: 800,
          marginBottom: "0.35rem",
        }}
      >
        Complaint Resolved
      </div>

      <h3 style={{ marginTop: 0 }}>
        Share your feedback
      </h3>

      <p
        style={{
          color: "#b895a8",
          fontSize: "0.86rem",
          marginTop: "-0.5rem",
        }}
      >
        Tell us how your maintenance request
        was handled.
      </p>

      {(error || localError) && (
        <div className="alert alert-error">
          {error || localError}
        </div>
      )}

      <div className="form-group">
        <label>Rating</label>

        <div
          className="star-rating"
          style={{
            display: "flex",
            gap: "0.35rem",
          }}
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              onClick={() => setRating(n)}
              style={{
                cursor: "pointer",
                fontSize: "1.7rem",
              }}
            >
              {n <= rating ? "★" : "☆"}
            </span>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Comment — Optional</label>

        <textarea
          value={comment}
          onChange={(e) =>
            setComment(e.target.value)
          }
          maxLength={500}
          placeholder="Share your experience with how this complaint was handled."
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={submitting}
      >
        {submitting
          ? "Submitting..."
          : "Submit Feedback"}
      </button>
    </form>
  );
};

export default FeedbackForm;