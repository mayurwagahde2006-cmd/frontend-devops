import { useNavigate } from 'react-router-dom';

const RepoCard = ({ repo, isImported, onImport, onDelete }) => {
  const navigate = useNavigate();

  const statusClass = repo.status === 'success' ? 'status-success' : repo.status === 'failed' ? 'status-failed' : 'status-pending';
  const statusText = repo.status === 'success' ? 'Deployed' : repo.status === 'failed' ? 'Failed' : 'Pending';

  return (
    <div className="bg-[var(--card-bg)] rounded-xl p-5 border border-[var(--border-color)] hover:-translate-y-1 transition-all shadow-custom">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg">{repo.name || repo.repoName}</h3>
          <div className="text-xs text-[var(--text-secondary)]">{repo.type || repo.language || 'Unknown'}</div>
        </div>
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs ${statusClass}`}>
          <span className={`w-2 h-2 rounded-full bg-current`}></span>
          <span>{statusText}</span>
        </div>
      </div>
      <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2">
        {repo.description || 'No description'}
      </p>
      <div className="flex justify-between items-center">
        <span className="text-xs text-[var(--text-secondary)]">
          <i className="far fa-clock mr-1"></i> Last deploy: {repo.lastDeploy || 'N/A'}
        </span>
        {isImported ? (
         <button
           onClick={() => onDelete(repo.id)}
           className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
          >
          <i className="fas fa-trash mr-1"></i> Delete
          </button>
        ) : (
          <button
            onClick={() => onImport(repo)}
            className="bg-[var(--accent-color)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--accent-color-dark)] transition-colors"
          >
            <i className="fas fa-download mr-1"></i> Import
          </button>
        )}
      </div>
    </div>
  );
};

export default RepoCard;