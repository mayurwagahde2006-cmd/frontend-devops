import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const isLoggedIn = document.cookie.includes("JWT_TOKEN");

  if (!isLoggedIn) {
    setLoading(false);
    return;
  }

  api.get('/user/Info', {
    withCredentials: true
  })
    .then((res) => {
      setUser({ name: res.data.username });
    })
    .catch(() => setUser(null))
    .finally(() => setLoading(false));

}, []);

  const logout = () => {
    document.cookie =
      'JWT_TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
