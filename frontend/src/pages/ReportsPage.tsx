/**
 * ReportsPage.tsx – Placeholder reports page
 */

import React from 'react';
import { motion } from 'framer-motion';

const ReportsPage: React.FC = () => {
  return (
    <motion.div
      className="dashboard-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="placeholder-page">
        <span className="placeholder-page__icon">📊</span>
        <h2 className="placeholder-page__title">Reports & Analytics</h2>
        <p className="placeholder-page__desc">
          Historical incident analysis, response performance metrics, and exportable disaster intelligence reports. Coming soon.
        </p>
      </div>
    </motion.div>
  );
};

export default ReportsPage;
