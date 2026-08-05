/**
 * VehicleAlertBanner.tsx – Stacked Floating Geofence & Vehicle Alert Banners (GeofenceAlertBanner)
 * Position: Top Center floating above the Fleet Map.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Info, Siren, ShieldAlert } from 'lucide-react';
import type { VehicleAlert } from '../../types/telemetry';


export interface VehicleAlertBannerProps {
  alerts?: VehicleAlert[];
  className?: string;
}

const DEFAULT_ALERTS: VehicleAlert[] = [
  {
    id: 'alt-1',
    severity: 'Warning',
    vehicleId: 'Truck #4021',
    title: 'Geofence Entry Alert',
    message: 'Truck #4021 entered Mumbai Zone B',
    timestamp: 'Just now',
  },
  {
    id: 'alt-2',
    severity: 'Critical',
    vehicleId: 'Truck #1042',
    title: 'Speed Limit Breach',
    message: 'Truck #1042 operating at 88 km/h',
    timestamp: '2s ago',
  },
];

export const VehicleAlertBanner: React.FC<VehicleAlertBannerProps> = ({ alerts = DEFAULT_ALERTS, className = '' }) => {
  return (
    <div className={`alert-banner-stack flex flex-col gap-2 w-96 ${className}`} aria-live="polite">
      {alerts.map((alt, idx) => {
        const isCritical = alt.severity === 'Critical';
        const isWarning = alt.severity === 'Warning';
        const borderColor = isCritical ? 'border-rose-500/30' : isWarning ? 'border-amber-500/30' : 'border-cyan-500/30';
        const iconBg = isCritical ? 'bg-rose-500/20 border-rose-500/40 text-rose-400' : isWarning ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400';
        const timeColor = isCritical ? 'text-rose-400/80' : isWarning ? 'text-amber-400/80' : 'text-cyan-400/80';

        return (
          <motion.div
            key={alt.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.3 }}
            className={`bg-[#181E2C]/80 backdrop-blur-md border ${borderColor} rounded-xl p-3 flex items-center justify-between shadow-lg`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg ${iconBg} border flex items-center justify-center text-sm font-semibold`}>
                {isCritical ? <Siren size={18} /> : isWarning ? <ShieldAlert size={18} /> : <Info size={18} />}
              </div>
              <div>
                <p className="text-xs font-semibold text-white">{alt.title}</p>
                <p className="text-[11px] text-gray-400">{alt.message}</p>
              </div>
            </div>
            <span className={`text-[10px] font-mono ${timeColor} whitespace-nowrap ml-2`}>
              {alt.timestamp}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};

export const GeofenceAlertBanner = VehicleAlertBanner;

export default VehicleAlertBanner;

