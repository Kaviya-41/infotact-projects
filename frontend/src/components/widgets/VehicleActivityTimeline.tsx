/**
 * VehicleActivityTimeline.tsx – Activity Timeline Widget for Fleet Telemetry
 */

import React from 'react';
import { Clock, Play, MapPin, AlertTriangle, CheckCircle2 } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

interface ActivityItem {
  id: string;
  time: string;
  vehicleId: string;
  event: string;
  type: 'start' | 'navigation' | 'warning' | 'completion';
}

const TIMELINE_EVENTS: ActivityItem[] = [
  { id: 'ev-1', time: '11:03', vehicleId: 'FLT-024', event: 'started trip', type: 'start' },
  { id: 'ev-2', time: '11:15', vehicleId: 'FLT-024', event: 'entered Highway NH44', type: 'navigation' },
  { id: 'ev-3', time: '11:42', vehicleId: 'FLT-024', event: 'speed threshold warning (92 km/h)', type: 'warning' },
  { id: 'ev-4', time: '12:05', vehicleId: 'FLT-024', event: 'reached destination (Hosur Terminal)', type: 'completion' },
];

const EVENT_ICONS: Record<string, React.ReactNode> = {
  start: <Play size={14} color="#2563EB" />,
  navigation: <MapPin size={14} color="#0284C7" />,
  warning: <AlertTriangle size={14} color="#D97706" />,
  completion: <CheckCircle2 size={14} color="#16A34A" />,
};

const VehicleActivityTimeline: React.FC = () => {
  return (
    <GlassCard title="Vehicle Activity Timeline" titleIcon={<Clock size={18} color="#2563EB" />} id="vehicle-activity-timeline">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', paddingLeft: '8px' }}>
        {TIMELINE_EVENTS.map((item, idx) => (
          <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', position: 'relative' }}>
            {idx < TIMELINE_EVENTS.length - 1 && (
              <div
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '24px',
                  bottom: '-12px',
                  width: '2px',
                  backgroundColor: '#E2E8F0',
                }}
              />
            )}
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 6px rgba(15,23,42,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
              }}
            >
              {EVENT_ICONS[item.type]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                <span style={{ fontWeight: 700, color: '#2563EB' }} className="font-mono">{item.time}</span>
                <span style={{ fontWeight: 800, color: '#0F172A' }}>{item.vehicleId}</span>
                <span style={{ color: '#475569' }}>{item.event}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

export default VehicleActivityTimeline;
