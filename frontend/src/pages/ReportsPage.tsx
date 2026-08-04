/**
 * ReportsPage.tsx – Dedicated Fleet Analytics Page
 */

import React from 'react';
import { motion } from 'framer-motion';
import FleetAnalytics from '../components/FleetAnalytics';
import Footer from '../components/Footer';

const ReportsPage: React.FC = () => {
  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <FleetAnalytics />
      <Footer />
    </motion.div>
  );
};

export default ReportsPage;
