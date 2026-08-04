/**
 * ThreatGauge.tsx – SVG-based radial threat level gauge
 *
 * Displays a semi-circular arc gauge with dynamic value,
 * severity-based coloring, and ambient glow effect.
 * Replaces the automotive speedometer concept.
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { ThreatLevel } from '../../types/telemetry';
import GlassCard from '../ui/GlassCard';

interface ThreatGaugeProps {
  data: ThreatLevel;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const SIZE = 240;
const STROKE_WIDTH = 14;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CENTER = SIZE / 2;
const START_ANGLE = 135;  // degrees
const END_ANGLE = 405;    // degrees (270° arc)
const ARC_RANGE = END_ANGLE - START_ANGLE;

// Convert degrees to radians
const degToRad = (d: number) => (d * Math.PI) / 180;

// SVG arc path helper
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

const getSeverityColor = (value: number): string => {
  if (value >= 80) return '#EF4444';
  if (value >= 60) return '#F59E0B';
  if (value >= 40) return '#FF8A00';
  if (value >= 20) return '#3B82F6';
  return '#10B981';
};

// ── Component ──────────────────────────────────────────────────────────────────

const ThreatGauge: React.FC<ThreatGaugeProps> = ({ data }) => {
  const color = useMemo(() => getSeverityColor(data.value), [data.value]);
  const valueDeg = START_ANGLE + (data.value / 100) * ARC_RANGE;

  // Background arc (full)
  const bgArc = describeArc(CENTER, CENTER, RADIUS, START_ANGLE, END_ANGLE);
  // Value arc
  const valueArc = describeArc(CENTER, CENTER, RADIUS, START_ANGLE, Math.min(valueDeg, END_ANGLE));

  // Tick marks
  const ticks = useMemo(() => {
    const result = [];
    for (let i = 0; i <= 10; i++) {
      const angle = degToRad(START_ANGLE + (i / 10) * ARC_RANGE);
      const isMajor = i % 2 === 0;
      const innerR = RADIUS - (isMajor ? 12 : 8);
      const outerR = RADIUS + 2;
      result.push({
        x1: CENTER + innerR * Math.cos(angle),
        y1: CENTER + innerR * Math.sin(angle),
        x2: CENTER + outerR * Math.cos(angle),
        y2: CENTER + outerR * Math.sin(angle),
        isMajor,
        label: i * 10,
        lx: CENTER + (innerR - 14) * Math.cos(angle),
        ly: CENTER + (innerR - 14) * Math.sin(angle),
      });
    }
    return result;
  }, []);

  return (
    <GlassCard title="Threat Level" titleIcon="🎯" id="threat-gauge-card">
      <div className="threat-gauge">
        <div className="threat-gauge__svg-wrap">
          <svg viewBox={`0 0 ${SIZE} ${SIZE * 0.72}`} width="100%" aria-hidden="true">
            <defs>
              <filter id="gauge-glow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="40%" stopColor="#FF8A00" />
                <stop offset="70%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#EF4444" />
              </linearGradient>
            </defs>

            {/* Background arc */}
            <path
              d={bgArc}
              fill="none"
              stroke="rgba(0,0,0,0.06)"
              strokeWidth={STROKE_WIDTH}
              strokeLinecap="round"
            />

            {/* Tick marks */}
            {ticks.map((t, i) => (
              <line
                key={i}
                x1={t.x1} y1={t.y1}
                x2={t.x2} y2={t.y2}
                stroke={t.isMajor ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0.06)'}
                strokeWidth={t.isMajor ? 1.5 : 1}
              />
            ))}

            {/* Value arc with glow */}
            <motion.path
              d={valueArc}
              fill="none"
              stroke={color}
              strokeWidth={STROKE_WIDTH}
              strokeLinecap="round"
              filter="url(#gauge-glow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </svg>

          {/* Center value display */}
          <div className="threat-gauge__value">
            <motion.span
              className="threat-gauge__number"
              key={data.value}
              initial={{ scale: 1.1, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{ color }}
            >
              {data.value}
            </motion.span>
            <span className="threat-gauge__unit">Impact Scale</span>
          </div>
        </div>

        <span className="threat-gauge__label" style={{ color }}>
          {data.label}
        </span>

        {/* Stats row */}
        <div className="threat-gauge__stats">
          <div className="threat-gauge__stat">
            <span className="threat-gauge__stat-value">{data.windSpeed}</span>
            <span className="threat-gauge__stat-label">km/h Wind</span>
          </div>
          <div className="threat-gauge__stat">
            <span className="threat-gauge__stat-value">{data.impactForce}</span>
            <span className="threat-gauge__stat-label">kN Force</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default ThreatGauge;
