/**
 * DashboardCards.tsx
 * Redesigned Enterprise KPI Statistics Section for FleetDash.
 * Premium logistics command center UI/UX with glassmorphism, 3D mouse tilt,
 * animated counters, live status badges, SVG sparkline graphs, and custom gradient glow accents.
 *
 * Preserves all existing FleetStats interfaces and props for 100% backward compatibility.
 */

import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface FleetStats {
  total: number;
  moving: number;
  stopped: number;
  offline: number;
  activeTrips?: number;
  todaysAlerts?: number;
  avgSpeed?: number;
}

export type KPIVariant = 'total' | 'online' | 'offline' | 'trips' | 'alerts' | 'speed';

export interface StatCardData {
  id: string;
  label: string;
  value: number;
  unit?: string;
  variant: KPIVariant;
  subtitle: string;
  trend: string;
  trendDirection: 'up' | 'down' | 'neutral';
  statusText: string;
  lastUpdated: string;
  colorHex: string;
  sparklineData: number[];
}

interface DashboardCardsProps {
  /** Stats object – defaults to FleetDash dummy data */
  stats?: FleetStats;
}

// ── Default Dummy Data ──────────────────────────────────────────────────

const DUMMY_STATS: FleetStats = {
  total: 42,
  moving: 28,
  stopped: 9,
  offline: 5,
  activeTrips: 23,
  todaysAlerts: 14,
  avgSpeed: 72,
};

// ── Sparkline Data per variant ────────────────────────────────────────

const SPARKLINE_DATA: Record<KPIVariant, number[]> = {
  total:   [35, 42, 48, 52, 60, 68, 75, 88],
  online:  [60, 72, 68, 80, 75, 88, 82, 94],
  offline: [30, 25, 35, 20, 18, 22, 15, 12],
  trips:   [40, 50, 45, 62, 58, 70, 78, 85],
  alerts:  [15, 45, 25, 60, 30, 70, 40, 35],
  speed:   [55, 62, 60, 68, 66, 72, 70, 76],
};

// ── Helper to build the 6 required KPI cards ──────────────────────────

function buildKPICards(stats: FleetStats): StatCardData[] {
  const onlineCount = stats.moving; // Moving fleet represents active online vehicles
  const totalCount = stats.total;
  const offlineCount = stats.offline;
  const activeTripsCount = stats.activeTrips ?? 23;
  const todaysAlertsCount = stats.todaysAlerts ?? 14;
  const avgSpeedVal = stats.avgSpeed ?? 72;

  const onlinePct = ((onlineCount / (totalCount || 1)) * 100).toFixed(1);

  return [
    {
      id: 'kpi-total',
      label: 'TOTAL VEHICLES',
      value: totalCount,
      variant: 'total',
      colorHex: '#3B82F6', // Blue
      subtitle: 'Total registered fleet',
      trend: '+12% vs last mo',
      trendDirection: 'up',
      statusText: 'Active System Sync',
      lastUpdated: 'Updated just now',
      sparklineData: SPARKLINE_DATA.total,
    },
    {
      id: 'kpi-online',
      label: 'ONLINE VEHICLES',
      value: onlineCount,
      variant: 'online',
      colorHex: '#10B981', // Green
      subtitle: `${onlinePct}% operational rate`,
      trend: '+8% vs yesterday',
      trendDirection: 'up',
      statusText: 'Live Telemetry Active',
      lastUpdated: 'Real-time sync',
      sparklineData: SPARKLINE_DATA.online,
    },
    {
      id: 'kpi-offline',
      label: 'OFFLINE VEHICLES',
      value: offlineCount,
      variant: 'offline',
      colorHex: '#9CA3AF', // Gray
      subtitle: 'Depot & maintenance',
      trend: '-4% this week',
      trendDirection: 'down',
      statusText: 'Depot Standby',
      lastUpdated: 'Synced 5m ago',
      sparklineData: SPARKLINE_DATA.offline,
    },
    {
      id: 'kpi-trips',
      label: 'ACTIVE TRIPS',
      value: activeTripsCount,
      variant: 'trips',
      colorHex: '#8B5CF6', // Purple
      subtitle: 'En route logistics',
      trend: '+18% vs yesterday',
      trendDirection: 'up',
      statusText: 'In-Transit Active',
      lastUpdated: 'Live route stream',
      sparklineData: SPARKLINE_DATA.trips,
    },
    {
      id: 'kpi-alerts',
      label: "TODAY'S ALERTS",
      value: todaysAlertsCount,
      variant: 'alerts',
      colorHex: '#EF4444', // Orange/Red
      subtitle: '3 critical events',
      trend: '-15% safety events',
      trendDirection: 'down',
      statusText: 'Attention Needed',
      lastUpdated: 'Alert feed active',
      sparklineData: SPARKLINE_DATA.alerts,
    },
    {
      id: 'kpi-speed',
      label: 'AVERAGE SPEED',
      value: avgSpeedVal,
      unit: ' km/h',
      variant: 'speed',
      colorHex: '#06B6D4', // Cyan
      subtitle: 'Optimal eco-velocity',
      trend: '+4.2 km/h avg',
      trendDirection: 'up',
      statusText: 'Cruise Optimal',
      lastUpdated: 'Calculated 1m ago',
      sparklineData: SPARKLINE_DATA.speed,
    },
  ];
}

