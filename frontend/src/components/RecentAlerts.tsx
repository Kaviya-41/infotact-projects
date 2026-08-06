/**
 * RecentAlerts.tsx – Live Fleet Alert Stream with Framer Motion
 * Premium light card with severity badges and slide-in animation.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, AlertTriangle, Info, ShieldCheck, ChevronRight } from 'lucide-react';
import type { FleetAlert } from '../types/fleet';
import '../styles/dashboard.css';

const MOCK_ALERTS: FleetAlert[] = [
  {
    id: 'alt-101',
    vehicleId: 'FLT-018',
    vehicleName: 'Kenworth T680 #18',
    severity: 'Critical',
    title: 'Vehicle Offline',
    message: 'GPS telemetry signal disconnected on Route 9',
    timestamp: '2 min ago',
    location: 'Sector 4 - Exit 12',
  },
  {
    id: 'alt-102',
    vehicleId: 'FLT-031',
    vehicleName: 'Ford Transit #31',
    severity: 'Warning',
    title: 'Speed Threshold Exceeded',
    message: 'Vehicle speed reached 92 km/h in 65 km/h zone',
    timestamp: '5 min ago',
    location: 'I-95 Northbound MP 108',
  },
  {
    id: 'alt-103',
    vehicleId: 'FLT-007',
    vehicleName: 'Volvo FH16 #07',
    severity: 'Info',
    title: 'Route Completed',
    message: 'Delivery milestone completed ahead of schedule',
    timestamp: '8 min ago',
    location: 'Highland Logistics Center',
  },
  {
    id: 'alt-104',
    vehicleId: 'FLT-005',
    vehicleName: 'Isuzu NPR #05',
    severity: 'Warning',
    title: 'Fuel Reserve Low',
    message: 'Fuel level dropped below 15% threshold',
    timestamp: '14 min ago',
    location: 'Metro Distribution Hub',
  },
];

const severityConfig = {
  Critical: {
    bg: 'rgba(239, 68, 68, 0.06)',
    border: '1px solid rgba(239, 68, 68, 0.15)',
    badgeBg: '#FEF2F2',
    badgeColor: '#DC2626',
    badgeBorder: '1px solid #FCA5A5',
    Icon: AlertCircle,
  },
  Warning: {
    bg: 'rgba(245, 158, 11, 0.06)',
    border: '1px solid rgba(245, 158, 11, 0.15)',
    badgeBg: '#FFFBEB',
    badgeColor: '#D97706',
    badgeBorder: '1px solid #FDE68A',
    Icon: AlertTriangle,
  },
  Info: {
    bg: 'rgba(14, 165, 233, 0.06)',
    border: '1px solid rgba(14, 165, 233, 0.15)',
    badgeBg: '#F0F9FF',
    badgeColor: '#0284C7',
    badgeBorder: '1px solid #BAE6FD',
    Icon: Info,
  },
};

const RecentAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<FleetAlert[]>(MOCK_ALERTS);

  return (
    <motion.div
      className="fd-card fd-card--no-hover"
      id="recent-alerts-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="fd-card__header">
        <h3 className="fd-card__title">
          <span style={{
            width: '28px', height: '28px', borderRadius: '8px',
            background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#EF4444',
          }}>
            <AlertCircle size={14} />
          </span>
          Live Alerts
        </h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          {alerts.length > 0 && (
            <button
              onClick={() => setAlerts([])}
              style={{
                fontSize: '12px', color: '#64748B', background: 'none',
                border: '1px solid #E2E8F0', padding: '4px 10px',
                borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#F1F5F9'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {alerts.length === 0 ? (
        <div style={{
          padding: '36px 16px', textAlign: 'center',
          backgroundColor: '#F8FAFC', borderRadius: '10px',
          border: '1px dashed #E2E8F0', display: 'flex',
          flexDirection: 'column', alignItems: 'center', gap: '8px',
        }}>
          <ShieldCheck size={32} color="#10B981" />
          <div style={{ fontSize: '15px', fontWeight: 600, color: '#0F172A' }}>Everything looks good</div>
          <div style={{ fontSize: '13px', color: '#64748B' }}>No active fleet alerts. All vehicles within parameters.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '320px', overflowY: 'auto' }}>
          <AnimatePresence>
            {alerts.map((alt, idx) => {
              const config = severityConfig[alt.severity];
              const SevIcon = config.Icon;

              return (
                <motion.div
                  key={alt.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.25 }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 14px', backgroundColor: config.bg,
                    border: config.border, borderRadius: '10px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                      padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700,
                      backgroundColor: config.badgeBg, color: config.badgeColor,
                      border: config.badgeBorder, whiteSpace: 'nowrap', flexShrink: 0,
                    }}>
                      <SevIcon size={12} /> {alt.severity.toUpperCase()}
                    </span>

                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{alt.vehicleId}</span>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>• {alt.title}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {alt.message}
                      </div>
                    </div>
                  </div>

                  <div className="tabular-nums" style={{ textAlign: 'right', fontSize: '11px', color: '#94A3B8', fontWeight: 500, whiteSpace: 'nowrap', marginLeft: '12px' }}>
                    {alt.timestamp}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* View All Link */}
      {alerts.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: '12px' }}>
          <a href="#alerts" onClick={(e) => e.preventDefault()} style={{
            fontSize: '13px', fontWeight: 600, color: '#2563EB',
            textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px',
          }}>
            View All Alerts <ChevronRight size={14} />
          </a>
        </div>
      )}
    </motion.div>
  );
};

export default RecentAlerts;
