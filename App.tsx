import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Links from './pages/Links';
import TopProducts from './pages/TopProducts';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Layout from './components/Layout';
import RedirectHandler from './pages/RedirectHandler';

const App: React.FC = () => {
  // Helper to calculate basename for preview environments (e.g. Project IDX, WebContainer)
  // These environments often serve the app under a UUID subpath.
  const getBasename = () => {
    const path = window.location.pathname;
    // Check if the path starts with a UUID-like segment (8-4-4-4-12 hex characters)
    const uuidPattern = /^\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/;
    const match = path.match(uuidPattern);
    return match ? `/${match[1]}` : '/';
  };

  return (
    <AuthProvider>
      <BrowserRouter basename={getBasename()}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes (Wrapped in Layout) */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/links" element={<Links />} />
            <Route path="/top-products" element={<TopProducts />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Redirect Route - Handles dynamic short codes */}
          {/* NOTE: Placed at the root level. React Router v6 will try to match specific paths above first. */}
          <Route path="/:shortCode" element={<RedirectHandler />} />

          {/* Catch-all redirect to home if no short code matches and no other route matches */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;