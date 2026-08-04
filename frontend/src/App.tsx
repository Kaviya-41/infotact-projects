/**
 * App.tsx – Application Root & Routing Configuration for FleetDash
 *
 * Routes:
 *  - /login (Public Login Page)
 *  - /signup (Public Sign Up Page)
 *  - /dashboard (Protected Dashboard)
 *  - /live-map (Protected Dedicated Map)
 *  - /vehicles (Protected Vehicles List)
 *  - /alerts (Protected Alerts Stream)
 *  - /analytics (Protected Fleet Analytics)
 *  - /settings (Protected System Settings)
 *  - "/" redirects to "/login"
 */

import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layout/DashboardLayout';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import LiveMapPage from './pages/LiveMapPage';
import VehiclesPage from './pages/VehiclesPage';
import AlertsPage from './pages/AlertsPage';

// Lazy-load secondary pages
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

const PageFallback: React.FC = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60vh',
    color: '#64748B',
    fontSize: '14px',
    gap: '10px'
  }}>
    <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⚙</span>
    Loading FleetDash Operations...
  </div>
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Root Default Redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Protected Routes Wrapped in DashboardLayout */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/live-map"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <LiveMapPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Support /map alias as requested */}
            <Route
              path="/map"
              element={<Navigate to="/live-map" replace />}
            />

            <Route
              path="/vehicles"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <VehiclesPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/alerts"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <AlertsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ReportsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Support /reports alias as requested */}
            <Route
              path="/reports"
              element={<Navigate to="/analytics" replace />}
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <SettingsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Catch-all redirect to /login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
