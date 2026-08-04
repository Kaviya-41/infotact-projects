/**
 * VehicleHealthCard.tsx – Vehicle Systems & Infrastructure Health Card
 */

import React from 'react';
import { Activity, Fuel, BatteryCharging, Wifi, Gauge, Thermometer } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

interface VehicleHealthCardProps {
  vehicleId?: string;
}

const HEALTH_METRICS = [
  { id: 'engine', name: 'Engine State', status: 'Healthy', value: '100%', pct: 100, icon: <Activity size={16} color="#16A34A" /> },
  { id: 'fuel', name: 'Fuel Level', status: 'Optimal', value: '72%', pct: 72, icon: <Fuel size={16} color="#D97706" /> },
  { id: 'battery', name: 'Battery Voltage', status: 'Healthy', value: '88% (24.2V)', pct: 88, icon: <BatteryCharging size={16} color="#16A34A" /> },
  { id: 'gps', name: 'GPS Telemetry', status: 'Connected', value: 'Signal 98%', pct: 98, icon: <Wifi size={16} color="#2563EB" /> },
  { id: 'tires', name: 'Tire Pressure', status: 'Normal', value: '32.4 PSI', pct: 95, icon: <Gauge size={16} color="#16A34A" /> },
  { id: 'temp', name: 'Coolant Temp', status: 'Normal', value: '86 °C', pct: 82, icon: <Thermometer size={16} color="#16A34A" /> },
];

const VehicleHealthCard: React.FC<VehicleHealthCardProps> = ({ vehicleId = 'FLT-024' }) => {
  return (
    <GlassCard title={`Vehicle Health (${vehicleId})`} titleIcon={<Activity size={18} color="#2563EB" />} id="vehicle-health-card">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {HEALTH_METRICS.map((item) => (
          <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#334155' }}>
                {item.icon}
                {item.name}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: item.status === 'Healthy' || item.status === 'Normal' || item.status === 'Connected' || item.status === 'Optimal' ? '#16A34A' : '#D97706' }}>
                  {item.status}
                </span>
                <span style={{ fontWeight: 700, color: '#0F172A' }} className="font-mono">{item.value}</span>
              </div>
            </div>

            <div style={{ height: '5px', backgroundColor: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${item.pct}%`,
                  backgroundColor: item.pct > 70 ? '#16A34A' : item.pct > 30 ? '#D97706' : '#DC2626',
                  borderRadius: '3px',
                  transition: 'width 0.5s ease'
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

export default VehicleHealthCard;
