import { useState, useEffect } from 'react';
import api from '../api';
import RepoCard from '../components/RepoCard';

const Repositories = () => {
  const [activeTab, setActiveTab] = useState('imported');
  const [importedRepos, setImportedRepos] = useState([]);
  const [availableRepos, setAvailableRepos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'imported') {
      api.get('/repos/imported')
        .then(res => setImportedRepos(res.data))
        .catch(console.error);
    } else {
      setLoading(true);
      api.get('/github/userRepos')
        .then(res => setAvailableRepos(res.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [activeTab]);

  const handleImport = async (repo) => {
    try {
      await api.post('/repos/import', repo);
      const [imported, available] = await Promise.all([
        api.get('/repos/imported'),
        api.get('/github/userRepos')
      ]);
      setImportedRepos(imported.data);
      setAvailableRepos(available.data);
    } catch (err) {
      alert('Failed to import repository');
    }
  };

  return (
    <>
      <div className="page-header flex justify-between items-center mb-8">
        <h1 className="page-title text-3xl font-bold bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-color-light)] bg-clip-text text-transparent">
          Repository Management
        </h1>
        <button className="bg-[var(--accent-color)] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[var(--accent-color-dark)] transition-colors flex items-center gap-2">
          <i className="fab fa-github"></i> Connect New Repo
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-[var(--border-color)] mb-6">
        <button
          className={`pb-2 px-1 font-medium transition-colors ${activeTab === 'imported' ? 'text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]' : 'text-[var(--text-secondary)]'}`}
          onClick={() => setActiveTab('imported')}
        >
          Imported
        </button>
        <button
          className={`pb-2 px-1 font-medium transition-colors ${activeTab === 'available' ? 'text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]' : 'text-[var(--text-secondary)]'}`}
          onClick={() => setActiveTab('available')}
        >
          Available on GitHub
        </button>
      </div>

      {loading && <div className="text-center py-10">Loading...</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {activeTab === 'imported' && importedRepos.map(repo => (
          <RepoCard key={repo.id} repo={repo} isImported />
        ))}
        {activeTab === 'available' && availableRepos.map(repo => (
          <RepoCard key={repo.id} repo={repo} onImport={handleImport} />
        ))}
      </div>
    </>
  );
};

export default Repositories;