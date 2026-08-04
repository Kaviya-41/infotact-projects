/**
 * AlertsPage.tsx – Dedicated Fleet Telemetry Alerts Stream Page
 */

import React from 'react';
import { motion } from 'framer-motion';
import RecentAlerts from '../components/RecentAlerts';
import FleetHealth from '../components/dashboard/FleetHealth';
import Footer from '../components/Footer';

const AlertsPage: React.FC = () => {
  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="dashboard-two-col">
        <RecentAlerts />
        <FleetHealth />
      </div>
      <Footer />
    </motion.div>
  );
};

export default AlertsPage;
