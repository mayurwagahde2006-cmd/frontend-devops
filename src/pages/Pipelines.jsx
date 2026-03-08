import { useState, useEffect } from 'react';
import api from '../api';

const Pipelines = () => {
  const [importedRepos, setImportedRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [ciStatus, setCiStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch all imported repos for the logged-in user
    api.get('/repos/imported')
      .then(res => setImportedRepos(res.data))
      .catch(err => console.error('Failed to fetch imported repos:', err));
  }, []);

  const fetchCIStatus = async (repoId) => {
    setLoading(true);
    try {
      const res = await api.get(`/ci-status/${repoId}`);
      setCiStatus(res.data.status); // Expecting { "status": "success" } etc.
    } catch (err) {
      alert('Failed to fetch CI status');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRepo = (repo) => {
    setSelectedRepo(repo);
    fetchCIStatus(repo.id);
  };

  return (
    <>
      <h1 className="page-title text-3xl font-bold bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-color-light)] bg-clip-text text-transparent mb-8">
        CI/CD Pipelines
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Repository List */}
        <div className="bg-[var(--card-bg)] rounded-xl p-5 shadow-custom">
          <h2 className="text-xl font-semibold mb-4">Imported Repositories</h2>
          {importedRepos.length === 0 ? (
            <p className="text-[var(--text-secondary)]">No repositories imported yet.</p>
          ) : (
            <ul className="space-y-2">
              {importedRepos.map(repo => (
                <li key={repo.id}>
                  <button
                    onClick={() => handleSelectRepo(repo)}
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

        {/* CI Status Display */}
        <div className="md:col-span-2 bg-[var(--card-bg)] rounded-xl p-5 shadow-custom">
          {selectedRepo ? (
            <>
              <h2 className="text-xl font-semibold mb-4">{selectedRepo.repoName} – CI Status</h2>
              {loading ? (
                <div className="text-center py-10">Loading...</div>
              ) : (
                <div>
                  <div
                    className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                      ciStatus === 'success' || ciStatus === 'success'
                        ? 'bg-[var(--success-color)] text-white'
                        : ciStatus === 'failure' || ciStatus === 'failed'
                        ? 'bg-[var(--error-color)] text-white'
                        : ciStatus === 'in_progress' || ciStatus === 'queued'
                        ? 'bg-[var(--warning-color)] text-white'
                        : 'bg-[var(--border-color)] text-[var(--text-secondary)]'
                    }`}
                  >
                    {ciStatus || 'No runs yet'}
                  </div>
                  <p className="mt-4 text-[var(--text-secondary)]">
                    Last checked: just now
                  </p>
                </div>
              )}
            </>
          ) : (
            <p className="text-[var(--text-secondary)] text-center py-10">
              Select a repository to view its CI status
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Pipelines;