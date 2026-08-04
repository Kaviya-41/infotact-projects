/**
 * App.tsx – Application Root & Routing Configuration for FleetDash
 */

import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

// Lazy-load secondary views
const LiveMapPage = lazy(() => import('./pages/LiveMapPage'));
const VehiclesPage = lazy(() => import('./pages/VehiclesPage'));
const AlertsPage = lazy(() => import('./pages/AlertsPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

const PageFallback: React.FC = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#F6F8FB',
    color: '#64748B',
    fontSize: '14px',
    fontWeight: 600,
    gap: '10px'
  }}>
    Initializing Telemetry Cockpit...
  </div>
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Root Default Redirect to /login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Protected Telemetry Dashboard Route */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Secondary Protected Sub-routes */}
            <Route path="/live-map" element={<ProtectedRoute><LiveMapPage /></ProtectedRoute>} />
            <Route path="/map" element={<Navigate to="/live-map" replace />} />
            <Route path="/vehicles" element={<ProtectedRoute><VehiclesPage /></ProtectedRoute>} />
            <Route path="/alerts" element={<ProtectedRoute><AlertsPage /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
            <Route path="/reports" element={<Navigate to="/analytics" replace />} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

            {/* Catch-all redirect to /login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
