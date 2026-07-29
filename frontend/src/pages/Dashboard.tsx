/**
 * Dashboard.tsx – Main dashboard page
 * Assembles DashboardCards, MapPlaceholder, VehicleList,
 * RecentAlerts, FleetStatusCard, FleetAnalytics, and Footer.
 * Week 1 – All static dummy data.
 *
 * Future integration points (Weeks 2–4):
 *  - Connect FleetSocketContext to receive live telemetry
 *  - Pass live stats → DashboardCards + FleetStatusCard
 *  - Pass live vehicles → VehicleList
 *  - Pass live alerts → RecentAlerts
 *  - Canvas renderer will mount inside MapPlaceholder's #fleet-map-canvas
 */

import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import DashboardCards from '../components/DashboardCards';
import MapPlaceholder from '../components/MapPlaceholder';
import VehicleList from '../components/VehicleList';
import { useVehicles } from '../hooks/useVehicles';
import RecentAlerts from '../components/RecentAlerts';
import FleetStatusCard from '../components/FleetStatusCard';
import Footer from '../components/Footer';

import RightSidebar from '../components/RightSidebar';

// ── Lazy load analytics (heavy charts) ────────────────────────────────────────
const FleetAnalytics = lazy(() => import('../components/FleetAnalytics'));

// ── Skeleton fallback ─────────────────────────────────────────────────────────
const AnalyticsSkeleton: React.FC = () => (
  <div className="analytics-section" aria-busy="true" aria-label="Loading analytics">
    <div className="skeleton-header">
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-badge" />
    </div>
    <div className="analytics-grid">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className={`analytics-card${i === 0 ? ' analytics-card--wide' : ''} skeleton-card`}>
          <div className="skeleton skeleton-card-title" />
          <div className="skeleton skeleton-chart" />
        </div>
      ))}
    </div>
  </div>
);

// ── Page transition variants ───────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pageVariants: Record<string, any> = {
  initial: { opacity: 0 },
  enter:   { opacity: 1, transition: { duration: 0.45 } },
};

// ── Section label helper ───────────────────────────────────────────────────────

const SectionLabel: React.FC<{ icon: string; title: string; subtitle?: string }> = ({ icon, title, subtitle }) => (
  <div className="dashboard-section-label">
    <span className="section-label-icon" aria-hidden="true">{icon}</span>
    <div>
      <h2 className="section-label-title">{title}</h2>
      {subtitle && <p className="section-label-subtitle">{subtitle}</p>}
    </div>
  </div>
);

// ── Component ──────────────────────────────────────────────────────────────────

const Dashboard: React.FC = () => {
  const { vehicles, loading, error } = useVehicles();

  return (
    <motion.div
      className="dashboard-page"
      variants={pageVariants}
      initial="initial"
      animate="enter"
    >
      {/* ── Dashboard Command Center Hero Banner ───────────────────── */}
      <div className="dashboard-hero" id="dashboard-hero-banner">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="live-dot" />
            ENTERPRISE LOGISTICS COMMAND CENTER
          </div>
          <h1 className="hero-title">Fleet Operations Center</h1>
          <p className="hero-subtitle">
            Autonomous Fleet Telemetry · Route Optimization · Global Supply Chain Monitoring
          </p>
        </div>
        <div className="hero-metrics-pill">
          <div className="h-metric">
            <span className="h-val green">3,420 km</span>
            <span className="h-lbl">Distance Today</span>
          </div>
          <div className="h-divider" />
          <div className="h-metric">
            <span className="h-val cyan">42 Vehicles</span>
            <span className="h-lbl">Telemetry Active</span>
          </div>
          <div className="h-divider" />
          <div className="h-metric">
            <span className="h-val purple">99.99%</span>
            <span className="h-lbl">Network Uptime</span>
          </div>
        </div>
      </div>

      {/* ── Main Layout: Dashboard Content + Floating Right Panel ── */}
      <div className="dashboard-main-container">
        <div className="dashboard-center-content">
          {/* ── KPI Stats ─────────────────────────────────────────────── */}
          <SectionLabel
            icon="📊"
            title="Fleet Overview"
            subtitle="Live key performance indicators"
          />
          <DashboardCards />

          {/* ── Live Map ──────────────────────────────────────────────── */}
          <SectionLabel
            icon="🗺"
            title="Live Command Map"
            subtitle="Real-time vehicle positions, geofences & route tracking"
          />
          <MapPlaceholder height={580} />

          {/* ── Fleet Status + Recent Alerts Row ──────────────────────── */}
          <SectionLabel
            icon="🚦"
            title="Status & Incident Stream"
            subtitle="Fleet health breakdown and real-time alert feed"
          />
          <div className="dashboard-two-col">
            <FleetStatusCard />
            <RecentAlerts />
          </div>

          {/* ── Vehicle Table ──────────────────────────────────────────── */}
          <SectionLabel
            icon="🚛"
            title="Vehicle Fleet Telemetry"
            subtitle="Detailed view of all connected vehicles and driver status"
          />
          <VehicleList
            vehicles={vehicles.length > 0 ? vehicles : undefined}
            isLoading={loading}
            isError={!!error}
            errorMessage={error ?? undefined}
          />

          {/* ── Fleet Analytics ────────────────────────────────────────── */}
          <Suspense fallback={<AnalyticsSkeleton />}>
            <FleetAnalytics />
          </Suspense>
        </div>

        {/* ── Floating Right Panel ───────────────────────────────────── */}
        <RightSidebar />
      </div>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <Footer />
    </motion.div>
  );
};

export default Dashboard;
