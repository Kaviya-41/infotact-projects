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
import DashboardLayout from '../layout/DashboardLayout';
import DashboardCards from '../components/DashboardCards';
import MapPlaceholder from '../components/MapPlaceholder';
import VehicleList from '../components/VehicleList';
import RecentAlerts from '../components/RecentAlerts';
import FleetStatusCard from '../components/FleetStatusCard';
import Footer from '../components/Footer';

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
  /*
   * TODO Week 3: Replace with useFleetSocket() hook to receive live:
   *   const { stats, vehicles, alerts, isConnected } = useFleetSocket();
   * For Week 1 we pass no props → components fall back to dummy data.
   */

  return (
    <DashboardLayout
      pageTitle="Fleet Dashboard"
      pageSubtitle="Real-time fleet monitoring & analytics"
    >
      <motion.div
        className="dashboard-page"
        variants={pageVariants}
        initial="initial"
        animate="enter"
      >
        {/* ── KPI Stats ─────────────────────────────────────────────── */}
        <SectionLabel
          icon="📊"
          title="Fleet Overview"
          subtitle="Live key performance indicators"
        />
        {/*
         * Pass `stats` prop in Week 3:
         *   <DashboardCards stats={stats} />
         */}
        <DashboardCards />

        {/* ── Live Map ──────────────────────────────────────────────── */}
        <SectionLabel
          icon="🗺"
          title="Live Map"
          subtitle="Real-time vehicle positions & route tracking"
        />
        <MapPlaceholder height={520} />

        {/* ── Fleet Status + Recent Alerts Row ──────────────────────── */}
        <SectionLabel
          icon="🚦"
          title="Status & Alerts"
          subtitle="Fleet health and recent incident feed"
        />
        <div className="dashboard-two-col">
          {/*
           * Pass `stats` prop in Week 3:
           *   <FleetStatusCard stats={stats} />
           */}
          <FleetStatusCard />

          {/*
           * Pass `alerts` prop in Week 3:
           *   <RecentAlerts alerts={alerts} />
           */}
          <RecentAlerts />
        </div>

        {/* ── Vehicle Table ──────────────────────────────────────────── */}
        <SectionLabel
          icon="🚛"
          title="Vehicle Fleet"
          subtitle="Detailed view of all vehicles and driver status"
        />
        {/*
         * Pass `vehicles` prop in Week 3:
         *   <VehicleList vehicles={vehicles} />
         */}
        <VehicleList />

        {/* ── Fleet Analytics ────────────────────────────────────────── */}
        <Suspense fallback={<AnalyticsSkeleton />}>
          <FleetAnalytics />
        </Suspense>

        {/* ── Footer ────────────────────────────────────────────────── */}
        <Footer />
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
