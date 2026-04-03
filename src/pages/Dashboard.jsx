import { useState, useEffect } from 'react';
import api from '../api';
import RepoCard from '../components/RepoCard';

const Dashboard = () => {
  const [recentRepos, setRecentRepos] = useState([]);
  const [stats, setStats] = useState({
    repos: 0,
    pipelines: 0,
    deployments: 0,
    suggestions: 0,
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      // Fetch imported repos (DB)
      const importedRes = await api.get("/repos/imported", {
        withCredentials: true
      });
      setRecentRepos(importedRes.data.slice(0, 10));

      // Fetch GitHub live repos
      await api.get("/github/userRepos", {
        withCredentials: true
      });

      // Example: get CI + Deploy status
      let pipelineCount = 0;
      let deploymentCount = 0;

      if (importedRes.data.length > 0) {
        const repoId = importedRes.data[0].id;

        const ciRes = await api.post(`/ci-status/${repoId}`, {}, {
          withCredentials: true
        });

        const deployRes = await api.post(`/deploy/${repoId}`, {}, {
          withCredentials: true
        });

        if (ciRes.data) pipelineCount = 1;
        if (deployRes.data) deploymentCount = 1;
      }

      // Update stats
      setStats({
        repos: importedRes.data.length,
        pipelines: pipelineCount,
        deployments: deploymentCount,
        suggestions: 5
      });

    } catch (error) {
      console.error("Error fetching dashboard data:", error);

      if (error.response?.status === 401) {
        window.location.href = "/";
      }
    }
  };

  return (
    <>
      <div className="page-header flex justify-between items-center mb-8">
        <h1 className="page-title text-3xl font-bold bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-color-light)] bg-clip-text text-transparent">
          Dashboard
        </h1>
      </div>

      {/* Recent Repositories */}
      <div className="section-header flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Recent Repositories</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {recentRepos.map(repo => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>

      {/* Pipeline Status */}
      <div className="section-header mt-10 mb-4">
        <h2 className="text-2xl font-semibold">Pipeline Status</h2>
      </div>

      <div className="bg-[var(--card-bg)] rounded-xl p-6 shadow-custom">
        <div className="flex justify-between relative mb-10">
          {['Code Commit', 'Tests', 'Build', 'Deploy', 'Monitor'].map((step, i) => (
            <div key={step} className="flex flex-col items-center z-10 w-1/5">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 border-4 transition-all
                ${i <= 1 ? 'border-[var(--success-color)] bg-[var(--success-color)] text-white' : ''}
                ${i === 2 ? 'border-[var(--accent-color)] bg-[var(--accent-color)] text-white' : ''}
                ${i > 2 ? 'border-[var(--border-color)] bg-[var(--secondary-bg)]' : ''}
              `}>
                <i className={`fas fa-${i === 0 ? 'code-branch' : i === 1 ? 'vial' : i === 2 ? 'cube' : i === 3 ? 'shipping-fast' : 'chart-line'}`}></i>
              </div>
              <span className="text-xs font-medium text-center">{step}</span>
            </div>
          ))}
          <div className="absolute top-6 left-0 right-0 h-1 bg-[var(--border-color)] -z-0"></div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;