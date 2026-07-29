/**
 * VehiclesPage.tsx – Full vehicle fleet management view.
 * Reuses VehicleList component.
 */

import React from 'react';
import { motion } from 'framer-motion';
import VehicleList from '../components/VehicleList';
import { useVehicles } from '../hooks/useVehicles';

const VehiclesPage: React.FC = () => {
  const { vehicles, loading, error } = useVehicles();

  return (
    <motion.div
      className="dashboard-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="dashboard-section-label">
        <span className="section-label-icon" aria-hidden="true">🚚</span>
        <div>
          <h2 className="section-label-title">Vehicle Fleet</h2>
          <p className="section-label-subtitle">Manage and monitor all vehicles in your fleet</p>
        </div>
      </div>
      <VehicleList
        vehicles={vehicles.length > 0 ? vehicles : undefined}
        isLoading={loading}
        isError={!!error}
        errorMessage={error ?? undefined}
      />
    </motion.div>
  );
};

export default VehiclesPage;

