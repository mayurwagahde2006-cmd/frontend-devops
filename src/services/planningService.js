import planningApi from "../api/planningApi";

export const getProjects = () =>
  planningApi.get("/api/planning/projects");

export const createProject = (data) =>
  planningApi.post("/api/planning/project", data);

// ✅ UPDATED
export const addMember = (projectId, data) =>
  planningApi.post(`/api/planning/project/${projectId}/member`, data);

// ✅ UPDATED
export const addTask = (projectId, data) =>
  planningApi.post(`/api/planning/project/${projectId}/task`, data);