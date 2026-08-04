/**
 * VehiclesPage.tsx – Dedicated Fleet Vehicles Management Page
 */

import React from 'react';
import { motion } from 'framer-motion';
import VehicleList from '../components/VehicleList';
import Footer from '../components/Footer';

const VehiclesPage: React.FC = () => {
  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <VehicleList />
      <Footer />
    </motion.div>
  );
};

export default VehiclesPage;
