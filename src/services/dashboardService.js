import api from "../api";

export const getImportedRepos = () =>
  api.get("/repos/imported");

export const getGithubRepos = () =>
  api.get("/github/userRepos", {
  });

export const deployRepo = (repoId) =>
  api.post(`/deploy/${repoId}`);

export const getCiStatus = (repoId) =>
  api.get(`/ci-status/${repoId}`);


export const deleteRepo = (repoId) =>
  api.delete(`/repos/${repoId}`);

export const deleteAllRepos = () =>
  api.delete("/repos/deleteAll");