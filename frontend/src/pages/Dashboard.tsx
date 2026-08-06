/**
 * Dashboard.tsx – FleetDash Enterprise Fleet Operations Center Page
 * Complete hierarchy:
 * 1. Top Header & Action Controls
 * 2. 4 KPI Overview Cards (with Sparklines)
 * 3. Live Fleet Map (Hero) + Live Operations Card
 * 4. Active Trips + Live Alerts
 * 5. Fleet Performance (Analytics) + Vehicle Health
 * 6. Recent Activity Stream
 * 7. Selected Vehicle Slide-in Drawer (Framer Motion)
 */

import React, { useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../layout/DashboardLayout';
import DashboardCards from '../components/DashboardCards';
import MapPlaceholder from '../components/MapPlaceholder';
import LiveOperationsCard from '../components/dashboard/LiveOperationsCard';
import ActiveTripsCard from '../components/dashboard/ActiveTripsCard';
import RecentAlerts from '../components/RecentAlerts';
import FleetAnalytics from '../components/FleetAnalytics';
import VehicleHealthProgressCard from '../components/dashboard/VehicleHealthProgressCard';
import RecentActivityCard from '../components/dashboard/RecentActivityCard';
import VehicleDrawer from '../components/dashboard/VehicleDrawer';
import '../styles/dashboard.css';

const fadeIn = {
  hidden: { opacity: 0, y: 15 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

const Dashboard: React.FC = () => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

  const handleSelectVehicle = useCallback((id: string) => {
    setSelectedVehicleId(id);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setSelectedVehicleId(null);
  }, []);

  return (
    <DashboardLayout>
      <div className="dashboard">
        {/* KPI Overview (4 Cards with Sparklines) */}
        <DashboardCards />

        {/* Live Fleet Map (Hero Element) + Live Operations Card */}
        <motion.div
          className="command-center"
          initial="hidden"
          animate="visible"
          custom={0.1}
          variants={fadeIn}
        >
          {/* Main Map Visualizer */}
          <MapPlaceholder
            selectedVehicleId={selectedVehicleId}
            onSelectVehicle={handleSelectVehicle}
          />

          {/* Live Operations Panel */}
          <div className="command-center__right">
            <LiveOperationsCard />
          </div>
        </motion.div>

        {/* Row 2: Active Trips + Live Alerts */}
        <motion.div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}
          initial="hidden"
          animate="visible"
          custom={0.15}
          variants={fadeIn}
        >
          <ActiveTripsCard />
          <RecentAlerts onSelectVehicle={handleSelectVehicle} />
        </motion.div>

        {/* Row 3: Fleet Performance Analytics + Vehicle Health Breakdown */}
        <motion.div
          style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}
          initial="hidden"
          animate="visible"
          custom={0.2}
          variants={fadeIn}
        >
          <FleetAnalytics />
          <VehicleHealthProgressCard />
        </motion.div>

        {/* Row 4: Recent Activity Stream */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={0.25}
          variants={fadeIn}
        >
          <RecentActivityCard />
        </motion.div>

        {/* Selected Vehicle Slide-in Drawer */}
        <VehicleDrawer
          vehicleId={selectedVehicleId}
          onClose={handleCloseDrawer}
        />
      </div>
    </DashboardLayout>
  );
};

export { Dashboard as FleetDashPage };
export default memo(Dashboard);
