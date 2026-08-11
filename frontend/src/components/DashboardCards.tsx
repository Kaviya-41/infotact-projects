/**
 * DashboardCards.tsx – Compact Light KPI Statistics Cards
 * 4 concise cards (120-130px height) with sparklines:
 * 1. Total Vehicles: 42 (+8.4% from last month)
 * 2. Online Vehicles: 35 (83.3% operational)
 * 3. Active Trips: 18 (+12% today)
 * 4. Active Alerts: 3 (1 Critical)
 */

import React, { memo } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Truck, Navigation, Route, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import '../styles/dashboard.css';

interface KPIData {
  id: string;
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconVariant: string;
  trend: { direction: 'up' | 'down'; value: string };
  subtitle: string;
  valueColor?: string;
  sparklinePoints?: string;
  sparklineColor?: string;
}

const KPI_DATA: KPIData[] = [
  {
    id: 'total-vehicles',
    label: 'TOTAL VEHICLES',
    value: 42,
    icon: <Truck size={17} />,
    iconVariant: 'blue',
    trend: { direction: 'up', value: '+8.4% from last month' },
    subtitle: 'Registered fleet units',
    sparklinePoints: '0,25 20,20 40,22 60,14 80,18 100,8 120,12',
    sparklineColor: '#2563EB',
  },
  {
    id: 'online-vehicles',
    label: 'ONLINE VEHICLES',
    value: 35,
    icon: <Navigation size={17} />,
    iconVariant: 'green',
    trend: { direction: 'up', value: '83.3% operational' },
    subtitle: 'Actively transmitting',
    valueColor: '#10B981',
    sparklinePoints: '0,28 20,24 40,18 60,20 80,12 100,10 120,6',
    sparklineColor: '#10B981',
  },
  {
    id: 'active-trips',
    label: 'ACTIVE TRIPS',
    value: 18,
    icon: <Route size={17} />,
    iconVariant: 'purple',
    trend: { direction: 'up', value: '+12% today' },
    subtitle: 'Dispatches in progress',
    valueColor: '#7C3AED',
    sparklinePoints: '0,30 20,28 40,22 60,24 80,16 100,14 120,10',
    sparklineColor: '#7C3AED',
  },
  {
    id: 'active-alerts',
    label: 'ACTIVE ALERTS',
    value: 0,
    icon: <AlertTriangle size={17} />,
    iconVariant: 'green',
    trend: { direction: 'down', value: '0 Critical' },
    subtitle: 'All systems operational',
    valueColor: '#10B981',
  },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

export const DashboardCards: React.FC = () => {
  return (
    <div className="stats-grid" id="kpi-overview-row">
      {KPI_DATA.map((kpi) => (
        <motion.div
          key={kpi.id}
          className="stat-card"
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          {/* Top Row: Icon + Trend Badge */}
          <div className="stat-card__top">
            <div className={`stat-card__icon-box stat-card__icon-box--${kpi.iconVariant}`}>
              {kpi.icon}
            </div>
            <span className={`stat-card__trend stat-card__trend--${kpi.trend.direction}`}>
              {kpi.trend.direction === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              <span>{kpi.trend.value}</span>
            </span>
          </div>

          {/* Center: Large KPI Number */}
          <div
            className="stat-card__value tabular-nums"
            style={kpi.valueColor ? { color: kpi.valueColor } : undefined}
          >
            {kpi.value}
          </div>

          {/* Bottom Row: Label & Sparkline */}
          <div className="stat-card__bottom">
            <div>
              <div className="stat-card__label">{kpi.label}</div>
              <div className="stat-card__sub">{kpi.subtitle}</div>
            </div>

            {/* Sparkline Graphic */}
            {kpi.sparklinePoints && (
              <svg width="56" height="22" viewBox="0 0 120 32" style={{ overflow: 'visible', flexShrink: 0 }}>
                <polyline
                  fill="none"
                  stroke={kpi.sparklineColor}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={kpi.sparklinePoints}
                />
              </svg>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default memo(DashboardCards);
