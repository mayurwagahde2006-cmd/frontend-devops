import api from "../api";

export const getImportedRepos = () =>
  api.get("/repos/imported");

export const getGithubRepos = () =>
  api.get("/github/userRepos", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("github_token")}`
    }
  });

export const deployRepo = (repoId) =>
  api.post(`/deploy/${repoId}`);

export const getCiStatus = (repoId) =>
  api.get(`/ci-monitor/${repoId}`);
