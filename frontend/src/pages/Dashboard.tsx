/**
 * Dashboard.tsx – FleetDash Premium Light Fleet Operations Center
 * Automotive-inspired composition: KPI grid → Fleet Map (hero) + Right Panel → Analytics
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../layout/DashboardLayout';
import DashboardCards from '../components/DashboardCards';
import MapPlaceholder from '../components/MapPlaceholder';
import RecentAlerts from '../components/RecentAlerts';
import SystemHealth from '../components/dashboard/SystemHealth';
import FleetAnalytics from '../components/FleetAnalytics';
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
  return (
    <DashboardLayout>
      <div className="dashboard">
        {/* Hero Title */}
        <motion.div
          className="dashboard__hero"
          initial="hidden"
          animate="visible"
          custom={0}
          variants={fadeIn}
        >
          <div>
            <h2 className="dashboard__hero-title">Fleet Operations Center</h2>
            <p className="dashboard__hero-subtitle">
              Real-time telemetry, vehicle tracking, and fleet intelligence
            </p>
          </div>
          <div className="dashboard__hero-badge">
            <span className="dashboard__hero-badge-dot" aria-hidden="true" />
            Live Monitoring Active
          </div>
        </motion.div>

        {/* KPI Grid */}
        <DashboardCards />

        {/* Fleet Command Center: Map + Right Panel */}
        <motion.div
          className="command-center"
          initial="hidden"
          animate="visible"
          custom={0.15}
          variants={fadeIn}
        >
          {/* Main Map (Hero Element) */}
          <MapPlaceholder />

          {/* Right Panel Stack */}
          <div className="command-center__right">
            <RecentAlerts />
            <SystemHealth />
          </div>
        </motion.div>

        {/* Fleet Analytics */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={0.25}
          variants={fadeIn}
        >
          <FleetAnalytics />
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export { Dashboard as FleetDashPage };
export default memo(Dashboard);
