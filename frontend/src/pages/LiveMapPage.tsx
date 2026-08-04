/**
 * LiveMapPage.tsx – Dedicated Full Live Fleet Map Page
 */

import React from 'react';
import { motion } from 'framer-motion';
import MapPlaceholder from '../components/MapPlaceholder';
import VehicleTelemetry from '../components/dashboard/VehicleTelemetry';
import Footer from '../components/Footer';

const LiveMapPage: React.FC = () => {
  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="map-telemetry-row">
        <MapPlaceholder height={680} />
        <VehicleTelemetry />
      </div>
      <Footer />
    </motion.div>
  );
};

export default LiveMapPage;
