import { Outlet, NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useState, useRef, useEffect } from 'react';
import AIPanel from './AIPanel';

const Layout = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [aiOpen, setAiOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  // Close dropdown when clicking outside
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
    { to: '/dashboard', icon: 'tachometer-alt', label: 'Dashboard' },
    { to: '/repositories', icon: 'github', label: 'Repositories' },
    { to: '/pipelines', icon: 'stream', label: 'CI/CD Pipelines' },
    { to: '/deployments', icon: 'cloud-upload-alt', label: 'Deployments' },
    { to: '/monitoring', icon: 'chart-bar', label: 'Monitoring' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[var(--secondary-bg)] sticky top-0 z-50 border-b border-[var(--border-color)] shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[var(--accent-color)] to-[var(--accent-color-light)] rounded-lg flex items-center justify-center">
              <i className="fas fa-robot text-white"></i>
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

          {/* Right Section */}
          <div className="relative" ref={menuRef}>
            {/* Profile Button */}
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

            {/* Dropdown Menu */}
            {menuOpen && (
              <div className="absolute right-0 mt-3 w-52 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl shadow-lg z-50 overflow-hidden">
                
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="w-full text-left px-4 py-3 hover:bg-[var(--secondary-bg)] transition flex justify-between items-center"
                >
                  <span>Toggle Theme</span>
                  <span className="text-xs text-[var(--text-secondary)]">
                    {theme === 'light' ? 'Light' : 'Dark'}
                  </span>
                </button>

                {/* Divider */}
                <div className="border-t border-[var(--border-color)]"></div>

                {/* Logout */}
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

      {/* Content Section */}
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
                    <i className={`fas fa-${item.icon} w-6`}></i>
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Integrations */}
          <div className="mt-10">
            <h3 className="text-sm font-semibold mb-3">Integrations</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-[var(--card-bg)] rounded-md text-xs">
                <i className="fab fa-github mr-1"></i>GitHub
              </span>
              <span className="px-3 py-1 bg-[var(--card-bg)] rounded-md text-xs">
                <i className="fab fa-docker mr-1"></i>Docker
              </span>
              <span className="px-3 py-1 bg-[var(--card-bg)] rounded-md text-xs">
                <i className="fas fa-cloud mr-1"></i>Netlify
              </span>
              <span className="px-3 py-1 bg-[var(--card-bg)] rounded-md text-xs">
                <i className="fas fa-server mr-1"></i>Railway
              </span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>

      {/* AI Assistant */}
      <AIPanel isOpen={aiOpen} onToggle={() => setAiOpen(!aiOpen)} />

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-[var(--border-color)] text-center text-[var(--text-secondary)] text-sm">
        <div className="container mx-auto px-4">
          OPERA &copy; 2023 - Intelligent CI/CD Platform for Developers
        </div>
      </footer>
    </div>
  );
};

export default Layout;