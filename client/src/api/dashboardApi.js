import api from "./axios";

export const getWardenDashboard = () => api.get("/dashboard/warden");
