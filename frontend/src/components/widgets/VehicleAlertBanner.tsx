/**
 * VehicleAlertBanner.tsx – Live Map Alerts Card
 * High-contrast, clean enterprise alert card displaying real-time geofence,
 * speed limit, temperature, and telemetry notifications with clickable inspection.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ShieldAlert, Siren, Fuel, ChevronRight } from 'lucide-react';
import type { VehicleAlert } from '../../types/telemetry';
import '../../styles/dashboard.css';

export interface VehicleAlertBannerProps {
  alerts?: VehicleAlert[];
  onSelectVehicle?: (id: string) => void;
  className?: string;
}

const DEFAULT_ALERTS: VehicleAlert[] = [
  {
    id: 'alt-1',
    severity: 'Warning',
    vehicleId: 'Truck #4021',
    title: 'Geofence Entry Alert',
    message: 'Truck #4021 entered Mumbai Zone B Access Area',
    timestamp: 'Just now',
  },
  {
    id: 'alt-2',
    severity: 'Critical',
    vehicleId: 'Truck #1042',
    title: 'Speed Limit Breach',
    message: 'Truck #1042 operating at 88 km/h (Limit: 70 km/h)',
    timestamp: '2s ago',
  },
  {
    id: 'alt-3',
    severity: 'Critical',
    vehicleId: 'FLT-003',
    title: 'High Engine Temperature',
    message: 'Coolant temperature reached 112°C at Lonavala Hub',
    timestamp: '2m ago',
  },
  {
    id: 'alt-4',
    severity: 'Warning',
    vehicleId: 'FLT-007',
    title: 'Low Fuel Advisory',
    message: 'Fuel level dropped below 18% reserve limit',
    timestamp: '5m ago',
  },
];

export const VehicleAlertBanner: React.FC<VehicleAlertBannerProps> = ({
  alerts = DEFAULT_ALERTS,
  onSelectVehicle,
  className = '',
}) => {

  return (
    <div className={`fd-card fd-card--no-hover ${className}`} id="live-map-alerts-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <AlertCircle size={16} />
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Operational Alerts
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
                Live Map Alerts
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
              backgroundColor: 'rgba(239, 68, 68, 0.08)', color: '#EF4444',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
              {alerts.length} Active
            </span>
          </div>
        </div>

        {/* Alerts List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <AnimatePresence>
            {alerts.map((alt) => {
              const isCritical = alt.severity === 'Critical';
              const badgeBg = isCritical ? 'rgba(239, 68, 68, 0.08)' : 'rgba(245, 158, 11, 0.08)';
              const badgeColor = isCritical ? '#EF4444' : '#F59E0B';
              const badgeBorder = isCritical ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)';

              return (
                <motion.div
                  key={alt.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    cursor: onSelectVehicle ? 'pointer' : 'default',
                    transition: 'all 0.15s ease',
                  }}
                  onClick={() => onSelectVehicle?.(alt.vehicleId)}
                  role={onSelectVehicle ? 'button' : undefined}
                  tabIndex={onSelectVehicle ? 0 : undefined}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '6px',
                      backgroundColor: badgeBg, color: badgeColor, border: `1px solid ${badgeBorder}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      {isCritical ? <Siren size={14} /> : alt.title.includes('Fuel') ? <Fuel size={14} /> : <ShieldAlert size={14} />}
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>
                          {alt.title}
                        </span>
                        <span style={{
                          fontSize: '10px', fontWeight: 700,
                          padding: '1px 6px', borderRadius: '4px',
                          backgroundColor: badgeBg, color: badgeColor, border: `1px solid ${badgeBorder}`
                        }}>
                          {alt.severity}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '1px' }}>
                        {alt.message}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                    <span style={{ fontSize: '10.5px', color: '#94A3B8', fontWeight: 600, fontFamily: 'var(--fd-font-mono, monospace)' }}>
                      {alt.timestamp}
                    </span>
                    {onSelectVehicle && <ChevronRight size={13} color="#94A3B8" />}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export const GeofenceAlertBanner = VehicleAlertBanner;
export default VehicleAlertBanner;
