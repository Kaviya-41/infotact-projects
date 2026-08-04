/**
 * LiveMapPage.tsx → IncidentMapPage
 * Full-screen incident map view
 */

import React from 'react';
import { motion } from 'framer-motion';
import IncidentMapCanvas from '../components/canvas/IncidentMapCanvas';
import EvacuationCard from '../components/widgets/EvacuationCard';
import AlertBannerStack from '../components/widgets/AlertBanner';
import { useSocketTelemetry } from '../hooks/useSocketTelemetry';

const IncidentMapPage: React.FC = () => {
  const { evacuation, alerts } = useSocketTelemetry(3000);

  return (
    <motion.div
      className="dashboard-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div style={{ position: 'relative' }}>
        <div style={{ minHeight: '70vh' }}>
          <IncidentMapCanvas />
        </div>
        <div className="canvas-overlay">
          <div className="canvas-overlay__top-left">
            <EvacuationCard data={evacuation} />
          </div>
          <div className="canvas-overlay__top-center">
            <AlertBannerStack alerts={alerts} maxVisible={4} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default IncidentMapPage;
