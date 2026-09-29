import api from "./axios";

export const registerResident = (payload) =>
  api.post("/auth/register", payload);

export const loginUser = (payload) => api.post("/auth/login", payload);

export const fetchCurrentUser = () => api.get("/auth/me");
