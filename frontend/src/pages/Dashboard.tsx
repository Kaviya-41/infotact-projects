/**
 * Dashboard.tsx – Main Fleet Operations Center Page
 * Assembles DashboardCards, MapPlaceholder, VehicleTelemetry,
 * FleetHealth, RecentAlerts, VehicleList, FleetAnalytics, and Footer.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardCards from '../components/DashboardCards';
import MapPlaceholder from '../components/MapPlaceholder';
import VehicleTelemetry from '../components/dashboard/VehicleTelemetry';
import FleetHealth from '../components/dashboard/FleetHealth';
import RecentAlerts from '../components/RecentAlerts';
import VehicleList from '../components/VehicleList';
import FleetAnalytics from '../components/FleetAnalytics';
import Footer from '../components/Footer';
import type { Vehicle } from '../types/fleet';
import '../styles/dashboard.css';

const Dashboard: React.FC = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | undefined>(undefined);

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  };

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* ── 1. Statistics / KPI Metrics Row ────────────────────── */}
      <DashboardCards />

      {/* ── 2. Live Fleet Map (Centerpiece) + Telemetry Panel ─── */}
      <div className="map-telemetry-row">
        <MapPlaceholder
          height={520}
          selectedVehicleId={selectedVehicle?.id || 'FLT-024'}
        />
        <VehicleTelemetry vehicle={selectedVehicle} />
      </div>

      {/* ── 3. Fleet Health + Recent Alerts Row ───────────────── */}
      <div className="dashboard-two-col">
        <FleetHealth />
        <RecentAlerts />
      </div>

      {/* ── 4. Fleet Telemetry Table ──────────────────────────── */}
      <VehicleList
        onSelectVehicle={handleSelectVehicle}
        selectedVehicleId={selectedVehicle?.id}
      />

      {/* ── 5. Fleet Performance & Efficiency Analytics ───────── */}
      <FleetAnalytics />

      {/* ── 6. Footer ─────────────────────────────────────────── */}
      <Footer />
    </motion.div>
  );
};

export default Dashboard;
