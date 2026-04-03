import axios from "axios";

const planningApi = axios.create({
  baseURL: "http://localhost:5099",
});
// const planningApi = axios.create({
//   baseURL: "http://10.97.89.236:5099",
// });

export default planningApi;