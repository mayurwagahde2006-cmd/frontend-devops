import { useState, useEffect } from 'react';
import api from '../api';
import { deleteRepo, deleteAllRepos } from "../services/dashboardService";
import RepoCard from '../components/RepoCard.jsx'; 
import toast from "react-hot-toast";

const Repositories = () => {
  const [activeTab, setActiveTab] = useState('imported');
  const [importedRepos, setImportedRepos] = useState([]);
  const [availableRepos, setAvailableRepos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'imported') {
      api.get('/repos/imported')
        .then(res => setImportedRepos(res.data || []))
        .catch(err => {
          console.error("Imported fetch error:", err);
        });
    } else {
      setLoading(true);
      api.get('/github/userRepos')
        .then(res => {
          console.log("Available repos:", res.data);
          setAvailableRepos(res.data || []); 
        })
        .catch(err => {
          console.error("GitHub repos error:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [activeTab]);

  const handleImport = async (repo) => {
    console.log("CLICKED IMPORT:", repo);

    if (!repo || !repo.id) {
      toast.error("Invalid repo data");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      await api.post('/repos/import', {
        id: String(repo.id),
        name: repo.name || "",
        description: repo.description || "",

        html_url: repo.html_url,                   
        clone_url: repo.clone_url,                  
        stargazers_count: String(repo.stargazers_count || 0), 

        language: repo.language || "Unknown"    
      });

      console.log("IMPORT SUCCESS");
      toast.success("Import Successfully")

      const [imported, available] = await Promise.all([
        api.get('/repos/imported'),
        api.get('/github/userRepos')
      ]);

      setImportedRepos(imported.data || []);

      setAvailableRepos(
        (available.data || []).filter(r => r.id !== repo.id)
      );

    } catch (err) {
      console.error("IMPORT ERROR:", err.response || err.message);
      toast.error(err.response?.data?.message || 'Failed to import repository');
    } finally {
      setLoading(false);
    }
  };

  //  DELETE SINGLE
  const handleDelete = async (repoId) => {
   const confirmDelete = window.confirm("Are you sure you want to delete this repository?");
   if (!confirmDelete) return;

   try {
     await deleteRepo(repoId);

     setImportedRepos(prev => prev.filter(r => r.id !== repoId));

     toast.success("Repository deleted");

    } catch (err) {
     console.error("Delete failed:", err);
     toast.error("Delete failed");
    }
  };

  //  DELETE ALL
  const handleDeleteAll = async () => {
   const confirmDelete = window.confirm("Are you sure you want to delete ALL repositories?");
   if (!confirmDelete) return;

   try {
     await deleteAllRepos();

     setImportedRepos([]);

     toast.success("All repositories deleted");

    } catch (err) {
     console.error("Delete all failed:", err);
     toast.error("Delete all failed");
    }
  };

  return (
    <>
      <div className="page-header flex justify-between items-center mb-8">
        <h1 className="page-title text-3xl font-bold bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-color-light)] bg-clip-text text-transparent">
          Repository Management
        </h1>

        {/*  DELETE ALL BUTTON */}
        {activeTab === 'imported' && (
          <button
            onClick={handleDeleteAll}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Delete All
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-[var(--border-color)] mb-6">
        <button
          className={`pb-2 px-1 font-medium transition-colors ${
            activeTab === 'imported'
              ? 'text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]'
              : 'text-[var(--text-secondary)]'
          }`}
          onClick={() => setActiveTab('imported')}
        >
          Imported
        </button>

        <button
          className={`pb-2 px-1 font-medium transition-colors ${
            activeTab === 'available'
              ? 'text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]'
              : 'text-[var(--text-secondary)]'
          }`}
          onClick={() => setActiveTab('available')}
        >
          Available on GitHub
        </button>
      </div>

      {loading && (
        <div className="text-center py-10">Loading...</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {activeTab === 'imported' &&
          Array.isArray(importedRepos) &&
          importedRepos.map(repo => (
            <RepoCard
              key={repo.id}
              repo={repo}
              isImported
              onDelete={handleDelete}   //  PASS DELETE
            />
          ))}

        {activeTab === 'available' &&
          Array.isArray(availableRepos) &&
          availableRepos.map(repo => (
            <RepoCard
              key={repo.id}
              repo={repo}
              onImport={handleImport}
            />
          ))}
      </div>
    </>
  );
};

export default Repositories;