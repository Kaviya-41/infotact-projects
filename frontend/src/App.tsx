/**
 * App.tsx – Application root for DisasterIQ
 *
 * AuthProvider wraps everything. Login page is public.
 * All dashboard routes are protected behind ProtectedRoute.
 */

import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layout/DashboardLayout';
import LoginPage from './pages/LoginPage';
import './styles/dashboard.css';

// ── Page imports ───────────────────────────────────────────────────────────────

import Dashboard from './pages/Dashboard';
import IncidentMapPage from './pages/LiveMapPage';
import InfrastructurePage from './pages/VehiclesPage';
import AlertsPage from './pages/AlertsPage';

// Lazy-load lighter pages
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

// ── Fallback spinner ───────────────────────────────────────────────────────────

const PageFallback: React.FC = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60vh',
    color: '#9CA3AF',
    fontSize: '14px',
    gap: '10px',
  }}>
    <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⚙</span>
    Loading…
  </div>
);

// ── App ────────────────────────────────────────────────────────────────────────

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            {/* Public: Login */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected: Dashboard routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/incident-map" element={<IncidentMapPage />} />
                      <Route path="/infrastructure" element={<InfrastructurePage />} />
                      <Route path="/alerts" element={<AlertsPage />} />
                      <Route path="/reports" element={<ReportsPage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
