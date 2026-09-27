import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ComplaintForm from "../components/ComplaintForm";
import { createComplaint } from "../api/complaintApi";

const NewComplaint = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setError("");
    try {
      const res = await createComplaint(formData);
      const complaint = res.data.data.complaint;
      navigate(`/resident/complaints/${complaint._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit complaint.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-box card">
        <h2>Raise a New Complaint</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <ComplaintForm onSubmit={handleSubmit} submitting={submitting} />
      </div>
    </div>
  );
};

export default NewComplaint;
