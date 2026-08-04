/**
 * AlertsPage.tsx – Full alert console page
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useSocketTelemetry } from '../hooks/useSocketTelemetry';
import AlertBannerStack from '../components/widgets/AlertBanner';
import GlassCard from '../components/ui/GlassCard';

const AlertsPage: React.FC = () => {
  const { alerts } = useSocketTelemetry(2000);

  return (
    <motion.div
      className="dashboard-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <GlassCard title="Active Alerts" titleIcon="🚨" id="alerts-console">
        <AlertBannerStack alerts={alerts} maxVisible={8} />
      </GlassCard>
    </motion.div>
  );
};

export default AlertsPage;
