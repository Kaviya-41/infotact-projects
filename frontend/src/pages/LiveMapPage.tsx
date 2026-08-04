/**
 * LiveMapPage.tsx – Dedicated Live Fleet Map Page
 */

import React from 'react';
import SidebarNav from '../components/layout/SidebarNav';
import FleetMapCanvas from '../components/canvas/FleetMapCanvas';
import VehicleGauge from '../components/canvas/VehicleGauge';
import '../styles/dashboard.css';

const LiveMapPage: React.FC = () => {
  return (
    <div className="telemetry-dashboard-grid">
      <SidebarNav />
      <FleetMapCanvas />
      <div className="right-telemetry-stack">
        <VehicleGauge />
      </div>
    </div>
  );
};

export default LiveMapPage;
