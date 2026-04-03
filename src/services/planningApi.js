import axios from "axios";

const planningApi = axios.create({
  baseURL: "http://localhost:5115/api",
});

export default planningApi;