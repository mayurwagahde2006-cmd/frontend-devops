import axios from 'axios';

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080', 
//   withCredentials: true, // send cookies
// });
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://dev-ops-assistant-1.onrender.com', 
  withCredentials: true, // send cookies
});

export default api;