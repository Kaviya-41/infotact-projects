/**
 * Dashboard.tsx – Automotive Telemetry Infotainment Dashboard Page for FleetDash
 * 12-Column Grid Layout: Vertical Dock Sidebar | Center Stage Canvas Map | Right Telemetry Panel
 */

import React from 'react';
import { SidebarNav } from '../components/layout/SidebarNav';
import { FleetMapCanvas } from '../components/canvas/FleetMapCanvas';
import { FleetTelemetryPanel } from '../components/widgets/FleetTelemetryPanel';
import '../styles/dashboard.css';

export const FleetDashPage: React.FC = () => {
  return (
    <div className="h-screen w-screen bg-[#0B0D12] text-white overflow-hidden p-6 gap-6 grid grid-cols-12" id="automotive-telemetry-dashboard">
      {/* Col 1: Left Vertical Dock */}
      <div className="col-span-1 flex justify-center h-full">
        <SidebarNav />
      </div>

      {/* Col 2–8: Main Visual Focal Point (Interactive Canvas Map Stage & Overlays) */}
      <div className="col-span-7 h-full">
        <FleetMapCanvas />
      </div>

      {/* Col 9–12: Right Telemetry Column Stack */}
      <div className="col-span-4 h-full">
        <FleetTelemetryPanel />
      </div>
    </div>
  );
};

export default FleetDashPage;

