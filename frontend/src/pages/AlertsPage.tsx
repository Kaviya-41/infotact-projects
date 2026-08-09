/**
 * AlertsPage.tsx – Dedicated Alerts Center Page
 * Displays critical & warning alerts with severity filters, timestamps, and vehicle drawer triggers.
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, CheckCircle2, Filter, ChevronRight, Siren } from 'lucide-react';
import VehicleDrawer from '../components/dashboard/VehicleDrawer';
import '../styles/dashboard.css';

interface DetailedAlert {
  id: string;
  vehicleId: string;
  vehicleName: string;
  severity: 'Critical' | 'Warning' | 'Info';
  title: string;
  description: string;
  timestamp: string;
  status: 'Active' | 'Acknowledged' | 'Resolved';
  location: string;
}

const ALL_ALERTS: DetailedAlert[] = [
  {
    id: 'alt-201',
    vehicleId: 'Truck #4021',
    vehicleName: 'Tata Prima #4021',
    severity: 'Critical',
    title: 'Geofence Entry Alert',
    description: 'Truck #4021 entered Mumbai Zone B restricted delivery sector.',
    timestamp: 'Just now',
    status: 'Active',
    location: 'Mumbai Zone B',
  },
  {
    id: 'alt-202',
    vehicleId: 'Truck #1042',
    vehicleName: 'Volvo FH16 #1042',
    severity: 'Warning',
    title: 'Speed Limit Breach',
    description: 'Truck #1042 operating at 88 km/h in 65 km/h zone.',
    timestamp: '2s ago',
    status: 'Active',
    location: 'I-95 Highway MP 108',
  },
  {
    id: 'alt-203',
    vehicleId: 'FLT-003',
    vehicleName: 'Kenworth T680 #03',
    severity: 'Critical',
    title: 'High Engine Temperature',
    description: 'Engine temperature exceeded recommended operating range (112°C).',
    timestamp: '2 minutes ago',
    status: 'Active',
    location: 'Lonavala Service Hub',
  },
  {
    id: 'alt-204',
    vehicleId: 'FLT-010',
    vehicleName: 'Isuzu Giga #10',
    severity: 'Warning',
    title: 'Vehicle Offline',
    description: 'GPS telemetry signal disconnected on Route 9 Corridor.',
    timestamp: '5 minutes ago',
    status: 'Active',
    location: 'Vadodara Bypass',
  },
  {
    id: 'alt-205',
    vehicleId: 'FLT-007',
    vehicleName: 'Scania R500 #07',
    severity: 'Warning',
    title: 'Low Fuel Reserve',
    description: 'Fuel level dropped below 20% reserve threshold.',
    timestamp: '12 minutes ago',
    status: 'Active',
    location: 'Gurugram Expressway',
  },
  {
    id: 'alt-206',
    vehicleId: 'FLT-012',
    vehicleName: 'Mercedes Sprinter #12',
    severity: 'Info',
    title: 'Route Completed On Schedule',
    description: 'Delivery milestone completed 15 minutes ahead of schedule.',
    timestamp: '25 minutes ago',
    status: 'Resolved',
    location: 'Highland Logistics Center',
  },
];

const AlertsPage: React.FC = () => {
  const [filter, setFilter] = useState<'All' | 'Critical' | 'Warning' | 'Info' | 'Resolved'>('All');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [alertsList, setAlertsList] = useState<DetailedAlert[]>(ALL_ALERTS);

  const filteredAlerts = useMemo(() => {
    if (filter === 'All') return alertsList;
    if (filter === 'Resolved') return alertsList.filter(a => a.status === 'Resolved');
    return alertsList.filter(a => a.severity === filter);
  }, [filter, alertsList]);

  const handleAcknowledge = (id: string) => {
    setAlertsList(prev => prev.map(a => a.id === id ? { ...a, status: 'Acknowledged' } : a));
  };

  return (
    <div className="dashboard">
      {/* Page Header */}
      <div>
        <h2 className="dashboard__hero-title">Alerts Center</h2>
        <p className="dashboard__hero-subtitle">
          Monitor operational warnings and critical fleet events.
        </p>
      </div>

      {/* Filter Tabs & Toolbar */}
      <div className="fd-card fd-card--compact" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <Filter size={15} color="var(--fd-text-secondary)" />
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--fd-text-secondary)', marginRight: '8px' }}>Filter Severity:</span>
          {(['All', 'Critical', 'Warning', 'Info', 'Resolved'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                border: filter === tab ? '1px solid var(--fd-color-primary)' : '1px solid var(--fd-border-color)',
                backgroundColor: filter === tab ? 'var(--fd-color-primary)' : 'var(--fd-bg-surface)',
                color: filter === tab ? '#FFFFFF' : 'var(--fd-text-secondary)',
                cursor: 'pointer', transition: 'all 0.15s ease',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <span style={{ fontSize: '12px', color: 'var(--fd-text-muted)', fontWeight: 500 }}>
          Showing {filteredAlerts.length} of {alertsList.length} alerts
        </span>
      </div>

      {/* Alerts Stream Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <AnimatePresence>
          {filteredAlerts.map((alt) => {
            const isCritical = alt.severity === 'Critical';
            const isWarning = alt.severity === 'Warning';
            const borderColor = isCritical ? 'rgba(239, 68, 68, 0.25)' : isWarning ? 'rgba(245, 158, 11, 0.25)' : 'rgba(6, 182, 212, 0.25)';
            const badgeBg = isCritical ? 'rgba(239, 68, 68, 0.08)' : isWarning ? 'rgba(245, 158, 11, 0.08)' : 'rgba(6, 182, 212, 0.08)';
            const badgeColor = isCritical ? '#EF4444' : isWarning ? '#F59E0B' : '#06B6D4';
            const badgeBorder = isCritical ? 'rgba(239, 68, 68, 0.25)' : isWarning ? 'rgba(245, 158, 11, 0.25)' : 'rgba(6, 182, 212, 0.25)';

            return (
              <motion.div
                key={alt.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="fd-card fd-card--no-hover"
                style={{
                  borderLeft: `4px solid ${badgeColor}`,
                  borderTop: `1px solid ${borderColor}`,
                  display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                      padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700,
                      backgroundColor: badgeBg, color: badgeColor, border: `1px solid ${badgeBorder}`,
                    }}>
                      {isCritical ? <Siren size={12} /> : isWarning ? <AlertTriangle size={12} /> : <Info size={12} />}
                      {alt.severity.toUpperCase()}
                    </span>

                    <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--fd-text-primary)' }}>
                      {alt.vehicleId}
                    </span>
                    <span style={{ fontSize: '13px', color: 'var(--fd-text-muted)' }}>({alt.vehicleName})</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {alt.status === 'Acknowledged' && (
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#06B6D4', backgroundColor: 'rgba(6, 182, 212, 0.08)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(6, 182, 212, 0.25)' }}>
                        ● Acknowledged
                      </span>
                    )}
                    <span className="tabular-nums" style={{ fontSize: '12px', color: 'var(--fd-text-muted)', fontWeight: 500 }}>
                      {alt.timestamp}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--fd-text-primary)', marginBottom: '4px' }}>
                    {alt.title}
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--fd-text-secondary)', lineHeight: 1.5 }}>
                    {alt.description}
                  </p>
                  <div style={{ fontSize: '12px', color: 'var(--fd-text-muted)', marginTop: '6px' }}>
                    Location: <strong style={{ color: 'var(--fd-text-secondary)' }}>{alt.location}</strong>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--fd-border-subtle)' }}>
                  <button
                    onClick={() => handleAcknowledge(alt.id)}
                    disabled={alt.status !== 'Active'}
                    style={{
                      fontSize: '12px', fontWeight: 600, padding: '6px 12px', borderRadius: '6px',
                      border: '1px solid var(--fd-border-color)', backgroundColor: 'var(--fd-bg-surface)',
                      color: alt.status === 'Active' ? 'var(--fd-text-primary)' : 'var(--fd-text-muted)',
                      cursor: alt.status === 'Active' ? 'pointer' : 'default',
                      display: 'flex', alignItems: 'center', gap: '4px',
                    }}
                  >
                    <CheckCircle2 size={13} color={alt.status !== 'Active' ? 'var(--fd-text-muted)' : '#10B981'} />
                    {alt.status === 'Active' ? 'Acknowledge' : alt.status}
                  </button>

                  <button
                    onClick={() => setSelectedVehicleId(alt.vehicleId.startsWith('FLT-') ? alt.vehicleId : 'FLT-004')}
                    style={{
                      fontSize: '13px', fontWeight: 700, color: 'var(--fd-color-primary)',
                      backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'inherit',
                    }}
                  >
                    View Vehicle <ChevronRight size={14} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Vehicle Drawer */}
      <VehicleDrawer
        vehicleId={selectedVehicleId}
        onClose={() => setSelectedVehicleId(null)}
      />
    </div>
  );
};

export default AlertsPage;
