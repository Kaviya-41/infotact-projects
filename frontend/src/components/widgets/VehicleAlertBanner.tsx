/**
 * VehicleAlertBanner.tsx – Stacked Floating Vehicle Alert Banners
 * Position: Top Center floating above the Fleet Map.
 */

import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import type { VehicleAlert, AlertSeverity } from '../../types/telemetry';

interface VehicleAlertBannerProps {
  alerts?: VehicleAlert[];
}

const DEFAULT_ALERTS: VehicleAlert[] = [
  {
    id: 'alt-1',
    severity: 'Critical',
    vehicleId: 'FLT-018',
    title: 'Vehicle Offline',
    message: 'Last telemetry signal 4 min ago',
    timestamp: '4 min ago',
  },
  {
    id: 'alt-2',
    severity: 'Warning',
    vehicleId: 'FLT-031',
    title: 'Speed Limit Exceeded',
    message: 'Current speed 92 km/h (Limit: 65 km/h)',
    timestamp: '2 min ago',
  },
];

const SEVERITY_ICONS: Record<AlertSeverity, React.ReactNode> = {
  Critical: <AlertCircle size={16} color="#DC2626" />,
  Warning:  <AlertTriangle size={16} color="#D97706" />,
  Info:     <Info size={16} color="#2563EB" />,
  Success:  <CheckCircle2 size={16} color="#16A34A" />,
};

const VehicleAlertBanner: React.FC<VehicleAlertBannerProps> = ({ alerts = DEFAULT_ALERTS }) => {
  return (
    <div className="alert-banner-stack" aria-live="polite">
      {alerts.map((alt) => (
        <div key={alt.id} className={`vehicle-alert-banner vehicle-alert-banner--${alt.severity.toLowerCase()}`}>
          <div>{SEVERITY_ICONS[alt.severity]}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: 800, color: '#0F172A' }}>{alt.vehicleId}</span>
              <span style={{ fontWeight: 600, color: '#334155' }}>• {alt.title}</span>
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '1px' }}>
              {alt.message}
            </div>
          </div>
          <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500 }} className="font-mono">
            {alt.timestamp}
          </span>
        </div>
      ))}
    </div>
  );
};

export default VehicleAlertBanner;
