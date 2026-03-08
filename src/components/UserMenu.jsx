import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const UserMenu = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('light');
  };

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      {/* Username Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 font-semibold hover:text-[var(--accent-color)] transition"
      >
        <i className="fab fa-github text-lg"></i>
        <span>{user.name}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-48 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg shadow-lg z-50">
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-full text-left px-4 py-2 hover:bg-[var(--secondary-bg)] transition"
          >
            Toggle Theme
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            className="w-full text-left px-4 py-2 text-red-500 hover:bg-[var(--secondary-bg)] transition"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;