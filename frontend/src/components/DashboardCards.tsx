/**
 * DashboardCards.tsx – Premium Light KPI Statistics Cards with Sparklines
 * Shows Total Vehicles, Online Vehicles, Active Trips, and Active Alerts.
 */

import React from 'react';
import { motion } from 'framer-motion';
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
    label: 'Total Vehicles',
    value: 42,
    icon: <Truck size={18} />,
    iconVariant: 'blue',
    trend: { direction: 'up', value: '↑ 8.4% from last month' },
    subtitle: 'All registered fleet vehicles',
    sparklinePoints: '0,25 20,20 40,22 60,14 80,18 100,8 120,12',
    sparklineColor: '#2563EB',
  },
  {
    id: 'online-vehicles',
    label: 'Online Vehicles',
    value: 35,
    icon: <Navigation size={18} />,
    iconVariant: 'green',
    trend: { direction: 'up', value: '83.3% operational' },
    subtitle: 'Currently transmitting telemetry',
    valueColor: '#10B981',
    sparklinePoints: '0,28 20,24 40,18 60,20 80,12 100,10 120,6',
    sparklineColor: '#10B981',
  },
  {
    id: 'active-trips',
    label: 'Active Trips',
    value: 18,
    icon: <Route size={18} />,
    iconVariant: 'purple',
    trend: { direction: 'up', value: '↑ 12% today' },
    subtitle: 'Trips currently in progress',
    valueColor: '#8B5CF6',
    sparklinePoints: '0,30 20,28 40,22 60,24 80,16 100,14 120,10',
    sparklineColor: '#8B5CF6',
  },
  {
    id: 'active-alerts',
    label: 'Active Alerts',
    value: 3,
    icon: <AlertTriangle size={18} />,
    iconVariant: 'amber',
    trend: { direction: 'down', value: '1 Critical' },
    subtitle: 'Requires attention',
    valueColor: '#EF4444',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const DashboardCards: React.FC = () => {
  return (
    <div className="stats-grid">
      {KPI_DATA.map((kpi, index) => (
        <motion.div
          key={kpi.id}
          className="stat-card"
          custom={index}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          whileHover={{ y: -3, scale: 1.015 }}
          transition={{ duration: 0.2 }}
        >
          <div className="stat-card__top">
            <div className={`stat-card__icon-box stat-card__icon-box--${kpi.iconVariant}`}>
              {kpi.icon}
            </div>
            <span className={`stat-card__trend stat-card__trend--${kpi.trend.direction}`}>
              {kpi.trend.direction === 'up' ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              {kpi.trend.value}
            </span>
          </div>

          <div
            className="stat-card__value tabular-nums"
            style={kpi.valueColor ? { color: kpi.valueColor } : undefined}
          >
            {kpi.value}
          </div>

          <div className="stat-card__bottom">
            <div>
              <div className="stat-card__label">{kpi.label}</div>
              <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>{kpi.subtitle}</div>
            </div>

            {/* Sparkline chart */}
            {kpi.sparklinePoints && (
              <svg width="60" height="24" viewBox="0 0 120 32" style={{ overflow: 'visible', flexShrink: 0 }}>
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

export default DashboardCards;
