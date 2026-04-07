import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://dev-ops-assistant-1.onrender.com',
  withCredentials: true, // ✅ necessary for cookies
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // or wherever you store it

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
export default api;