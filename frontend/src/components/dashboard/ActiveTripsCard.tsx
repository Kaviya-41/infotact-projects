/**
 * ActiveTripsCard.tsx – Trips currently in progress
 * Positioned below the main Live Fleet Map.
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Route as RouteIcon, ArrowRight, ChevronRight, User, Clock, MapPin } from 'lucide-react';
import '../../styles/dashboard.css';

interface TripItem {
  id: string;
  vehicleId: string;
  driver: string;
  origin: string;
  destination: string;
  speed: number;
  progress: number;
  eta: string;
  remainingDistance: string;
}

const TRIPS: TripItem[] = [
  {
    id: 'trip-1',
    vehicleId: 'FLT-001',
    driver: 'Arjun Kumar',
    origin: 'Bengaluru',
    destination: 'Hosur',
    speed: 68,
    progress: 72,
    eta: '02:45 PM',
    remainingDistance: '24 km remaining',
  },
  {
    id: 'trip-2',
    vehicleId: 'FLT-004',
    driver: 'Karthik S',
    origin: 'Bengaluru',
    destination: 'Chennai',
    speed: 54,
    progress: 48,
    eta: '05:20 PM',
    remainingDistance: '168 km remaining',
  },
];

export const ActiveTripsCard: React.FC = () => {
  return (
    <motion.div
      className="fd-card fd-card--no-hover"
      id="active-trips-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="fd-card__header">
        <div>
          <h3 className="fd-card__title">
            <span style={{
              width: '28px', height: '28px', borderRadius: '8px',
              background: 'rgba(37, 99, 235, 0.08)', border: '1px solid rgba(37, 99, 235, 0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#2563EB',
            }}>
              <RouteIcon size={14} />
            </span>
            Active Trips
          </h3>
          <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
            Trips currently in progress
          </p>
        </div>

        <span style={{
          fontSize: '12px', fontWeight: 600, color: '#2563EB',
          background: 'rgba(37, 99, 235, 0.08)', padding: '4px 10px',
          borderRadius: '9999px', border: '1px solid rgba(37, 99, 235, 0.15)',
        }}>
          18 Active
        </span>
      </div>

      {/* Trips list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {TRIPS.map((trip) => (
          <div
            key={trip.id}
            style={{
              padding: '16px', borderRadius: '12px',
              backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0',
              display: 'flex', flexDirection: 'column', gap: '12px',
            }}
          >
            {/* Header: ID + Route + Speed */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
                  {trip.vehicleId}
                </span>
                <span style={{
                  fontSize: '13px', fontWeight: 600, color: '#334155',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                  {trip.origin} <ArrowRight size={13} color="#2563EB" /> {trip.destination}
                </span>
              </div>

              <span style={{
                fontSize: '12px', fontWeight: 700, color: '#2563EB',
                fontFamily: 'var(--fd-font-mono)', backgroundColor: '#EFF6FF',
                padding: '3px 8px', borderRadius: '6px', border: '1px solid #DBEAFE',
              }}>
                {trip.speed} km/h
              </span>
            </div>

            {/* Sub-info: Driver */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: '#64748B' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <User size={12} /> Driver: <strong style={{ color: '#0F172A' }}>{trip.driver}</strong>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={12} /> ETA: <strong style={{ color: '#0F172A' }}>{trip.eta}</strong>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={12} /> {trip.remainingDistance}
              </span>
            </div>

            {/* Progress Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                <span style={{ color: '#475569' }}>{trip.progress}% Complete</span>
                <span style={{ color: '#2563EB', fontFamily: 'var(--fd-font-mono)' }}>{trip.progress}%</span>
              </div>
              <div style={{ height: '7px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                <motion.div
                  style={{ height: '100%', backgroundColor: '#2563EB', borderRadius: '4px' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${trip.progress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Link */}
      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <a href="#trips" onClick={(e) => e.preventDefault()} style={{
          fontSize: '13px', fontWeight: 700, color: '#2563EB',
          textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px',
        }}>
          View All Trips <ChevronRight size={14} />
        </a>
      </div>
    </motion.div>
  );
};

export default memo(ActiveTripsCard);
