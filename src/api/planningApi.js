import axios from "axios";

// const planningApi = axios.create({
//   baseURL: "http://localhost:5099",
// });
// const planningApi = axios.create({
//   baseURL: "http://10.97.89.236:5099",
// });
const planningApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://dev-ops-assistant-1.onrender.com/api',
  withCredentials: true, // ✅ necessary for cookies
});

export default planningApi;