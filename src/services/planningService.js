import planningApi from "../api/planningApi";

export const getProjects = () =>
  planningApi.get("/api/planning/projects");

export const createProject = (data) =>
  planningApi.post("/api/planning/project", data);

export const addMember = (data) =>
  planningApi.post("/api/planning/member", data);

export const addTask = (data) =>
  planningApi.post("/api/planning/task", data);