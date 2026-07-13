/**
 * Dashboard.tsx – Main dashboard page
 * Assembles DashboardCards, MapPlaceholder, and VehicleList.
 * Week 1 – All static dummy data.
 *
 * Future integration points (Weeks 2–4):
 *  - Connect FleetSocketContext to receive live telemetry
 *  - Pass live stats → DashboardCards
 *  - Pass live vehicles → VehicleList
 *  - Canvas renderer will mount inside MapPlaceholder's #fleet-map-canvas
 */

import React from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import DashboardCards from '../components/DashboardCards';
import MapPlaceholder from '../components/MapPlaceholder';
import VehicleList from '../components/VehicleList';

// ── Component ──────────────────────────────────────────────────────────────────

const Dashboard: React.FC = () => {
  /*
   * TODO Week 3: Replace with useFleetSocket() hook to receive live:
   *   const { stats, vehicles, isConnected } = useFleetSocket();
   * For Week 1 we pass no props → components fall back to dummy data.
   */

  return (
    <DashboardLayout
      pageTitle="Fleet Dashboard"
      pageSubtitle="Real-time fleet monitoring & analytics"
    >
      {/* ── Stat Cards ──────────────────────────────────────────── */}
      {/*
       * Pass `stats` prop in Week 3:
       *   <DashboardCards stats={stats} />
       */}
      <DashboardCards />

      {/* ── Live Map ────────────────────────────────────────────── */}
      <MapPlaceholder height={400} />

      {/* ── Vehicle Table ────────────────────────────────────────── */}
      {/*
       * Pass `vehicles` prop in Week 3:
       *   <VehicleList vehicles={vehicles} />
       */}
      <VehicleList />
    </DashboardLayout>
  );
};

export default Dashboard;
