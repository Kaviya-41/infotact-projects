/**
 * ActiveTripsCard.tsx – Trips currently in progress
 * Positioned below the main Live Fleet Map beside Live Alerts (1fr 1fr grid).
 */

import React, { memo } from 'react';
import { motion, type Variants } from 'framer-motion';
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

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
};

export const ActiveTripsCard: React.FC = () => {
  return (
    <motion.div
      className="fd-card fd-card--no-hover active-trips-card"
      id="active-trips-card"
      initial="hidden"
      animate="visible"
      variants={cardVariants}
    >
      <div className="fd-card__header">
        <div>
          <h3 className="fd-card__title">
            <span className="icon-badge-blue">
              <RouteIcon size={14} />
            </span>
            <span>Active Trips</span>
          </h3>
          <p className="fd-card__subtitle">
            Trips currently in progress
          </p>
        </div>

        <span className="badge-pill-blue">
          18 Active
        </span>
      </div>

      {/* Trips list */}
      <div className="trips-stream">
        {TRIPS.map((trip) => (
          <div key={trip.id} className="trip-card-item">
            {/* Header: ID + Route + Speed */}
            <div className="trip-item-top">
              <div className="trip-route-info">
                <span className="trip-vehicle-id">{trip.vehicleId}</span>
                <span className="trip-route-text">
                  <span>{trip.origin}</span>
                  <ArrowRight size={12} color="#2563EB" />
                  <span>{trip.destination}</span>
                </span>
              </div>

              <span className="trip-speed-badge tabular-nums">
                {trip.speed} km/h
              </span>
            </div>

            {/* Sub-info: Driver, ETA, Remaining Distance */}
            <div className="trip-item-meta">
              <span className="trip-meta-item">
                <User size={12} /> Driver: <strong>{trip.driver}</strong>
              </span>
              <span className="trip-meta-item">
                <Clock size={12} /> ETA: <strong>{trip.eta}</strong>
              </span>
              <span className="trip-meta-item">
                <MapPin size={12} /> {trip.remainingDistance}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="trip-progress-container">
              <div className="trip-progress-labels">
                <span className="progress-label-text">{trip.progress}% complete</span>
                <span className="progress-pct tabular-nums">{trip.progress}%</span>
              </div>
              <div className="progress-bar-track">
                <motion.div
                  className="progress-bar-fill progress-bar-fill--blue"
                  initial={{ width: 0 }}
                  animate={{ width: `${trip.progress}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Link */}
      <div className="card-footer-link">
        <a href="#trips" onClick={(e) => e.preventDefault()} className="action-link">
          <span>View All Trips</span>
          <ChevronRight size={13} />
        </a>
      </div>
    </motion.div>
  );
};

export default memo(ActiveTripsCard);
