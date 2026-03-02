import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Indicators from './pages/Indicators';
import ActionPlan from './pages/ActionPlan';
import DataEntry from './pages/DataEntry';
import Config from './pages/Config';
import Info from './pages/Info';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import Home from './pages/Home';

// Auth & Data Loading Wrapper
const AuthGuard = ({ children }: { children: React.ReactElement }) => {
  const navigate = useNavigate();
  const { importData, settings } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      try {
        const response = await fetch('/api/data', { credentials: 'include' });
        
        if (response.status === 401) {
          setIsAuthenticated(false);
          // Only navigate if we're not already on a public page
          const publicPages = ['/', '/login', '/register', '/verify-email'];
          if (!publicPages.includes(window.location.pathname)) {
            navigate('/login');
          }
          return;
        }

        if (response.ok) {
          setIsAuthenticated(true);
          const data = await response.json();
          if (data) {
            importData(data);
          }
        }
      } catch (error) {
        console.error('Auth check failed', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndLoadData();
  }, [navigate, importData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated but not configured, go to onboarding
  if (!settings.isConfigured && window.location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        
        {/* Protected Routes */}
        <Route
          path="/onboarding"
          element={
            <AuthGuard>
              <Onboarding />
            </AuthGuard>
          }
        />
        
        <Route
          path="/"
          element={
            <AuthGuard>
              <AppLayout />
            </AuthGuard>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="indicators" element={<Indicators />} />
          <Route path="action-plan" element={<ActionPlan />} />
          <Route path="data-entry" element={<DataEntry />} />
          <Route path="config" element={<Config />} />
          <Route path="info" element={<Info />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
