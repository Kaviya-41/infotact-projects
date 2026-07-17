/**
 * FleetStatusCard.tsx
 * Fleet status breakdown with a donut chart (SVG) and progress bars.
 * Week 1 – Static dummy data only.
 * Ready for live stats injection via props / Socket.io in Week 3.
 */

import React from 'react';
import { type FleetStats } from './DashboardCards';

// ── Types ──────────────────────────────────────────────────────────────────────

interface FleetStatusCardProps {
  /** Fleet stats – defaults to dummy data (Week 1) */
  stats?: FleetStats;
}

interface StatusSegment {
  label: string;
  value: number;
  color: string;
  bgClass: string;
  barClass: string;
}

// ── Dummy Data (Week 1) ────────────────────────────────────────────────────────

const DUMMY_STATS: FleetStats = {
  total:   42,
  moving:  28,
  stopped:  9,
  offline:  5,
};

// ── Donut Chart (pure SVG) ─────────────────────────────────────────────────────

interface DonutChartProps {
  segments: Array<{ value: number; color: string; label: string }>;
  total: number;
}

const DonutChart: React.FC<DonutChartProps> = ({ segments, total }) => {
  const radius = 54;
  const cx = 70;
  const cy = 70;
  const size = 140;

  let cumulativePercent = 0;

  const paths = segments.map((seg, i) => {
    const percent = seg.value / total;
    const startDeg = cumulativePercent * 360 - 90; // start from top
    cumulativePercent += percent;
    const endDeg = cumulativePercent * 360 - 90;

    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const x1 = cx + radius * Math.cos(toRad(startDeg));
    const y1 = cy + radius * Math.sin(toRad(startDeg));
    const x2 = cx + radius * Math.cos(toRad(endDeg));
    const y2 = cy + radius * Math.sin(toRad(endDeg));
    const largeArc = percent > 0.5 ? 1 : 0;

    return (
      <path
        key={i}
        d={`M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`}
        fill={seg.color}
        opacity={0.85}
        aria-label={`${seg.label}: ${seg.value}`}
      />
    );
  });

  // Idle vehicles = total - moving - stopped - offline
  const idle = total - segments.reduce((a, s) => a + s.value, 0);

  return (
    <div className="donut-chart-wrap" aria-label="Fleet status donut chart" role="img">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        aria-hidden="true"
      >
        {/* Background ring */}
        <circle cx={cx} cy={cy} r={radius} fill="var(--color-bg-card-hover)" />
        {/* Segments */}
        {paths}
        {/* Centre hole */}
        <circle cx={cx} cy={cy} r={38} fill="var(--color-bg-card)" />
        {/* Centre label */}
        <text x={cx} y={cy - 6} textAnchor="middle" fill="var(--color-text-primary)" fontSize="20" fontWeight="800">
          {total}
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill="var(--color-text-muted)" fontSize="9" fontWeight="600" letterSpacing="0.5">
          TOTAL
        </text>
      </svg>
      {idle > 0 && (
        <span className="donut-idle-label">+{idle} idle</span>
      )}
    </div>
  );
};

// ── Progress Bar ───────────────────────────────────────────────────────────────

const ProgressBar: React.FC<{ segment: StatusSegment; total: number }> = ({ segment, total }) => {
  const pct = Math.round((segment.value / total) * 100);
  return (
    <div className="fleet-status-row">
      <div className="fleet-status-row__label">
        <span className={`fleet-status-dot fleet-status-dot--${segment.barClass}`} aria-hidden="true" />
        <span className="fleet-status-row__name">{segment.label}</span>
        <span className="fleet-status-row__count">{segment.value}</span>
      </div>
      <div className="fleet-status-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${segment.label}: ${pct}%`}>
        <div
          className={`fleet-status-bar__fill fleet-status-bar--${segment.barClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="fleet-status-row__pct">{pct}%</span>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────

const FleetStatusCard: React.FC<FleetStatusCardProps> = ({ stats }) => {
  const resolved = stats ?? DUMMY_STATS;

  const segments: StatusSegment[] = [
    {
      label:    'Moving',
      value:    resolved.moving,
      color:    '#22c55e',
      bgClass:  'moving',
      barClass: 'moving',
    },
    {
      label:    'Stopped',
      value:    resolved.stopped,
      color:    '#f59e0b',
      bgClass:  'stopped',
      barClass: 'stopped',
    },
    {
      label:    'Offline',
      value:    resolved.offline,
      color:    '#ef4444',
      bgClass:  'offline',
      barClass: 'offline',
    },
  ];

  const donutSegments = segments.map((s) => ({
    value: s.value,
    color: s.color,
    label: s.label,
  }));

  return (
    <section aria-label="Fleet status breakdown" className="fleet-status-card">
      {/* Card Header */}
      <div className="fleet-status-card__header">
        <div className="fleet-status-card__title">
          <span aria-hidden="true">📊</span>
          Fleet Status
        </div>
        <span className="fleet-status-card__subtitle">Live breakdown</span>
      </div>

      {/* Content */}
      <div className="fleet-status-card__body">
        {/* Donut Chart */}
        <DonutChart segments={donutSegments} total={resolved.total} />

        {/* Progress Bars */}
        <div className="fleet-status-bars">
          {segments.map((seg) => (
            <ProgressBar key={seg.label} segment={seg} total={resolved.total} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FleetStatusCard;
