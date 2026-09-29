import api from "./axios";

export const submitFeedback = (complaintId, payload) =>
  api.post(`/complaints/${complaintId}/feedback`, payload);

export const getFeedback = (complaintId) =>
  api.get(`/complaints/${complaintId}/feedback`);
