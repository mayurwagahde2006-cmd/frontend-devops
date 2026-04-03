import { FaRobot, FaMagic, FaTools, FaBug, FaShieldAlt, FaDollarSign } from "react-icons/fa";

const AIPanel = ({ isOpen, onToggle }) => {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      
      {/* Floating Button */}
      <button
        onClick={onToggle}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--accent-color)] to-[var(--info-color)] flex items-center justify-center shadow-lg hover:scale-110 transition-all animate-float"
      >
        <FaRobot className="text-white text-xl" />
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 bg-[var(--card-bg)] rounded-xl shadow-custom p-5 animate-slide-up">

          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <FaRobot className="text-2xl text-[var(--accent-color)]" />
            <h3 className="font-semibold text-lg">DevOps Assistant AI</h3>
          </div>

          {/* AI Message */}
          <div className="bg-[var(--secondary-bg)] p-3 rounded-lg border-l-4 border-[var(--accent-color)] text-sm mb-4">
            I've detected an issue with your Docker configuration in the 
            <span className="font-semibold"> "user-auth-service" </span> repository. 
            The base image can be optimized to reduce size by 40%.
          </div>

          {/* Action Button */}
          <button className="w-full bg-[var(--accent-color)] text-white py-2 rounded-lg hover:bg-[var(--accent-color-dark)] transition-colors mb-4 flex items-center justify-center gap-2">
            <FaMagic />
            Apply Fix Automatically
          </button>

          {/* Suggestions */}
          <div className="flex flex-wrap gap-2">

            <span className="flex items-center gap-1 px-3 py-1 bg-[var(--secondary-bg)] rounded-full text-xs cursor-pointer hover:bg-[var(--accent-color)] hover:text-white transition-colors">
              <FaTools /> Optimize Dockerfile
            </span>

            <span className="flex items-center gap-1 px-3 py-1 bg-[var(--secondary-bg)] rounded-full text-xs cursor-pointer hover:bg-[var(--accent-color)] hover:text-white transition-colors">
              <FaBug /> Fix failing tests
            </span>

            <span className="flex items-center gap-1 px-3 py-1 bg-[var(--secondary-bg)] rounded-full text-xs cursor-pointer hover:bg-[var(--accent-color)] hover:text-white transition-colors">
              <FaShieldAlt /> Security scan
            </span>

            <span className="flex items-center gap-1 px-3 py-1 bg-[var(--secondary-bg)] rounded-full text-xs cursor-pointer hover:bg-[var(--accent-color)] hover:text-white transition-colors">
              <FaDollarSign /> Cost optimization
            </span>

          </div>
        </div>
      )}
    </div>
  );
};

export default AIPanel;