// ── SVG Sparkline Path Component ───────────────────────────────────────

const SparklinePath: React.FC<{ heights: number[]; color: string; cardId: string }> = memo(({ heights, color, cardId }) => {
  const W = 120, H = 38;
  const step = W / (heights.length - 1);
  const pts = heights.map((h, i) => ({ x: i * step, y: H - (h / 100) * (H - 10) - 5 }));

  let d = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i];
    const p1 = pts[i + 1];
    const cx1 = p0.x + (p1.x - p0.x) / 2;
    const cy1 = p0.y;
    const cx2 = p0.x + (p1.x - p0.x) / 2;
    const cy2 = p1.y;
    d += ` C ${cx1.toFixed(1)},${cy1.toFixed(1)} ${cx2.toFixed(1)},${cy2.toFixed(1)} ${p1.x.toFixed(1)},${p1.y.toFixed(1)}`;
  }
  const areaPath = `${d} L ${W},${H} L 0,${H} Z`;
  const gradId = `kpi-spark-grad-${cardId}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} aria-hidden="true" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <motion.path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.circle
        cx={pts[pts.length - 1].x}
        cy={pts[pts.length - 1].y}
        r="3.5"
        fill={color}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.9, duration: 0.3 }}
      />
    </svg>
  );
});
SparklinePath.displayName = 'SparklinePath';

// ── Animated Counter Hook ──────────────────────────────────────────────

function useAnimatedCounter(target: number, duration = 1000): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    let raf: number;

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return count;
}

// ── KPI Icon Component ──────────────────────────────────────────────────

const KPIIcon: React.FC<{ variant: KPIVariant; color: string }> = memo(({ variant }) => {
  switch (variant) {
    case 'total':
      return (
        <svg className="kpi-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13" rx="2" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      );
    case 'online':
      return (
        <svg className="kpi-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
          <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
          <path d="M4.93 4.93a10 10 0 0 1 14.14 0" />
          <path d="M7.76 7.76a6 6 0 0 1 8.48 0" />
        </svg>
      );
    case 'offline':
      return (
        <svg className="kpi-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 1l22 22" />
          <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
          <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
          <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
          <path d="M1.42 9a15.91 15.91 0 0 1 4.7-3.16" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
        </svg>
      );
    case 'trips':
      return (
        <svg className="kpi-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="3 11 22 2 13 21 11 13 3 11" />
        </svg>
      );
    case 'alerts':
      return (
        <svg className="kpi-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );
    case 'speed':
      return (
        <svg className="kpi-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" />
          <path d="M12 6v6l4 2" />
        </svg>
      );
    default:
      return null;
  }
});
KPIIcon.displayName = 'KPIIcon';

// ── Single KPI Card Component ──────────────────────────────────────────

const StatCard: React.FC<{ data: StatCardData; index: number }> = memo(({ data, index }) => {
  const cardRef = useRef<HTMLElement>(null);
  const animatedValue = useAnimatedCounter(data.value, 1000 + index * 90);

  // Mouse tilt 3D perspective effect
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);

    card.style.transform = `perspective(1000px) translateY(-8px) scale(1.02) rotateX(${-dy * 7}deg) rotateY(${dx * 7}deg)`;
    card.style.setProperty('--mouse-x', `${(e.clientX - rect.left).toFixed(1)}px`);
    card.style.setProperty('--mouse-y', `${(e.clientY - rect.top).toFixed(1)}px`);
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) translateY(0px) rotateX(0deg) rotateY(0deg) scale(1)';
  }, []);

  const isUp = data.trendDirection === 'up';

  return (
    <motion.article
      ref={cardRef}
      id={data.id}
      className={`kpi-card kpi-card--${data.variant}`}
      aria-label={`${data.label}: ${data.value}${data.unit ?? ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 26, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Dynamic Cursor Spotlight & Glass Shimmer Overlay */}
      <div className="kpi-card__spotlight" aria-hidden="true" />
      <div className="kpi-card__shimmer" aria-hidden="true" />

      {/* Top Ambient Glow Orb */}
      <div className="kpi-card__glow-orb" aria-hidden="true" />

      {/* Card Header: Animated Icon & Status Badge */}
      <div className="kpi-card__header">
        <div className="kpi-card__icon-badge" style={{ color: data.colorHex }}>
          <KPIIcon variant={data.variant} color={data.colorHex} />
        </div>
        <div className="kpi-card__status-badge">
          <span className="kpi-status-dot" style={{ backgroundColor: data.colorHex }} />
          <span className="kpi-status-text">{data.statusText}</span>
        </div>
      </div>

      {/* Card Body: Title, Value, Trend Badge, Subtitle */}
      <div className="kpi-card__body">
        <h3 className="kpi-card__title">{data.label}</h3>

        <div className="kpi-card__value-row">
          <span className="kpi-card__value">
            {animatedValue.toLocaleString()}{data.unit ?? ''}
          </span>
          <span className={`kpi-card__trend-badge ${isUp ? 'trend--up' : 'trend--down'}`}>
            <span className="trend-arrow">{isUp ? '↑' : '↓'}</span>
            {data.trend}
          </span>
        </div>

        <p className="kpi-card__subtitle">{data.subtitle}</p>
      </div>

      {/* Sparkline Chart & Footer Timestamp */}
      <div className="kpi-card__footer-area">
        <div className="kpi-card__sparkline-container">
          <SparklinePath heights={data.sparklineData} color={data.colorHex} cardId={data.id} />
        </div>
        <div className="kpi-card__meta-row">
          <span className="kpi-card__timestamp">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {data.lastUpdated}
          </span>
        </div>
      </div>
    </motion.article>
  );
});
StatCard.displayName = 'StatCard';

// ── Main DashboardCards Component ──────────────────────────────────────

const DashboardCards: React.FC<DashboardCardsProps> = ({ stats }) => {
  const resolvedStats: FleetStats = stats ?? DUMMY_STATS;
  const cards = buildKPICards(resolvedStats);

  return (
    <section className="kpi-section" aria-label="Fleet KPI Statistics Command Center">
      <div className="stats-grid">
        {cards.map((card, i) => (
          <StatCard key={card.id} data={card} index={i} />
        ))}
      </div>
    </section>
  );
};

export default DashboardCards;
