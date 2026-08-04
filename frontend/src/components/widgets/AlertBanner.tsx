/**
 * AlertBanner.tsx – Severity-based stacked alert banners
 * Renders on the canvas overlay with auto-animate entry/exit.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';
import type { AlertEvent, AlertSeverity } from '../../types/telemetry';

interface AlertBannerStackProps {
  alerts: AlertEvent[];
  maxVisible?: number;
}

const SEVERITY_ICONS: Record<AlertSeverity, React.ReactNode> = {
  critical: <AlertTriangle size={14} />,
  warning:  <AlertCircle size={14} />,
  info:     <Info size={14} />,
  success:  <CheckCircle size={14} />,
};

const formatTimestamp = (iso: string): string => {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
};

const AlertBannerStack: React.FC<AlertBannerStackProps> = ({ alerts, maxVisible = 3 }) => {
  const visible = alerts.slice(0, maxVisible);

  return (
    <div aria-live="assertive" aria-atomic="false" role="log">
      <AnimatePresence mode="popLayout">
        {visible.map(alert => (
          <motion.div
            key={alert.id}
            className={`alert-banner alert-banner--${alert.severity}`}
            initial={{ y: -16, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -10, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
            layout
            style={{ marginBottom: 8 }}
          >
            <div className="alert-banner__icon">
              {SEVERITY_ICONS[alert.severity]}
            </div>
            <div className="alert-banner__content">
              <p className="alert-banner__title">{alert.title}</p>
              <p className="alert-banner__desc">{alert.description}</p>
            </div>
            <span className="alert-banner__time">{formatTimestamp(alert.timestamp)}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default AlertBannerStack;
