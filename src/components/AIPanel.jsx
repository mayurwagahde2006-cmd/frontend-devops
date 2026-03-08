const AIPanel = ({ isOpen, onToggle }) => {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button
        onClick={onToggle}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--accent-color)] to-[var(--info-color)] flex items-center justify-center text-2xl shadow-lg hover:scale-110 transition-all animate-float"
      >
        <i className="fas fa-robot text-white"></i>
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 bg-[var(--card-bg)] rounded-xl shadow-custom p-5 animate-slide-up">
          <div className="flex items-center gap-3 mb-4">
            <i className="fas fa-robot text-2xl text-[var(--accent-color)]"></i>
            <h3 className="font-semibold text-lg">DevOps Assistant AI</h3>
          </div>
          <div className="bg-[var(--secondary-bg)] p-3 rounded-lg border-l-4 border-[var(--accent-color)] text-sm mb-4">
            I've detected an issue with your Docker configuration in the "user-auth-service" repository. The base image can be optimized to reduce size by 40%.
          </div>
          <button className="w-full bg-[var(--accent-color)] text-white py-2 rounded-lg hover:bg-[var(--accent-color-dark)] transition-colors mb-4">
            <i className="fas fa-magic mr-2"></i>Apply Fix Automatically
          </button>
          <div className="flex flex-wrap gap-2">
            {['Optimize Dockerfile', 'Fix failing tests', 'Security scan', 'Cost optimization'].map(s => (
              <span key={s} className="px-3 py-1 bg-[var(--secondary-bg)] rounded-full text-xs cursor-pointer hover:bg-[var(--accent-color)] hover:text-white transition-colors">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIPanel;