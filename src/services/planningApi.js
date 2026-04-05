import axios from "axios";

const planningApi = axios.create({
  baseURL: "https://dev-ops-assistant-1.onrender.com/api",
});

export default planningApi;