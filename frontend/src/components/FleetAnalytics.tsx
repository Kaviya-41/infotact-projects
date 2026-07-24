/**
 * FleetAnalytics.tsx
 * Premium Enterprise Analytics Dashboard
 * 
 * Data logic remains identical. UI completely upgraded to Enterprise Glassmorphism.
 */

import React, { memo, useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { PremiumSkeleton, PremiumEmptyState } from './StateFeedback';
import './FleetAnalytics.css';

// ── Dummy Data (Unchanged) ─────────────────────────────────────────────────────
const SPEED_TREND = [62, 58, 71, 67, 75, 69, 82, 77, 85, 72, 68, 74];
const SPEED_LABELS = ['11PM', '12AM', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10AM'];

const TRIP_DATA = [
  { day: 'Mon', count: 38 },
  { day: 'Tue', count: 52 },
  { day: 'Wed', count: 45 },
  { day: 'Thu', count: 61 },
  { day: 'Fri', count: 55 },
  { day: 'Sat', count: 29 },
  { day: 'Sun', count: 18 },
];

const VEHICLE_DIST = [
  { type: 'Trucks',     count: 18, color: '#4F8CFF' },
  { type: 'Vans',       count: 10, color: '#00D4FF' },
  { type: 'Trailers',   count:  8, color: '#31D67B' },
  { type: 'Mini Trucks', count:  6, color: '#FFB547' },
];

const ALERT_DATA = [
  { label: 'Critical', count: 2,  color: '#FF5C5C' },
  { label: 'Warning',  count: 5,  color: '#FFB547' },
  { label: 'Info',     count: 8,  color: '#4F8CFF' },
];

// ── Animation Variants ─────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cardVariants: Record<string, any> = {
  hidden:  { opacity: 0, y: 24, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: 'easeOut' } },
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const staggerContainer: Record<string, any> = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.10 } },
};

// ── Animated Number ────────────────────────────────────────────────────────────
const AnimatedNumber: React.FC<{ value: number; suffix?: string }> = memo(({ value, suffix = '' }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const motionVal = useMotionValue(0);
  const springVal = useSpring(motionVal, { stiffness: 90, damping: 18 });
  const isInView   = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) motionVal.set(value);
  }, [isInView, value, motionVal]);

  useEffect(() => {
    return springVal.on('change', (v) => {
      if (ref.current) ref.current.textContent = Math.round(v) + suffix;
    });
  }, [springVal, suffix]);

  return <span ref={ref}>0{suffix}</span>;
});
AnimatedNumber.displayName = 'AnimatedNumber';

