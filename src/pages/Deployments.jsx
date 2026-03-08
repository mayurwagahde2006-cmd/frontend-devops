import { useState, useEffect } from 'react';
import api from '../api';

const Deployments = () => {
  const [importedRepos, setImportedRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [config, setConfig] = useState({
    projectType: 'SPRING_BOOT',
    buildTool: 'MAVEN',
    runtimeVersion: '17',
    branchName: 'main',
    dockerEnabled: false,
    cdEnabled: false,
    deployHookUrl: '',
  });
  const [deploying, setDeploying] = useState(false);

  useEffect(() => {
    api.get('/repos/imported')
      .then(res => setImportedRepos(res.data))
      .catch(err => console.error('Failed to fetch imported repos:', err));
  }, []);

  const handleDeploy = async () => {
    if (!selectedRepo) {
      alert('Please select a repository');
      return;
    }
    setDeploying(true);
    try {
      await api.post(`/deploy/${selectedRepo.id}`, config);
      alert('Deployment triggered successfully!');
    } catch (err) {
      alert('Deployment failed. Check console for details.');
      console.error(err);
    } finally {
      setDeploying(false);
    }
  };

  return (
    <>
      <h1 className="page-title text-3xl font-bold bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-color-light)] bg-clip-text text-transparent mb-8">
        Deployments
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Repository List */}
        <div className="bg-[var(--card-bg)] rounded-xl p-5 shadow-custom">
          <h2 className="text-xl font-semibold mb-4">Repositories</h2>
          {importedRepos.length === 0 ? (
            <p className="text-[var(--text-secondary)]">No repositories imported yet.</p>
          ) : (
            <ul className="space-y-2">
              {importedRepos.map(repo => (
                <li key={repo.id}>
                  <button
                    onClick={() => setSelectedRepo(repo)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedRepo?.id === repo.id
                        ? 'bg-[var(--accent-color)] text-white'
                        : 'hover:bg-[var(--border-color)]'
                    }`}
                  >
                    {repo.repoName}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Configuration Form */}
        <div className="md:col-span-2 bg-[var(--card-bg)] rounded-xl p-5 shadow-custom">
          {selectedRepo ? (
            <>
              <h2 className="text-xl font-semibold mb-4">Deploy {selectedRepo.repoName}</h2>
              <div className="space-y-4">
                {/* Project Type */}
                <div>
                  <label className="block text-sm font-medium mb-1">Project Type</label>
                  <select
                    value={config.projectType}
                    onChange={e => setConfig({...config, projectType: e.target.value})}
                    className="w-full p-2 bg-[var(--secondary-bg)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                  >
                    <option value="SPRING_BOOT">Spring Boot</option>
                    <option value="NODE">Node.js</option>
                    <option value="REACT">React</option>
                    <option value="PYTHON">Python</option>
                  </select>
                </div>

                {/* Build Tool */}
                <div>
                  <label className="block text-sm font-medium mb-1">Build Tool</label>
                  <select
                    value={config.buildTool}
                    onChange={e => setConfig({...config, buildTool: e.target.value})}
                    className="w-full p-2 bg-[var(--secondary-bg)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                  >
                    <option value="MAVEN">Maven</option>
                    <option value="GRADLE">Gradle</option>
                    <option value="NPM">npm</option>
                    <option value="YARN">yarn</option>
                  </select>
                </div>

                {/* Runtime Version */}
                <div>
                  <label className="block text-sm font-medium mb-1">Runtime Version</label>
                  <input
                    type="text"
                    value={config.runtimeVersion}
                    onChange={e => setConfig({...config, runtimeVersion: e.target.value})}
                    placeholder="e.g., 17, 18, 20"
                    className="w-full p-2 bg-[var(--secondary-bg)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                  />
                </div>

                {/* Branch Name */}
                <div>
                  <label className="block text-sm font-medium mb-1">Branch</label>
                  <input
                    type="text"
                    value={config.branchName}
                    onChange={e => setConfig({...config, branchName: e.target.value})}
                    placeholder="main"
                    className="w-full p-2 bg-[var(--secondary-bg)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                  />
                </div>

                {/* Checkboxes */}
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.dockerEnabled}
                      onChange={e => setConfig({...config, dockerEnabled: e.target.checked})}
                      className="rounded border-[var(--border-color)] text-[var(--accent-color)] focus:ring-[var(--accent-color)]"
                    />
                    Enable Docker
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.cdEnabled}
                      onChange={e => setConfig({...config, cdEnabled: e.target.checked})}
                      className="rounded border-[var(--border-color)] text-[var(--accent-color)] focus:ring-[var(--accent-color)]"
                    />
                    Enable CD (build hook)
                  </label>
                </div>

                {/* Deploy Hook URL (conditional) */}
                {config.cdEnabled && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Build Hook URL</label>
                    <input
                      type="url"
                      value={config.deployHookUrl}
                      onChange={e => setConfig({...config, deployHookUrl: e.target.value})}
                      placeholder=""
                      className="w-full p-2 bg-[var(--secondary-bg)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                    />
                  </div>
                )}

                {/* Submit Button */}
                <button
                  onClick={handleDeploy}
                  disabled={deploying}
                  className="w-full bg-[var(--accent-color)] text-white py-3 rounded-lg font-semibold hover:bg-[var(--accent-color-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                  {deploying ? 'Deploying...' : 'Deploy Now'}
                </button>
              </div>
            </>
          ) : (
            <p className="text-[var(--text-secondary)] text-center py-10">
              Select a repository to configure deployment
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Deployments;