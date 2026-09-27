import api from "./axios";

export const createComplaint = (formData) =>
  api.post("/complaints", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const fetchMyComplaints = () => api.get("/complaints");

export const fetchComplaintStats = () => api.get("/complaints/stats");

export const fetchComplaintById = (id) => api.get(`/complaints/${id}`);
