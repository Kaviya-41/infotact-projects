/**
 * VehiclesPage.tsx → InfrastructurePage
 * Infrastructure monitoring view
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useSocketTelemetry } from '../hooks/useSocketTelemetry';
import SystemHealthCard from '../components/widgets/SystemHealthCard';
import ResourceUsageCard from '../components/widgets/ResourceUsageCard';

const InfrastructurePage: React.FC = () => {
  const { infrastructure, resources } = useSocketTelemetry(2000);

  return (
    <motion.div
      className="dashboard-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="dashboard-two-col">
        <SystemHealthCard items={infrastructure} />
        <ResourceUsageCard resources={resources} />
      </div>
    </motion.div>
  );
};

export default InfrastructurePage;
