/**
 * App.tsx – Application root
 *
 * Week 1: Single-page render of the Dashboard.
 * Week 2: Add React Router with routes for /map, /vehicles, /alerts, /settings.
 * Week 3: Wrap with FleetSocketProvider for global telemetry context.
 */

import React from 'react';
import Dashboard from './pages/Dashboard';
import './styles/dashboard.css';

// Remove Vite default styles – dashboard.css owns all styling
// (App.css and index.css are left empty / default but not imported here)

const App: React.FC = () => {
  return (
    /*
     * TODO Week 2: Replace with <BrowserRouter><Routes>...</Routes></BrowserRouter>
     * TODO Week 3: Wrap with <FleetSocketProvider url={import.meta.env.VITE_SOCKET_URL}>
     */
    <Dashboard />
  );
};

export default App;
