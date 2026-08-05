/**
 * ActiveRouteCard.tsx – Floating Active Delivery Route Overlay Card (DispatchOverlayCard)
 * Position: Top Left floating above the Fleet Map.
 */

import React from 'react';
import { CornerUpRight, ArrowRight } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import type { ActiveRouteData } from '../../types/telemetry';


export interface ActiveRouteCardProps {
  data?: ActiveRouteData;
  className?: string;
}

const DEFAULT_ROUTE: ActiveRouteData = {
  routeName: 'Active Dispatch Route',
  origin: 'Hub 104',
  destination: 'Zone B',
  vehicleId: 'FLT-024',
  driverName: 'Arjun Kumar',
  nextTurn: '600m Turn Right',
  eta: '14 mins',
  totalDistance: '32.4 km',
  steps: [
    { id: 's1', instruction: 'Depart Hub 104', distance: '1.2 km', status: 'completed' },
    { id: 's2', instruction: 'Merge onto Expressway', distance: '14.8 km', status: 'completed' },
    { id: 's3', instruction: 'Turn right in 600m onto Zone B Access', distance: '0.6 km', status: 'active' },
    { id: 's4', instruction: 'Arrive at Zone B', distance: '15.95 km', status: 'pending' },
  ],
};

export const ActiveRouteCard: React.FC<ActiveRouteCardProps> = ({ data = DEFAULT_ROUTE, className = '' }) => {
  return (
    <GlassCard className={`w-80 active-route-card ${className}`} id="active-route-card">
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CornerUpRight size={16} />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Active Dispatch Route</p>
            <p className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
              <span>{data.origin}</span>
              <ArrowRight size={14} className="text-[#FF8A00]" />
              <span>{data.destination}</span>
            </p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Optimal
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
        <div>
          <p className="text-[10px] text-gray-500">Target ETA</p>
          <p className="font-mono text-sm text-white font-semibold">{data.eta}</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-gray-500">Next Maneuver</p>
          <p className="text-xs text-gray-200 font-semibold">{data.nextTurn}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-500">Active Trucks</p>
          <p className="font-mono text-sm text-[#FF8A00] font-semibold">1,240 Units</p>
        </div>
      </div>
    </GlassCard>
  );
};

export const DispatchOverlayCard = ActiveRouteCard;

export default ActiveRouteCard;

