/**
 * LiveMapPage.tsx – Dedicated Live Fleet Map Page
 * Displays the hero fleet map with floating route card and live geofence/speed alert banners.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MapPlaceholder from '../components/MapPlaceholder';
import VehicleDrawer from '../components/dashboard/VehicleDrawer';
import ActiveRouteCard from '../components/widgets/ActiveRouteCard';
import VehicleAlertBanner from '../components/widgets/VehicleAlertBanner';
import '../styles/dashboard.css';

const LiveMapPage: React.FC = () => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

  return (
    <div className="dashboard">
      {/* Page Header */}
      <div>
        <h2 className="dashboard__hero-title">Live Fleet Map</h2>
        <p className="dashboard__hero-subtitle">
          Track vehicle locations, routes and operational status in real time.
        </p>
      </div>

      {/* Main Map Container */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <MapPlaceholder
          height={640}
          selectedVehicleId={selectedVehicleId}
          onSelectVehicle={(id) => setSelectedVehicleId(id)}
        />
      </div>

      {/* Route Info & Live Alert Banners Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Active Dispatch Route Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ActiveRouteCard className="w-full" />
        </motion.div>

        {/* Live Alerts Stream Card */}
        <motion.div
          className="fd-card fd-card--no-hover"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="fd-card__header">
            <h3 className="fd-card__title">Live Map Alerts</h3>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#EF4444' }}>Real-time</span>
          </div>
          <VehicleAlertBanner className="w-full" />
        </motion.div>
      </div>

      {/* Slide-in Vehicle Drawer */}
      <VehicleDrawer
        vehicleId={selectedVehicleId}
        onClose={() => setSelectedVehicleId(null)}
      />
    </div>
  );
};

export default LiveMapPage;
