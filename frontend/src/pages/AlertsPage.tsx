/**
 * AlertsPage.tsx – Full alerts management view.
 * Reuses RecentAlerts component.
 */

import React from 'react';
import { motion } from 'framer-motion';
import RecentAlerts from '../components/RecentAlerts';

const AlertsPage: React.FC = () => (
  <motion.div
    className="dashboard-page"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.4 }}
  >
    <div className="dashboard-section-label">
      <span className="section-label-icon" aria-hidden="true">🔔</span>
      <div>
        <h2 className="section-label-title">Alerts &amp; Notifications</h2>
        <p className="section-label-subtitle">Monitor critical events and fleet incidents</p>
      </div>
    </div>
    <RecentAlerts />
  </motion.div>
);

export default AlertsPage;