// ── SVG Area Chart — Speed Trend ───────────────────────────────────────────────
const SpeedTrendChart: React.FC = memo(() => {
  const W = 500, H = 200, PAD = 20;
  const max = Math.max(...SPEED_TREND) + 10;
  const min = Math.min(...SPEED_TREND) - 10;
  const stepX = (W - PAD * 2) / (SPEED_TREND.length - 1);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const pts = SPEED_TREND.map((v, i) => ({
    x: PAD + i * stepX,
    y: PAD + ((max - v) / (max - min)) * (H - PAD * 2),
    val: v,
    label: SPEED_LABELS[i]
  }));

  const linePath  = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath  = `${linePath} L ${pts[pts.length - 1].x} ${H - PAD} L ${pts[0].x} ${H - PAD} Z`;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="fa-svg-chart" preserveAspectRatio="none">
        <defs>
          <linearGradient id="speedFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#4F8CFF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#4F8CFF" stopOpacity="0.0" />
          </linearGradient>
          <filter id="glowBlue">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Grid */}
        {[0.25, 0.5, 0.75].map((f, i) => (
          <line key={i} x1={PAD} y1={PAD + f * (H - PAD * 2)} x2={W - PAD} y2={PAD + f * (H - PAD * 2)}
            stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />
        ))}

        {/* Area */}
        <motion.path d={areaPath} fill="url(#speedFill)"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }} />
        
        {/* Line */}
        <motion.path d={linePath} fill="none" stroke="#4F8CFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
          filter="url(#glowBlue)" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }} />

        {/* Interactive Points */}
        {pts.map((p, i) => (
          <g key={i} onMouseEnter={() => setHoverIdx(i)} onMouseLeave={() => setHoverIdx(null)}>
            {hoverIdx === i && (
              <line x1={p.x} y1={PAD} x2={p.x} y2={H - PAD} stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4" />
            )}
            <motion.circle cx={p.x} cy={p.y} r={hoverIdx === i ? 6 : 4}
              fill="#081120" stroke={hoverIdx === i ? "#00D4FF" : "#4F8CFF"} strokeWidth="2"
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: 0.2 + i * 0.05, type: 'spring' }} style={{ cursor: 'crosshair' }} />
            
            {/* Invisible larger hover target */}
            <circle cx={p.x} cy={p.y} r={16} fill="transparent" />
          </g>
        ))}

        {/* X-axis */}
        {SPEED_LABELS.map((lbl, i) => i % 2 === 0 && (
          <text key={i} x={PAD + i * stepX} y={H - 2} textAnchor="middle" fill="rgba(141,162,192,0.6)" fontSize="10">{lbl}</text>
        ))}
      </svg>
      
      {/* HTML Tooltip */}
      <AnimatePresence>
        {hoverIdx !== null && (
          <motion.div className="fa-tooltip"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
            style={{ left: `${((PAD + hoverIdx * stepX) / W) * 100}%`, top: `${(pts[hoverIdx].y / H) * 100}%` }}>
            <span className="fa-tooltip-label">{pts[hoverIdx].label}</span>
            <span className="fa-tooltip-value">{pts[hoverIdx].val} km/h</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
SpeedTrendChart.displayName = 'SpeedTrendChart';

// ── SVG Donut — Fleet Utilization ──────────────────────────────────────────────
const FleetUtilizationDonut: React.FC = memo(() => {
  const utilized = 84; 
  const R = 70, CX = 100, CY = 100, SW = 16;
  const circ = 2 * Math.PI * R;
  const dashFill = (circ * utilized) / 100;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg viewBox="0 0 200 200" style={{ width: '100%', maxHeight: '200px' }}>
        <defs>
          <linearGradient id="utilGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#31D67B" />
            <stop offset="100%" stopColor="#00D4FF" />
          </linearGradient>
          <filter id="glowGreen">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={SW} />
        <motion.circle cx={CX} cy={CY} r={R} fill="none" stroke="url(#utilGrad)" strokeWidth={SW}
          strokeLinecap="round" strokeDasharray={`${circ}`} filter="url(#glowGreen)"
          initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: circ - dashFill }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
          style={{ transformOrigin: `${CX}px ${CY}px`, transform: 'rotate(-90deg)' }} />
        <text x={CX} y={CY - 5} textAnchor="middle" fill="#FFFFFF" fontSize="32" fontWeight="800" fontFamily="Space Grotesk">{utilized}%</text>
        <text x={CX} y={CY + 18} textAnchor="middle" fill="rgba(141,162,192,0.7)" fontSize="12" fontWeight="600" letterSpacing="1">ACTIVE</text>
      </svg>
    </div>
  );
});
FleetUtilizationDonut.displayName = 'FleetUtilizationDonut';

