import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api';
import { FaGithub } from "react-icons/fa";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  api.get('/user/Info', {
    validateStatus: (status) => status < 400
    .then((res) => {
      if (res.status === 200 && res.data?.username) {
        setUser({
          name: res.data.username,
        });

        toast.success(`Welcome ${res.data.username}`);
      } else {
        setUser(null);
      }
    })
    .catch(() => {
      setUser(null);

    })
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