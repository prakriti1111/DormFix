import { useState } from "react";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const ComplaintForm = ({ onSubmit, submitting }) => {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setImage(null);
      setPreview(null);
      return;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only JPG, PNG or WEBP images are allowed.");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setError("Image must be under 5MB.");
      return;
    }
    setError("");
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (description.trim().length < 5) {
      setError("Please describe the issue in at least 5 characters.");
      return;
    }

    setError("");
    const formData = new FormData();
    formData.append("description", description.trim());
    if (image) {
      formData.append("image", image);
    }
    onSubmit(formData);
  };

  return (
    <form className="complaint-form" onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="form-group">
        <label>Describe the issue</label>
        <textarea
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. The tap in the washroom is leaking continuously..."
          required
        />
      </div>

      <div className="form-group">
        <label>Attach a photo (optional)</label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageChange}
        />
        {preview && (
          <div className="image-preview">
            <img src={preview} alt="Preview" />
          </div>
        )}
      </div>

      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? "Submitting..." : "Submit Complaint"}
      </button>
    </form>
  );
};

export default ComplaintForm;
