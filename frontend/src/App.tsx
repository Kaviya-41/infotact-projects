/**
 * App.tsx – Application root
 *
 * React Router wired up with routes for all nav items.
 * Each route renders inside DashboardLayout (sidebar + header).
 */

import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layout/DashboardLayout';
import './styles/dashboard.css';

// ── Page imports ───────────────────────────────────────────────────────────────

import Dashboard from './pages/Dashboard';
import LiveMapPage from './pages/LiveMapPage';
import VehiclesPage from './pages/VehiclesPage';
import AlertsPage from './pages/AlertsPage';

// Lazy-load placeholder pages (lightweight, but keeps bundle lean)
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

// ── Fallback spinner ───────────────────────────────────────────────────────────

const PageFallback: React.FC = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60vh',
    color: '#8DA2C0',
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
      <DashboardLayout>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/live-map" element={<LiveMapPage />} />
            <Route path="/vehicles" element={<VehiclesPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            {/* Catch-all: redirect unknown routes to dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </DashboardLayout>
    </BrowserRouter>
  );
};

export default App;
