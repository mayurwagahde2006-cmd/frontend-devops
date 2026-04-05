import axios from "axios";

const planningApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://dev-ops-assistant-1.onrender.com/api',
  withCredentials: true, // ✅ necessary for cookies
});

export default planningApi;