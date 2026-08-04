/**
 * VehicleGauge.tsx – Radial Automotive Speed & Performance Gauge
 * SVG Radial speedometer replacing ThreatGauge from earlier spec.
 */

import React from 'react';
import GlassCard from '../ui/GlassCard';
import type { VehicleSpeed } from '../../types/telemetry';

interface VehicleGaugeProps {
  data?: VehicleSpeed;
}

const DEFAULT_SPEED: VehicleSpeed = {
  value: 68,
  rpm: 2100,
  fuelEfficiency: 12.4,
  tripDistance: 142,
  updated: '2 sec ago',
};

const SIZE = 220;
const STROKE = 14;
const RADIUS = (SIZE - STROKE) / 2;
const CENTER = SIZE / 2;
const START_ANGLE = 135;
const END_ANGLE = 405;
const ARC_RANGE = END_ANGLE - START_ANGLE;

const degToRad = (d: number) => (d * Math.PI) / 180;

const describeArc = (cx: number, cy: number, r: number, startDeg: number, endDeg: number): string => {
  const startRad = degToRad(startDeg);
  const endRad = degToRad(endDeg);
  const x1 = cx + r * Math.cos(startRad);
  const y1 = cy + r * Math.sin(startRad);
  const x2 = cx + r * Math.cos(endRad);
  const y2 = cy + r * Math.sin(endRad);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
};

const VehicleGauge: React.FC<VehicleGaugeProps> = ({ data = DEFAULT_SPEED }) => {
  const valueDeg = START_ANGLE + (Math.min(data.value, 140) / 140) * ARC_RANGE;

  const bgArc = describeArc(CENTER, CENTER, RADIUS, START_ANGLE, END_ANGLE);
  const valueArc = describeArc(CENTER, CENTER, RADIUS, START_ANGLE, Math.min(valueDeg, END_ANGLE));

  return (
    <GlassCard title="Vehicle Speed & Performance" titleIcon="⚡" id="vehicle-speed-gauge">
      <div className="speed-gauge-card">
        <div style={{ position: 'relative', width: '200px', margin: '0 auto' }}>
          <svg viewBox={`0 0 ${SIZE} ${SIZE * 0.72}`} width="100%">
            <defs>
              <linearGradient id="speedGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="70%" stopColor="#1D4ED8" />
                <stop offset="100%" stopColor="#DC2626" />
              </linearGradient>
            </defs>

            {/* Background Arc */}
            <path
              d={bgArc}
              fill="none"
              stroke="rgba(15, 23, 42, 0.08)"
              strokeWidth={STROKE}
              strokeLinecap="round"
            />

            {/* Value Arc */}
            <path
              d={valueArc}
              fill="none"
              stroke="url(#speedGrad)"
              strokeWidth={STROKE}
              strokeLinecap="round"
            />
          </svg>

          {/* Center Speed Readout */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '10px' }}>
            <div className="speed-gauge__val">{data.value}</div>
            <div className="speed-gauge__unit">km / h</div>
          </div>
        </div>

        {/* Secondary Telemetry Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
          <div>
            <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>Engine RPM</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }} className="font-mono">{data.rpm}</div>
          </div>

          <div>
            <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>Efficiency</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#16A34A', marginTop: '2px' }} className="font-mono">{data.fuelEfficiency} km/L</div>
          </div>

          <div>
            <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>Trip Dist</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }} className="font-mono">{data.tripDistance} km</div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default VehicleGauge;
