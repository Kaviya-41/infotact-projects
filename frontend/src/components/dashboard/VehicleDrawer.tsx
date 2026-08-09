/**
 * VehicleDrawer.tsx – Slide-in telemetry drawer for selected vehicle
 * Appears from the right edge when a vehicle marker or alert is clicked.
 */

import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Truck, User, Fuel, Activity, Navigation as RouteIcon, MapPin, Clock, ExternalLink, Compass } from 'lucide-react';
import '../../styles/dashboard.css';

interface VehicleDrawerProps {
  vehicleId: string | null;
  onClose: () => void;
}

interface DrawerVehicleData {
  id: string;
  name: string;
  driver: string;
  status: 'Moving' | 'Stopped' | 'Offline';
  speed: number;
  fuel: number;
  engineHealth: number;
  tripProgress: number;
  distanceToday: number;
  eta: string;
  route: { origin: string; destination: string };
  lastLocation: string;
}

const MOCK_VEHICLE_DATA: Record<string, DrawerVehicleData> = {
  'FLT-004': {
    id: 'FLT-004',
    name: 'Freightliner Cascadia #04',
    driver: 'Arun Kumar',
    status: 'Moving',
    speed: 68,
    fuel: 72,
    engineHealth: 96,
    tripProgress: 68,
    distanceToday: 184,
    eta: '01:42 PM',
    route: { origin: 'Bengaluru', destination: 'Hosur' },
    lastLocation: 'NH 44, Hosur Road Exit 14',
  },
  'FLT-001': {
    id: 'FLT-001',
    name: 'Volvo FH16 #01',
    driver: 'Arjun Kumar',
    status: 'Moving',
    speed: 68,
    fuel: 72,
    engineHealth: 98,
    tripProgress: 72,
    distanceToday: 240,
    eta: '02:45 PM',
    route: { origin: 'Bengaluru', destination: 'Hosur' },
    lastLocation: 'Electronic City Flyover, KM 18',
  },
  'FLT-003': {
    id: 'FLT-003',
    name: 'Kenworth T680 #03',
    driver: 'Rajesh Verma',
    status: 'Stopped',
    speed: 0,
    fuel: 34,
    engineHealth: 74,
    tripProgress: 90,
    distanceToday: 310,
    eta: '04:15 PM',
    route: { origin: 'Mumbai', destination: 'Pune' },
    lastLocation: 'Lonavala Service Hub',
  },
  'FLT-007': {
    id: 'FLT-007',
    name: 'Scania R500 #07',
    driver: 'Marcus Vance',
    status: 'Moving',
    speed: 64,
    fuel: 18,
    engineHealth: 92,
    tripProgress: 88,
    distanceToday: 420,
    eta: '12:30 PM',
    route: { origin: 'Delhi', destination: 'Jaipur' },
    lastLocation: 'Gurugram Expressway',
  },
  'FLT-010': {
    id: 'FLT-010',
    name: 'Isuzu Giga #10',
    driver: 'Suresh Patel',
    status: 'Offline',
    speed: 0,
    fuel: 40,
    engineHealth: 68,
    tripProgress: 15,
    distanceToday: 65,
    eta: '—',
    route: { origin: 'Ahmedabad', destination: 'Surat' },
    lastLocation: 'Signal lost at Vadodara Bypass',
  },
};

