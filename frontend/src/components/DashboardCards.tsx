/**
 * DashboardCards.tsx
 * Four stat cards: Total, Moving, Stopped, Offline vehicles.
 * Week 1 – Static dummy data only.
 * Ready for real-time data injection via props / Socket.io in Week 3.
 */

import React from 'react';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface FleetStats {
  total: number;
  moving: number;
  stopped: number;
  offline: number;
}

interface StatCardData {
  id: string;
  label: string;
  value: number;
  icon: string;
  variant: 'total' | 'moving' | 'stopped' | 'offline';
  trend: string;
  trendDirection: 'up' | 'down' | 'neutral';
  trendIcon: string;
}

interface DashboardCardsProps {
  /** Stats object – defaults to dummy data when undefined (Week 1) */
  stats?: FleetStats;
}

// ── Dummy Data (Week 1) ────────────────────────────────────────────────────────

const DUMMY_STATS: FleetStats = {
  total:   42,
  moving:  28,
  stopped:  9,
  offline:  5,
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function buildCards(stats: FleetStats): StatCardData[] {
  return [
    {
      id: 'stat-total',
      label: 'Total Vehicles',
      value: stats.total,
      icon: '🚛',
      variant: 'total',
      trend: '+3 this month',
      trendDirection: 'up',
      trendIcon: '↑',
    },
    {
      id: 'stat-moving',
      label: 'Moving',
      value: stats.moving,
      icon: '▶',
      variant: 'moving',
      trend: '66.7% of fleet',
      trendDirection: 'up',
      trendIcon: '↑',
    },
    {
      id: 'stat-stopped',
      label: 'Stopped',
      value: stats.stopped,
      icon: '⏸',
      variant: 'stopped',
      trend: '21.4% of fleet',
      trendDirection: 'neutral',
      trendIcon: '→',
    },
    {
      id: 'stat-offline',
      label: 'Offline',
      value: stats.offline,
      icon: '📡',
      variant: 'offline',
      trend: '-2 since yesterday',
      trendDirection: 'down',
      trendIcon: '↓',
    },
  ];
}

// ── Sub-component: Single stat card ───────────────────────────────────────────

const StatCard: React.FC<{ data: StatCardData }> = ({ data }) => {
  const trendClass =
    data.trendDirection === 'up'
      ? 'trend-up'
      : data.trendDirection === 'down'
      ? 'trend-down'
      : 'trend-neutral';

  return (
    <article
      id={data.id}
      className={`stat-card stat-card--${data.variant}`}
      aria-label={`${data.label}: ${data.value} vehicles`}
    >
      <div className="stat-card__icon-wrap" aria-hidden="true">
        {data.icon}
      </div>

      <div className="stat-card__body">
        <p className="stat-card__label">{data.label}</p>
        <p className="stat-card__value">{data.value.toLocaleString()}</p>
        <p className={`stat-card__trend ${trendClass}`}>
          <span aria-hidden="true">{data.trendIcon}</span>
          <span>{data.trend}</span>
        </p>
      </div>
    </article>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────

const DashboardCards: React.FC<DashboardCardsProps> = ({ stats }) => {
  // Week 1: fall back to static dummy data
  const resolvedStats: FleetStats = stats ?? DUMMY_STATS;
  const cards = buildCards(resolvedStats);

  return (
    <section aria-label="Fleet statistics overview">
      <div className="stats-grid">
        {cards.map((card) => (
          <StatCard key={card.id} data={card} />
        ))}
      </div>
    </section>
  );
};

export default DashboardCards;
