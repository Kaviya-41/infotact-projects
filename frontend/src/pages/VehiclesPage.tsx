/**
 * VehiclesPage.tsx – Dedicated Fleet Vehicles Page
 * Provides full vehicle inventory management, telemetry status, filters, and search.
 */

import React, { useState } from 'react';
import VehicleList from '../components/VehicleList';
import VehicleDrawer from '../components/dashboard/VehicleDrawer';
import type { Vehicle } from '../types/fleet';
import '../styles/dashboard.css';

const VehiclesPage: React.FC = () => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicleId(vehicle.id);
  };

  return (
    <div className="dashboard">
      {/* Page Header */}
      <div>
        <h2 className="dashboard__hero-title">Vehicles</h2>
        <p className="dashboard__hero-subtitle">
          Monitor and manage all registered fleet vehicles.
        </p>
      </div>

      {/* Vehicle Telemetry Table Card */}
      <VehicleList
        onSelectVehicle={handleSelectVehicle}
        selectedVehicleId={selectedVehicleId || undefined}
      />

      {/* Slide-in Telemetry Drawer */}
      <VehicleDrawer
        vehicleId={selectedVehicleId}
        onClose={() => setSelectedVehicleId(null)}
      />
    </div>
  );
};

export default VehiclesPage;
