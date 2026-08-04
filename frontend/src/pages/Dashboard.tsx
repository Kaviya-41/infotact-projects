/**
 * Dashboard.tsx – Automotive Telemetry Infotainment Dashboard Page
 * 12-Column Grid Layout: Vertical Dock Sidebar | Center Stage Map | Right Telemetry Stack
 */

import React from 'react';
import SidebarNav from '../components/layout/SidebarNav';
import FleetMapCanvas from '../components/canvas/FleetMapCanvas';
import VehicleGauge from '../components/canvas/VehicleGauge';
import VehicleHealthCard from '../components/widgets/VehicleHealthCard';
import FuelEfficiencyCard from '../components/widgets/FuelEfficiencyCard';
import '../styles/dashboard.css';

const Dashboard: React.FC = () => {
  return (
    <div className="telemetry-dashboard-grid" id="automotive-telemetry-dashboard">
      {/* Col 1: Vertical Dock Sidebar */}
      <SidebarNav />

      {/* Col 2-8: Central Visual Focal Point (Interactive Fleet Map Stage + Floating Overlays) */}
      <FleetMapCanvas />

      {/* Col 9-12: Right Telemetry Stack */}
      <div className="right-telemetry-stack">
        {/* Speed / Performance Gauge */}
        <VehicleGauge />

        {/* Vehicle Health Card */}
        <VehicleHealthCard vehicleId="FLT-024" />

        {/* Fuel & Energy Utilization Card */}
        <FuelEfficiencyCard />
      </div>
    </div>
  );
};

export default Dashboard;
