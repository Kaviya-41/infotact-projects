/**
 * LiveMapPage.tsx – Full-screen live map view.
 * Reuses MapPlaceholder at full height.
 */

import React from 'react';
import { motion } from 'framer-motion';
import MapPlaceholder from '../components/MapPlaceholder';

const LiveMapPage: React.FC = () => (
  <motion.div
    className="dashboard-page"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.4 }}
  >
    <div className="dashboard-section-label">
      <span className="section-label-icon" aria-hidden="true">🗺</span>
      <div>
        <h2 className="section-label-title">Live Map</h2>
        <p className="section-label-subtitle">Real-time vehicle positions &amp; route tracking</p>
      </div>
    </div>
    <MapPlaceholder height={720} />
  </motion.div>
);

export default LiveMapPage;