// ── SVG Bar Chart — Trip Statistics ───────────────────────────────────────────
const TripBarChart: React.FC = memo(() => {
  const W = 300, H = 160, PAD = 20;
  const maxCount = Math.max(...TRIP_DATA.map(d => d.count));
  const barW = (W - PAD * 2) / TRIP_DATA.length - 10;
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="fa-svg-chart" preserveAspectRatio="none">
        <defs>
          <linearGradient id="barGradHover" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00D4FF" />
            <stop offset="100%" stopColor="#4F8CFF" />
          </linearGradient>
        </defs>
        
        {TRIP_DATA.map((d, i) => {
          const barH = ((d.count / maxCount) * (H - PAD * 2 - 20));
          const x    = PAD + i * ((W - PAD * 2) / TRIP_DATA.length) + 5;
          const y    = H - PAD - 20 - barH;
          const isHovered = hoverIdx === i;

          return (
            <g key={d.day} onMouseEnter={() => setHoverIdx(i)} onMouseLeave={() => setHoverIdx(null)}>
              <motion.rect x={x} y={y} width={barW} rx={6}
                fill={isHovered ? 'url(#barGradHover)' : (d.day === 'Thu' ? '#4F8CFF' : 'rgba(79,140,255,0.2)')}
                initial={{ height: 0, y: H - PAD - 20 }}
                animate={{ height: isHovered ? barH + 4 : barH, y: isHovered ? y - 4 : y }}
                transition={{ duration: 0.3 }}
                style={{ cursor: 'pointer' }} />
              <text x={x + barW / 2} y={H - 5} textAnchor="middle" fill={isHovered ? '#fff' : "rgba(141,162,192,0.6)"} fontSize="10">{d.day}</text>
              <rect x={x} y={PAD} width={barW} height={H - PAD*2} fill="transparent" />
            </g>
          );
        })}
      </svg>
      {/* HTML Tooltip */}
      <AnimatePresence>
        {hoverIdx !== null && (
          <motion.div className="fa-tooltip"
            initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ 
              left: `${((PAD + hoverIdx * ((W - PAD * 2) / TRIP_DATA.length) + 5 + barW/2) / W) * 100}%`, 
              top: `${((H - PAD - 20 - ((TRIP_DATA[hoverIdx].count / maxCount) * (H - PAD * 2 - 20))) / H) * 100}%` 
            }}>
            <span className="fa-tooltip-value">{TRIP_DATA[hoverIdx].count} Trips</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
TripBarChart.displayName = 'TripBarChart';

// ── Vehicle Distribution — Horizontal Bars ────────────────────────────────────
const VehicleDistChart: React.FC = memo(() => {
  const total = VEHICLE_DIST.reduce((s, v) => s + v.count, 0);

  return (
    <div className="fa-vdist-list">
      {VEHICLE_DIST.map((v, i) => (
        <div key={v.type} className="fa-vdist-item">
          <span className="fa-vdist-label">{v.type}</span>
          <div className="fa-vdist-track">
            <motion.div className="fa-vdist-fill"
              style={{ background: v.color, boxShadow: `0 0 10px ${v.color}66` }}
              initial={{ width: 0 }} animate={{ width: `${(v.count / total) * 100}%` }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.9, ease: 'easeOut' }} />
          </div>
          <span className="fa-vdist-count"><AnimatedNumber value={v.count} /></span>
        </div>
      ))}
    </div>
  );
});
VehicleDistChart.displayName = 'VehicleDistChart';

// ── Alerts Overview — Vertical bars ───────────────────────────────────────────
const AlertsOverviewChart: React.FC = memo(() => {
  const W = 200, H = 140, PAD = 10;
  const maxCount = Math.max(...ALERT_DATA.map(d => d.count));
  const barW = (W - PAD * 2) / ALERT_DATA.length - 20;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="fa-svg-chart">
      {ALERT_DATA.map((d, i) => {
        const barH = ((d.count / maxCount) * (H - PAD * 2 - 24));
        const x    = PAD + i * ((W - PAD * 2) / ALERT_DATA.length) + 10;
        const y    = H - PAD - 24 - barH;

        return (
          <g key={d.label}>
            <motion.rect x={x} y={y} width={barW} rx={6} fill={d.color} opacity={0.8}
              initial={{ height: 0, y: H - PAD - 24 }} animate={{ height: barH, y }}
              transition={{ delay: 0.2 + i * 0.12, duration: 0.8 }} />
            <text x={x + barW / 2} y={H - 5} textAnchor="middle" fill="rgba(141,162,192,0.8)" fontSize="10">{d.label}</text>
            <text x={x + barW / 2} y={y - 6} textAnchor="middle" fill={d.color} fontSize="14" fontWeight="700">{d.count}</text>
          </g>
        );
      })}
    </svg>
  );
});
AlertsOverviewChart.displayName = 'AlertsOverviewChart';

// ── KPI Cards configuration ──────────────────────────────────────────────────
const KPIs = [
  { id: 'distance', label: 'Distance Today', val: 3420, unit: 'km', color: '#4F8CFF', icon: '📏', trend: '▲ +14% vs avg', tClass: 'positive' },
  { id: 'fuel',     label: 'Fuel Usage',     val: 485,  unit: 'L',  color: '#34D399', icon: '⛽', trend: '▼ -5% eco-rate',  tClass: 'positive' },
  { id: 'speed',    label: 'Average Speed',  val: 64,   unit: 'km/h',color: '#A78BFA', icon: '⚡', trend: 'Optimal Zone',    tClass: 'neutral' },
  { id: 'trips',    label: 'Trips Done',     val: 42,   unit: '',   color: '#00D4FF', icon: '🗺', trend: '100% on schedule',tClass: 'positive' },
  { id: 'idle',     label: 'Idle Time',      val: 1.8,  unit: 'hrs',color: '#FFB547', icon: '⏱', trend: '▼ -0.4 hr',       tClass: 'positive' },
  { id: 'util',     label: 'Utilization',    val: 84,   unit: '%',  color: '#31D67B', icon: '🎯', trend: '35 of 42 active', tClass: 'positive' },
];

