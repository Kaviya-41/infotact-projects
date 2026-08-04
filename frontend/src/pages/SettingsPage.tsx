/**
 * SettingsPage.tsx – Placeholder settings page
 */

import React from 'react';
import { motion } from 'framer-motion';

const SettingsPage: React.FC = () => {
  return (
    <motion.div
      className="dashboard-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="placeholder-page">
        <span className="placeholder-page__icon">⚙️</span>
        <h2 className="placeholder-page__title">Settings</h2>
        <p className="placeholder-page__desc">
          Configure notification channels, alert thresholds, display density, and high-contrast emergency mode. Coming soon.
        </p>
      </div>
    </motion.div>
  );
};

export default SettingsPage;
