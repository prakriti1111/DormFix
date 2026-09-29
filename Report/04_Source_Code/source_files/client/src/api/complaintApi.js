import api from "./axios";

export const createComplaint = (formData) =>
  api.post("/complaints", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getMyComplaints = () => api.get("/complaints/my");

export const getComplaintById = (id) => api.get(`/complaints/${id}`);

export const getAllComplaints = (params) =>
  api.get("/complaints", { params });

export const updateComplaintStatus = (id, status) =>
  api.patch(`/complaints/${id}/status`, { status });

export const reorderComplaint = (complaintId, direction) =>
  api.patch("/complaints/reorder", { complaintId, direction });
