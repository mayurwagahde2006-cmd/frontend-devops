import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://dev-ops-assistant-1.onrender.com',
  withCredentials: true, // ✅ necessary for cookies
});
// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
//   withCredentials: true, // ✅ necessary for cookies
// });

export default api;