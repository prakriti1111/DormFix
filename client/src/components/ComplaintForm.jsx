import { useState } from "react";

const PROBLEM_SUGGESTIONS = [
  "Broken window",
  "Flickering tube light",
  "Leaking tap",
  "Broken fan",
  "Damaged door",
  "Electrical problem",
  "Water supply issue",
  "Furniture damage",
  "Other hostel maintenance issue",
];

const ComplaintForm = ({ onSubmit, submitting, error }) => {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [localError, setLocalError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setLocalError("Only JPG, PNG, and WEBP images are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setLocalError("Image must be smaller than 5MB.");
      return;
    }
    setLocalError("");
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (description.trim().length < 5) {
      setLocalError("Description must be at least 5 characters.");
      return;
    }
    setLocalError("");

    const formData = new FormData();
    formData.append("description", description.trim());
    if (image) formData.append("image", image);

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      {(error || localError) && <div className="alert alert-error">{error || localError}</div>}

      <div className="form-group">
        <label>Problem Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the issue in detail (e.g. The tube light in room A-101 flickers constantly)."
          required
        />
        <div style={{ fontSize: "0.78rem", color: "#6b7280", marginTop: "0.3rem" }}>
          Common issues: {PROBLEM_SUGGESTIONS.join(", ")}
        </div>
      </div>

      <div className="form-group">
        <label>Upload Image (optional)</label>
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} />
        {imagePreview && <img src={imagePreview} alt="Preview" className="complaint-image" />}
      </div>

      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? "Submitting..." : "Submit Complaint"}
      </button>
    </form>
  );
};

export default ComplaintForm;
