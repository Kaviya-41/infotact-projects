/**
 * ActiveRouteCard.tsx – Floating Active Delivery Route Overlay Card
 * Position: Top Left floating above the Fleet Map.
 */

import React from 'react';
import { Navigation, Clock, MapPin, User, CornerUpRight } from 'lucide-react';
import type { ActiveRouteData } from '../../types/telemetry';

interface ActiveRouteCardProps {
  data?: ActiveRouteData;
}

const DEFAULT_ROUTE: ActiveRouteData = {
  routeName: 'Delivery Route #14',
  origin: 'Bengaluru Logistics Hub',
  destination: 'Hosur Distribution Center',
  vehicleId: 'FLT-024',
  driverName: 'Arjun Kumar',
  nextTurn: 'Turn right in 450 m onto Hosur Main Rd',
  eta: '28 min',
  totalDistance: '32.4 km',
  steps: [
    { id: 's1', instruction: 'Depart Bengaluru Terminal', distance: '1.2 km', status: 'completed' },
    { id: 's2', instruction: 'Merge onto Electronic City Flyover', distance: '14.8 km', status: 'completed' },
    { id: 's3', instruction: 'Turn right onto Hosur Main Rd', distance: '0.45 km', status: 'active' },
    { id: 's4', instruction: 'Arrive at Hosur Distribution Hub', distance: '15.95 km', status: 'pending' },
  ],
};

const ActiveRouteCard: React.FC<ActiveRouteCardProps> = ({ data = DEFAULT_ROUTE }) => {
  return (
    <div className="active-route-card" id="active-route-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Navigation size={15} />
          </div>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Active Route
            </div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>{data.vehicleId}</div>
          </div>
        </div>

        <span className="status-badge status-badge--moving">
          <span className="status-badge__dot" />
          EN ROUTE
        </span>
      </div>

      {/* Origin -> Destination */}
      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span>{data.origin.split(' ')[0]}</span>
        <span style={{ color: '#2563EB' }}>→</span>
        <span>{data.destination.split(' ')[0]}</span>
      </div>

      {/* Next Turn Direction Box */}
      <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '10px 12px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <CornerUpRight size={18} color="#2563EB" />
        <div>
          <div style={{ fontSize: '10px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Next Maneuver</div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#0F172A' }}>{data.nextTurn}</div>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', paddingTop: '8px', borderTop: '1px solid rgba(15,23,42,0.06)' }}>
        <div>
          <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Clock size={11} /> ETA
          </div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }} className="font-mono">{data.eta}</div>
        </div>

        <div>
          <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '3px' }}>
            <MapPin size={11} /> Distance
          </div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }} className="font-mono">{data.totalDistance}</div>
        </div>

        <div>
          <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '3px' }}>
            <User size={11} /> Driver
          </div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {data.driverName.split(' ')[0]}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveRouteCard;
