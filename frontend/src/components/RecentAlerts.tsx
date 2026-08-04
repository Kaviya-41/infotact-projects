/**
 * RecentAlerts.tsx – Fleet Telemetry Alert Stream Component
 */

import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, Info, ShieldCheck } from 'lucide-react';
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

const RecentAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<FleetAlert[]>(MOCK_ALERTS);

  const getSeverityBadge = (severity: 'Critical' | 'Warning' | 'Info') => {
    switch (severity) {
      case 'Critical':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 700,
            backgroundColor: '#FEF2F2',
            color: '#DC2626',
            border: '1px solid #FCA5A5'
          }}>
            <AlertCircle size={12} /> CRITICAL
          </span>
        );
      case 'Warning':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 700,
            backgroundColor: '#FFFBEB',
            color: '#D97706',
            border: '1px solid #FDE68A'
          }}>
            <AlertTriangle size={12} /> WARNING
          </span>
        );
      default:
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 700,
            backgroundColor: '#F0F9FF',
            color: '#0284C7',
            border: '1px solid #BAE6FD'
          }}>
            <Info size={12} /> INFO
          </span>
        );
    }
  };

  return (
    <div className="fleet-card" id="recent-alerts-card">
      <div className="fleet-card__header">
        <h3 className="fleet-card__title">Live Fleet Alerts Stream</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          {alerts.length > 0 && (
            <button
              onClick={() => setAlerts([])}
              style={{
                fontSize: '12px',
                color: '#64748B',
                background: 'none',
                border: '1px solid #E2E8F0',
                padding: '4px 10px',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {alerts.length === 0 ? (
        /* Empty State */
        <div style={{
          padding: '36px 16px',
          textAlign: 'center',
          backgroundColor: '#F8FAFC',
          borderRadius: '10px',
          border: '1px dashed #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px'
        }}>
          <ShieldCheck size={32} color="#16A34A" />
          <div style={{ fontSize: '15px', fontWeight: 600, color: '#0F172A' }}>Everything looks good</div>
          <div style={{ fontSize: '13px', color: '#64748B' }}>No active fleet alerts at the moment. All vehicles operating within parameters.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {alerts.map((alt) => (
            <div
              key={alt.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {getSeverityBadge(alt.severity)}

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{alt.vehicleId}</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>• {alt.title}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                    {alt.message}
                  </div>
                </div>
              </div>

              <div className="tabular-nums" style={{ textAlign: 'right', fontSize: '11px', color: '#94A3B8', fontWeight: 500 }}>
                {alt.timestamp}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentAlerts;
