import { Outlet, NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useState, useRef, useEffect } from 'react';
import AIPanel from './AIPanel';
import toast from "react-hot-toast";

import { 
  FaTachometerAlt, 
  FaTasks, 
  FaGithub, 
  FaStream, 
  FaCloudUploadAlt, 
  FaChartBar,
  FaRobot,
  FaDocker,
  FaCloud,
  FaServer,
  FaPhone
} from "react-icons/fa";

const Layout = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [aiOpen, setAiOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { to: '/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
    { to: '/planning', icon: <FaTasks />, label: 'Planning' },
    { to: '/repositories', icon: <FaGithub />, label: 'Repositories' },
    { to: '/pipelines', icon: <FaStream />, label: 'CI/CD Pipelines' },
    { to: '/deployments', icon: <FaCloudUploadAlt />, label: 'Deployments' },
    { to: '/monitoring', icon: <FaChartBar />, label: 'Monitoring' },
    { to: '/feedback', icon:<FaPhone/>, label: 'Feedback' },  ];

  return (
    <div className="min-h-screen flex flex-col">
      
      {/* Header */}
      <header className="bg-[var(--secondary-bg)] sticky top-0 z-50 border-b border-[var(--border-color)] shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[var(--accent-color)] to-[var(--accent-color-light)] rounded-lg flex items-center justify-center">
              <FaRobot className="text-white text-lg" />
            </div>
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-color-light)] bg-clip-text text-transparent">
                OPERA
              </div>
              <div className="text-xs text-[var(--text-secondary)] -mt-1">
                DevOps-Assistant
              </div>
            </div>
          </div>

          {/* Profile */}
          <div className="relative" ref={menuRef}>
            <div
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-3 bg-[var(--card-bg)] rounded-full px-4 py-2 cursor-pointer hover:shadow-custom transition-all"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--accent-color)] to-[var(--info-color)] flex items-center justify-center font-semibold text-white">
                {user?.name?.split(' ').map(n => n[0]).join('') || 'JD'}
              </div>
              <div className="text-left">
                <div className="font-medium text-sm">
                  {user?.name || 'John Developer'}
                </div>
              </div>
            </div>

            {menuOpen && (
              <div className="absolute right-0 mt-3 w-52 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl shadow-lg z-50 overflow-hidden">
                
                <button
                  onClick={toggleTheme}
                  className="w-full text-left px-4 py-3 hover:bg-[var(--secondary-bg)] transition flex justify-between items-center"
                >
                  <span>Toggle Theme</span>
                  <span className="text-xs text-[var(--text-secondary)]">
                    {theme === 'light' ? 'Light' : 'Dark'}
                  </span>
                </button>

                <div className="border-t border-[var(--border-color)]"></div>

                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-3 text-red-500 hover:bg-[var(--secondary-bg)] transition"
                 
                >
                  Logout
                </button>

              </div>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 flex-1 flex flex-col md:flex-row gap-5 mt-8">
        
        {/* Sidebar */}
        <aside className="md:w-64 bg-[var(--secondary-bg)] rounded-xl p-5 h-fit sticky top-24 shadow-custom">
          <nav>
            <ul className="space-y-2">
              {navItems.map(item => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        isActive
                          ? 'bg-[var(--card-bg)] text-[var(--accent-color)] translate-x-1'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--card-bg)] hover:text-[var(--accent-color)] hover:translate-x-1'
                      }`
                    }
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

         
        </aside>

        {/* Main */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>

      {/* AI Panel */}
      <AIPanel isOpen={aiOpen} onToggle={() => setAiOpen(!aiOpen)} />

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-[var(--border-color)] text-center text-[var(--text-secondary)] text-sm">
        <div className="container mx-auto px-4">
          OPERA &copy; 2026 - Intelligent CI/CD Platform for Developers
        </div>
      </footer>
    </div>
  );
};

export default Layout;