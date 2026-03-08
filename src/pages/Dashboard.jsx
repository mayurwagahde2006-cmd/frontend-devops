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
    // 1️⃣ Fetch imported repos (DB)
    const importedRes = await api.get("/repos/imported");
    setRecentRepos(importedRes.data.slice(0, 10));

    // 2️⃣ Fetch GitHub live repos
    const githubRes = await api.get("/github/userRepos", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("github_token")}`
      }
    });

    // 3️⃣ Example: get CI status for first repo
    let pipelineCount = 0;
    let deploymentCount = 0;

    if (importedRes.data.length > 0) {
      const repoId = importedRes.data[0].id;

      const ciRes = await api.post(`/ci-status/${repoId}`);
      const deployRes = await api.post(`/deploy/${repoId}`);

      if (ciRes.data) pipelineCount = 1;
      if (deployRes.data) deploymentCount = 1;
    }

    // 4️⃣ Update stats properly
    setStats({
      repos: importedRes.data.length,
      pipelines: pipelineCount,
      deployments: deploymentCount,
      suggestions: 5 // until AI endpoint created
    });

  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  }
};


  return (
    <>
      <div className="page-header flex justify-between items-center mb-8">
        <h1 className="page-title text-3xl font-bold bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-color-light)] bg-clip-text text-transparent">
          Dashboard
        </h1>
        <button className="bg-[var(--accent-color)] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[var(--accent-color-dark)] transition-colors flex items-center gap-2">
          <i className="fab fa-github"></i> Import Repository
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { icon: 'github', label: 'Active Repositories', value: stats.repos },
          { icon: 'stream', label: 'Running Pipelines', value: stats.pipelines },
          { icon: 'cloud-upload-alt', label: 'Deployments', value: stats.deployments },
          { icon: 'robot', label: 'AI Suggestions', value: stats.suggestions },
        ].map((stat, idx) => (
          <div key={idx} className="bg-[var(--card-bg)] rounded-xl p-6 shadow-custom hover:-translate-y-1 transition-all animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">{stat.label}</h3>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent-color)] to-[var(--accent-color-light)] flex items-center justify-center text-xl">
                <i className={`fas fa-${stat.icon}`}></i>
              </div>
            </div>
            <div className="text-4xl font-bold text-[var(--accent-color)] mb-2">{stat.value}</div>
            <p className="text-[var(--text-secondary)] text-sm">Connected GitHub repositories</p>
          </div>
        ))}
      </div>

      {/* Recent Repositories */}
      <div className="section-header flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Recent Repositories</h2>
        <button className="bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)] px-4 py-2 rounded-lg hover:bg-[var(--border-color)] transition-colors flex items-center gap-2">
          <i className="fas fa-plus"></i> Add New
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {recentRepos.map(repo => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>

      {/* Pipeline Status (mock) */}
      <div className="section-header mt-10 mb-4">
        <h2 className="text-2xl font-semibold">Pipeline Status</h2>
      </div>

      <div className="bg-[var(--card-bg)] rounded-xl p-6 shadow-custom">
        <div className="flex justify-between relative mb-10">
          {['Code Commit', 'Tests', 'Build', 'Deploy', 'Monitor'].map((step, i) => (
            <div key={step} className="flex flex-col items-center z-10 w-1/5">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 border-4 transition-all
                ${i === 0 ? 'border-[var(--success-color)] bg-[var(--success-color)] text-white' : ''}
                ${i === 1 ? 'border-[var(--success-color)] bg-[var(--success-color)] text-white' : ''}
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

        <div>
          <h3 className="font-semibold mb-3">Current Build: React E-commerce App</h3>
          <div className="bg-[var(--secondary-bg)] rounded-lg p-3 font-mono text-sm max-h-40 overflow-y-auto">
            <div className="py-1"><span className="text-[var(--text-secondary)]">14:32:05</span> <span className="text-[var(--info-color)]">[INFO]</span> Starting build process...</div>
            <div className="py-1"><span className="text-[var(--text-secondary)]">14:32:12</span> <span className="text-[var(--success-color)]">[SUCCESS]</span> Dependencies installed</div>
            <div className="py-1"><span className="text-[var(--text-secondary)]">14:32:45</span> <span className="text-[var(--success-color)]">[SUCCESS]</span> All tests passed (42 tests)</div>
            <div className="py-1"><span className="text-[var(--text-secondary)]">14:33:20</span> <span className="text-[var(--info-color)]">[INFO]</span> Building Docker image...</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;