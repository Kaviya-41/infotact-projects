/**
 * VehicleHUD.tsx – Selected Vehicle Head-Up Display Overlay
 * Automotive-inspired telemetry overlay showing speed, route, driver, and metrics
 * for the currently selected vehicle on the fleet map.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, User, Fuel, Clock, TrendingUp } from 'lucide-react';
import '../../styles/dashboard.css';

interface VehicleData {
  id: string;
  name: string;
  driver: string;
  status: 'Moving' | 'Stopped' | 'Offline';
  speed: number;
  fuel: number;
  tripProgress: number;
  eta: string;
  route: { origin: string; destination: string };
}

interface VehicleHUDProps {
  vehicle: VehicleData;
}

const VehicleHUD: React.FC<VehicleHUDProps> = ({ vehicle }) => {
  const statusLabel = vehicle.status.toUpperCase();
  const statusColor = vehicle.status === 'Moving'
    ? '#10B981'
    : vehicle.status === 'Stopped'
      ? '#F59E0B'
      : '#EF4444';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={vehicle.id}
        className="vehicle-hud"
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        role="region"
        aria-label={`Selected vehicle: ${vehicle.id}`}
      >
        {/* Top Row: ID + Status + Speed */}
        <div className="vehicle-hud__top">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="vehicle-hud__id">{vehicle.id}</span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              padding: '3px 10px', borderRadius: '9999px',
              fontSize: '11px', fontWeight: 700,
              backgroundColor: `${statusColor}14`, color: statusColor,
              border: `1px solid ${statusColor}33`,
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusColor }} aria-hidden="true" />
              {statusLabel}
            </span>
          </div>

          <div className="vehicle-hud__speed">
            <span className="vehicle-hud__speed-value">{vehicle.speed}</span>
            <span className="vehicle-hud__speed-unit">km/h</span>
          </div>
        </div>

        {/* Route */}
        <div className="vehicle-hud__route">
          <span>{vehicle.route.origin}</span>
          <ArrowRight size={14} className="vehicle-hud__route-arrow" />
          <span>{vehicle.route.destination}</span>
        </div>

        {/* Metrics Grid */}
        <div className="vehicle-hud__metrics">
          <div>
            <div className="vehicle-hud__metric-label">
              <User size={10} style={{ display: 'inline', marginRight: '3px', verticalAlign: 'middle' }} />
              Driver
            </div>
            <div className="vehicle-hud__metric-value">{vehicle.driver}</div>
          </div>
          <div>
            <div className="vehicle-hud__metric-label">
              <Fuel size={10} style={{ display: 'inline', marginRight: '3px', verticalAlign: 'middle' }} />
              Fuel
            </div>
            <div className="vehicle-hud__metric-value" style={{ color: vehicle.fuel < 25 ? '#EF4444' : '#10B981' }}>
              {vehicle.fuel}%
            </div>
          </div>
          <div>
            <div className="vehicle-hud__metric-label">
              <TrendingUp size={10} style={{ display: 'inline', marginRight: '3px', verticalAlign: 'middle' }} />
              Trip
            </div>
            <div className="vehicle-hud__metric-value">{vehicle.tripProgress}%</div>
          </div>
          <div>
            <div className="vehicle-hud__metric-label">
              <Clock size={10} style={{ display: 'inline', marginRight: '3px', verticalAlign: 'middle' }} />
              ETA
            </div>
            <div className="vehicle-hud__metric-value">{vehicle.eta}</div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VehicleHUD;
