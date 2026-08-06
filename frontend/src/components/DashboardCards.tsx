/**
 * DashboardCards.tsx – Premium Light KPI Statistics Cards with Framer Motion stagger
 * 4-card grid showing Total Vehicles, Online, Active Trips, Live Alerts.
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
}

const KPI_DATA: KPIData[] = [
  {
    id: 'total-vehicles',
    label: 'Total Fleet Vehicles',
    value: 42,
    icon: <Truck size={18} />,
    iconVariant: 'blue',
    trend: { direction: 'up', value: '+8.4%' },
    subtitle: 'vs last week',
  },
  {
    id: 'online-vehicles',
    label: 'Vehicles Online',
    value: 37,
    icon: <Navigation size={18} />,
    iconVariant: 'green',
    trend: { direction: 'up', value: '+4.2%' },
    subtitle: 'Active telemetry',
    valueColor: '#10B981',
  },
  {
    id: 'active-trips',
    label: 'Active Trips',
    value: 28,
    icon: <Route size={18} />,
    iconVariant: 'purple',
    trend: { direction: 'up', value: '+12%' },
    subtitle: 'In progress now',
    valueColor: '#8B5CF6',
  },
  {
    id: 'live-alerts',
    label: 'Live Alerts',
    value: 5,
    icon: <AlertTriangle size={18} />,
    iconVariant: 'amber',
    trend: { direction: 'down', value: '-2.1%' },
    subtitle: '3 Critical, 2 Warning',
    valueColor: '#F59E0B',
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
              {kpi.trend.direction === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
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
            <span className="stat-card__label">{kpi.label}</span>
            <span style={{ fontSize: '11px', color: '#94A3B8' }}>{kpi.subtitle}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardCards;
