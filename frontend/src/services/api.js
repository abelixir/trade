const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getToken = () => localStorage.getItem("token");

const request = async (endpoint, options = {}) => {
  const token = getToken();
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const res = await fetch(`${API_URL}${endpoint}`, config);

  // Token expired or invalid → force logout
  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
    throw new Error("Session expired. Please log in again.");
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

// Auth
export const login = (email, password) =>
  request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const register = (name, email, password) =>
  request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

// Trades
export const getTrades = () => request("/api/trades");

export const createTrade = (tradeData) =>
  request("/api/trades", {
    method: "POST",
    body: JSON.stringify(tradeData),
  });

export const updateTrade = (id, tradeData) =>
  request(`/api/trades/${id}`, {
    method: "PUT",
    body: JSON.stringify(tradeData),
  });

export const deleteTrade = (id) =>
  request(`/api/trades/${id}`, {
    method: "DELETE",
  });

// Weekly Analysis
export const getWeeklyAnalyses = () => request("/api/weekly-analysis");

export const createWeeklyAnalysis = (data) =>
  request("/api/weekly-analysis", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateWeeklyAnalysis = (id, data) =>
  request(`/api/weekly-analysis/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteWeeklyAnalysis = (id) =>
  request(`/api/weekly-analysis/${id}`, {
    method: "DELETE",
  });

// Certificates
export const getCertificates = () => request("/api/certificates");

export const createCertificate = (data) =>
  request("/api/certificates", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const deleteCertificate = (id) =>
  request(`/api/certificates/${id}`, {
    method: "DELETE",
  });