// ── Main Component ─────────────────────────────────────────────────────────────
const FleetAnalytics: React.FC = memo(() => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [loading, setLoading] = useState(true);

  // Simulate network fetch for the premium loading effect
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div className="fleet-analytics-wrapper">
        <div style={{ height: '60px', position: 'relative' }}><PremiumSkeleton height="100%" borderRadius="12px" /></div>
        <div className="fa-kpi-strip">
          {[1,2,3,4,5,6].map(i => <div key={i} style={{ height: '100px', position: 'relative' }}><PremiumSkeleton height="100%" borderRadius="20px" /></div>)}
        </div>
        <div className="fa-charts-grid">
          <div className="fa-card-wide" style={{ height: '340px', position: 'relative' }}><PremiumSkeleton height="100%" borderRadius="24px" /></div>
          <div style={{ height: '340px', position: 'relative' }}><PremiumSkeleton height="100%" borderRadius="24px" /></div>
          <div style={{ height: '340px', position: 'relative' }}><PremiumSkeleton height="100%" borderRadius="24px" /></div>
        </div>
      </div>
    );
  }

  // Determine empty state based on dummy data length
  if (!SPEED_TREND || SPEED_TREND.length === 0) {
    return (
      <div className="fleet-analytics-wrapper" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="ds-card" style={{ maxWidth: '400px' }}>
          <PremiumEmptyState 
            title="No Analytics Data" 
            description="Telemetry data from your fleet is currently processing. Check back soon." 
            icon="🛰" 
          />
        </div>
      </div>
    );
  }

  return (
    <motion.section ref={ref} aria-label="Fleet analytics" className="fleet-analytics-wrapper"
      variants={staggerContainer} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
      
      {/* Header */}
      <div className="fa-header">
        <div className="fa-title-group">
          <h2 className="fa-title">
            <span className="fa-title-icon">📊</span>
            Enterprise Analytics Command
          </h2>
          <p className="fa-subtitle">Real-time performance metrics & operational telemetry</p>
        </div>
        <div className="fa-live-badge">
          <div className="fa-live-dot" />
          LIVE · Last 24 Hrs
        </div>
      </div>

      {/* KPIs */}
      <div className="fa-kpi-strip">
        {KPIs.map(kpi => (
          <div key={kpi.id} className="fa-kpi-card">
            <div className="fa-kpi-icon" style={{ background: `${kpi.color}20`, color: kpi.color, border: `1px solid ${kpi.color}40`, boxShadow: `0 0 16px ${kpi.color}20` }}>
              {kpi.icon}
            </div>
            <div className="fa-kpi-body">
              <span className="fa-kpi-label">{kpi.label}</span>
              <span className="fa-kpi-val"><AnimatedNumber value={kpi.val} suffix={kpi.unit ? ` ${kpi.unit}` : ''} /></span>
              <span className={`fa-kpi-trend ${kpi.tClass}`}>{kpi.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="fa-charts-grid">
        
        {/* Speed Trend */}
        <motion.div className="fa-chart-card fa-card-wide" variants={cardVariants}>
          <div className="fa-chart-header">
            <div className="fa-chart-title">
              <div className="fa-chart-icon" style={{ background: '#4F8CFF20', color: '#4F8CFF' }}>⚡</div>
              Fleet Speed Trend
            </div>
            <div className="fa-chart-actions">
              <div className="fa-chart-meta">Avg: 72 km/h</div>
              <div className="fa-chart-meta">Peak: 89 km/h</div>
            </div>
          </div>
          <div className="fa-chart-content"><SpeedTrendChart /></div>
        </motion.div>

        {/* Utilization */}
        <motion.div className="fa-chart-card" variants={cardVariants}>
          <div className="fa-chart-header">
            <div className="fa-chart-title">
              <div className="fa-chart-icon" style={{ background: '#31D67B20', color: '#31D67B' }}>🎯</div>
              Utilization Rate
            </div>
          </div>
          <div className="fa-chart-content"><FleetUtilizationDonut /></div>
        </motion.div>

        {/* Trips */}
        <motion.div className="fa-chart-card" variants={cardVariants}>
          <div className="fa-chart-header">
            <div className="fa-chart-title">
              <div className="fa-chart-icon" style={{ background: '#00D4FF20', color: '#00D4FF' }}>🗺</div>
              Trip Velocity
            </div>
            <div className="fa-chart-meta" style={{ color: '#31D67B' }}>↑ 12% vs LW</div>
          </div>
          <div className="fa-chart-content"><TripBarChart /></div>
        </motion.div>

        {/* Vehicle Dist */}
        <motion.div className="fa-chart-card" variants={cardVariants}>
          <div className="fa-chart-header">
            <div className="fa-chart-title">
              <div className="fa-chart-icon" style={{ background: '#FFB54720', color: '#FFB547' }}>🚛</div>
              Fleet Composition
            </div>
          </div>
          <div className="fa-chart-content" style={{ alignItems: 'flex-start' }}><VehicleDistChart /></div>
        </motion.div>

        {/* Alerts */}
        <motion.div className="fa-chart-card" variants={cardVariants}>
          <div className="fa-chart-header">
            <div className="fa-chart-title">
              <div className="fa-chart-icon" style={{ background: '#FF5C5C20', color: '#FF5C5C' }}>🚨</div>
              Active Alerts
            </div>
            <div className="fa-chart-meta" style={{ color: '#FF5C5C' }}>15 Total</div>
          </div>
          <div className="fa-chart-content"><AlertsOverviewChart /></div>
        </motion.div>

      </div>
    </motion.section>
  );
});
FleetAnalytics.displayName = 'FleetAnalytics';
export default FleetAnalytics;
