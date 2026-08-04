/**
 * Dashboard.tsx – Main Disaster Intelligence Command Center page
 *
 * Layout: Hero banner → KPI cards → Canvas + Telemetry Grid
 * Center: Interactive incident map with floating overlay cards
 * Right: Threat gauge, system health, resource allocation
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, AlertTriangle, Truck } from 'lucide-react';
import { useSocketTelemetry } from '../hooks/useSocketTelemetry';
import IncidentMapCanvas from '../components/canvas/IncidentMapCanvas';
import ThreatGauge from '../components/canvas/ThreatGauge';
import EvacuationCard from '../components/widgets/EvacuationCard';
import AlertBannerStack from '../components/widgets/AlertBanner';
import SystemHealthCard from '../components/widgets/SystemHealthCard';
import ResourceUsageCard from '../components/widgets/ResourceUsageCard';
import Footer from '../components/Footer';

// ── Animation variants ─────────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] as const } },
};

// ── KPI data ───────────────────────────────────────────────────────────────────

const KPI_CARDS = [
  {
    id: 'active-incidents',
    label: 'Active Incidents',
    value: '12',
    trend: '+3',
    trendDir: 'up' as const,
    variant: 'danger',
    icon: <AlertTriangle size={18} />,
  },
  {
    id: 'responders-deployed',
    label: 'Responders Deployed',
    value: '342',
    trend: '+28',
    trendDir: 'up' as const,
    variant: 'primary',
    icon: <Users size={18} />,
  },
  {
    id: 'evacuees-safe',
    label: 'Evacuees Safe',
    value: '1,847',
    trend: '+156',
    trendDir: 'up' as const,
    variant: 'success',
    icon: <Shield size={18} />,
  },
  {
    id: 'vehicles-active',
    label: 'Vehicles Active',
    value: '87',
    trend: '-2',
    trendDir: 'down' as const,
    variant: 'warning',
    icon: <Truck size={18} />,
  },
];

// ── Component ──────────────────────────────────────────────────────────────────

const Dashboard: React.FC = () => {
  const { threat, infrastructure, evacuation, alerts, resources } = useSocketTelemetry(2500);

  return (
    <motion.div
      className="dashboard-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ── Hero Banner ── */}
      <motion.div className="dashboard-hero" id="dashboard-hero-banner" variants={itemVariants}>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="live-dot" />
            DISASTER INTELLIGENCE COMMAND CENTER
          </div>
          <h1 className="hero-title">Emergency Operations Center</h1>
          <p className="hero-subtitle">
            Real-Time Threat Assessment · Infrastructure Monitoring · Evacuation Logistics
          </p>
        </div>
        <div className="hero-metrics-pill">
          <div className="h-metric">
            <span className="h-val green">12</span>
            <span className="h-lbl">Active Incidents</span>
          </div>
          <div className="h-divider" />
          <div className="h-metric">
            <span className="h-val cyan">342</span>
            <span className="h-lbl">Responders Active</span>
          </div>
          <div className="h-divider" />
          <div className="h-metric">
            <span className="h-val purple">99.2%</span>
            <span className="h-lbl">System Uptime</span>
          </div>
        </div>
      </motion.div>

      {/* ── KPI Cards ── */}
      <motion.div className="kpi-grid" variants={itemVariants}>
        {KPI_CARDS.map(kpi => (
          <motion.div
            key={kpi.id}
            className={`kpi-card kpi-card--${kpi.variant}`}
            id={`kpi-${kpi.id}`}
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            <div className="kpi-card__top">
              <div className="kpi-card__icon">
                {kpi.icon}
              </div>
              <span className={`kpi-card__trend kpi-card__trend--${kpi.trendDir}`}>
                {kpi.trendDir === 'up' ? '↑' : '↓'} {kpi.trend}
              </span>
            </div>
            <div className="kpi-card__value">{kpi.value}</div>
            <div className="kpi-card__label">{kpi.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Main Grid: Canvas + Telemetry Panel ── */}
      <motion.div className="dashboard-main-grid" variants={itemVariants}>
        {/* Center: Incident Map with Floating Overlays */}
        <div style={{ position: 'relative' }}>
          <IncidentMapCanvas />

          {/* Floating overlay cards */}
          <div className="canvas-overlay">
            <div className="canvas-overlay__top-left">
              <EvacuationCard data={evacuation} />
            </div>
            <div className="canvas-overlay__top-center">
              <AlertBannerStack alerts={alerts} maxVisible={2} />
            </div>
          </div>
        </div>

        {/* Right: Telemetry Panel */}
        <div className="telemetry-panel">
          <ThreatGauge data={threat} />
          <SystemHealthCard items={infrastructure} />
          <ResourceUsageCard resources={resources} />
        </div>
      </motion.div>

      {/* ── Footer ── */}
      <Footer />
    </motion.div>
  );
};

export default Dashboard;