export const VehicleDrawer: React.FC<VehicleDrawerProps> = ({ vehicleId, onClose }) => {
  if (!vehicleId) return null;

  const data: DrawerVehicleData = MOCK_VEHICLE_DATA[vehicleId] || {
    id: vehicleId,
    name: `Vehicle ${vehicleId}`,
    driver: 'Arun Kumar',
    status: 'Moving',
    speed: 68,
    fuel: 72,
    engineHealth: 96,
    tripProgress: 68,
    distanceToday: 184,
    eta: '01:42 PM',
    route: { origin: 'Bengaluru', destination: 'Hosur' },
    lastLocation: 'NH 44, Exit 14',
  };

  const statusColor = data.status === 'Moving' ? '#10B981' : data.status === 'Stopped' ? '#F59E0B' : '#EF4444';

  return (
    <AnimatePresence>
      {vehicleId && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            style={{
              position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.3)',
              backdropFilter: 'blur(4px)', zIndex: 90,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Slide-in Drawer */}
          <motion.div
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0,
              width: '420px', maxWidth: '100vw',
              backgroundColor: 'var(--fd-bg-elevated)', boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.4)',
              zIndex: 100, display: 'flex', flexDirection: 'column',
              borderLeft: '1px solid var(--fd-border-color)',
            }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            role="dialog"
            aria-label={`Vehicle Telemetry Drawer for ${data.id}`}
          >
            {/* Drawer Header */}
            <div style={{
              padding: '24px', borderBottom: '1px solid var(--fd-border-subtle)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              backgroundColor: 'var(--fd-bg-surface)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '12px',
                  backgroundColor: 'var(--fd-color-primary-light)', color: 'var(--fd-color-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid var(--fd-border-color)',
                }}>
                  <Truck size={20} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--fd-text-primary)' }}>{data.id}</span>
                    <span style={{
                      fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px',
                      backgroundColor: `${statusColor}14`, color: statusColor,
                      border: `1px solid ${statusColor}33`, display: 'flex', alignItems: 'center', gap: '4px',
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusColor }} />
                      {data.status.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--fd-text-secondary)', marginTop: '2px' }}>{data.name}</div>
                </div>
              </div>

              <button
                onClick={onClose}
                style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  border: '1px solid var(--fd-border-color)', backgroundColor: 'var(--fd-bg-surface)',
                  color: 'var(--fd-text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.15s ease',
                }}
                title="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Drawer Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Speed Hero Display */}
              <div style={{
                textAlign: 'center', padding: '24px', borderRadius: '16px',
                backgroundColor: 'var(--fd-bg-card)', border: '1px solid var(--fd-border-color)',
              }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--fd-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  CURRENT VELOCITY
                </div>
                <div style={{
                  fontSize: '56px', fontWeight: 800, color: 'var(--fd-color-primary)',
                  fontFamily: 'var(--fd-font-mono)', lineHeight: 1, margin: '8px 0',
                }}>
                  {data.speed}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--fd-text-muted)' }}>
                  Kilometers / Hour
                </div>
              </div>

              {/* Route Banner */}
              <div style={{
                padding: '16px', borderRadius: '12px',
                backgroundColor: 'var(--fd-color-primary-light)', border: '1px solid var(--fd-border-color)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 700, color: 'var(--fd-text-primary)' }}>
                  <RouteIcon size={16} color="var(--fd-color-primary)" />
                  <span>{data.route.origin} → {data.route.destination}</span>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--fd-color-primary)', fontFamily: 'var(--fd-font-mono)' }}>
                  ETA {data.eta}
                </span>
              </div>

              {/* Grid Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {/* Driver */}
                <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: 'var(--fd-bg-surface)', border: '1px solid var(--fd-border-subtle)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--fd-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <User size={12} color="var(--fd-color-primary)" /> Driver
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--fd-text-primary)', marginTop: '4px' }}>
                    {data.driver}
                  </div>
                </div>

                {/* Fuel */}
                <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: 'var(--fd-bg-surface)', border: '1px solid var(--fd-border-subtle)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--fd-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Fuel size={12} color="#F59E0B" /> Fuel Level
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: data.fuel < 25 ? '#EF4444' : '#10B981', marginTop: '4px', fontFamily: 'var(--fd-font-mono)' }}>
                    {data.fuel}%
                  </div>
                </div>

                {/* Engine Health */}
                <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: 'var(--fd-bg-surface)', border: '1px solid var(--fd-border-subtle)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--fd-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Activity size={11} color="#10B981" /> Engine Health
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#10B981', marginTop: '4px', fontFamily: 'var(--fd-font-mono)' }}>
                    {data.engineHealth}%
                  </div>
                </div>

                {/* Distance Today */}
                <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: 'var(--fd-bg-surface)', border: '1px solid var(--fd-border-subtle)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--fd-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} color="var(--fd-color-purple)" /> Distance Today
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--fd-text-primary)', marginTop: '4px', fontFamily: 'var(--fd-font-mono)' }}>
                    {data.distanceToday} km
                  </div>
                </div>
              </div>

              {/* Trip Progress Bar */}
              <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--fd-bg-surface)', border: '1px solid var(--fd-border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  <span style={{ color: 'var(--fd-text-secondary)' }}>Trip Progress</span>
                  <span style={{ color: 'var(--fd-color-primary)', fontFamily: 'var(--fd-font-mono)' }}>{data.tripProgress}%</span>
                </div>
                <div style={{ height: '8px', backgroundColor: 'var(--fd-border-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${data.tripProgress}%`, backgroundColor: 'var(--fd-color-primary)', borderRadius: '4px', transition: 'width 0.5s ease' }} />
                </div>
              </div>

              {/* Last Location */}
              <div style={{ fontSize: '12px', color: 'var(--fd-text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={12} color="var(--fd-text-muted)" />
                <span>Location: <strong style={{ color: 'var(--fd-text-primary)' }}>{data.lastLocation}</strong></span>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div style={{
              padding: '20px 24px', borderTop: '1px solid var(--fd-border-subtle)',
              display: 'flex', gap: '12px', backgroundColor: 'var(--fd-bg-surface)',
            }}>
              <button
                style={{
                  flex: 1, padding: '10px', borderRadius: '10px',
                  backgroundColor: 'var(--fd-bg-surface)', color: 'var(--fd-text-primary)',
                  border: '1px solid var(--fd-border-color)', fontSize: '13px', fontWeight: 600,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                }}
                onClick={onClose}
              >
                <Compass size={14} color="var(--fd-color-primary)" /> Locate on Map
              </button>

              <button
                style={{
                  flex: 1, padding: '10px', borderRadius: '10px',
                  backgroundColor: 'var(--fd-color-primary)', color: '#FFFFFF',
                  border: 'none', fontSize: '13px', fontWeight: 700,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                }}
                onClick={onClose}
              >
                View Details <ExternalLink size={14} />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default memo(VehicleDrawer);
