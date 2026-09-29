import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createComplaint } from "../api/complaintApi";
import ComplaintForm from "../components/ComplaintForm";

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
      <h2>Submit a New Complaint</h2>
      <ComplaintForm onSubmit={handleSubmit} submitting={submitting} error={error} />
    </div>
  );
};

export default NewComplaint;
