import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Repositories from './pages/Repositories';
import Pipelines from './pages/Pipelines';
import Deployments from './pages/Deployments';
import Monitoring from './pages/Monitoring';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
            duration: 3000,
            style: {
             background: "#1e293b",
             color: "#fff",
            },
            }}
          />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="/planning" element={<Planning />} />
              <Route path="repositories" element={<Repositories />} />
              <Route path="pipelines" element={<Pipelines />} />
              <Route path="deployments" element={<Deployments />} />
              <Route path="monitoring" element={<Monitoring />} />
              <Route path="feedback" element={<Feedback />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;