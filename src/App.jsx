import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import Planning from './pages/Planning';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
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
            </Route>
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;