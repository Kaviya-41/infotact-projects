/**
 * DashboardCards.tsx – Primary Fleet Telemetry KPI Statistics Cards
 */

import React from 'react';
import { Truck, Navigation, PauseCircle, WifiOff, TrendingUp, TrendingDown } from 'lucide-react';
import '../styles/dashboard.css';

const DashboardCards: React.FC = () => {
  return (
    <div className="stats-grid">
      {/* Total Vehicles */}
      <div className="stat-card">
        <div className="stat-card__top">
          <div className="stat-card__icon-box stat-card__icon-box--blue">
            <Truck size={18} />
          </div>
          <span className="stat-card__trend stat-card__trend--up">
            <TrendingUp size={14} /> +8.4%
          </span>
        </div>
        <div className="stat-card__value tabular-nums">42</div>
        <div className="stat-card__bottom">
          <span className="stat-card__label">Total Fleet Vehicles</span>
          <span style={{ fontSize: '11px', color: '#94A3B8' }}>vs last week</span>
        </div>
      </div>

      {/* Moving Vehicles */}
      <div className="stat-card">
        <div className="stat-card__top">
          <div className="stat-card__icon-box stat-card__icon-box--green">
            <Navigation size={18} />
          </div>
          <span className="stat-card__trend stat-card__trend--up">
            <TrendingUp size={14} /> +4.2%
          </span>
        </div>
        <div className="stat-card__value tabular-nums" style={{ color: '#16A34A' }}>28</div>
        <div className="stat-card__bottom">
          <span className="stat-card__label">Vehicles Moving</span>
          <span style={{ fontSize: '11px', color: '#94A3B8' }}>Active telemetry</span>
        </div>
      </div>

      {/* Stopped Vehicles */}
      <div className="stat-card">
        <div className="stat-card__top">
          <div className="stat-card__icon-box stat-card__icon-box--amber">
            <PauseCircle size={18} />
          </div>
          <span className="stat-card__trend stat-card__trend--down">
            <TrendingDown size={14} /> -2.1%
          </span>
        </div>
        <div className="stat-card__value tabular-nums" style={{ color: '#D97706' }}>9</div>
        <div className="stat-card__bottom">
          <span className="stat-card__label">Vehicles Stopped</span>
          <span style={{ fontSize: '11px', color: '#94A3B8' }}>Idle / Loading</span>
        </div>
      </div>

      {/* Offline Vehicles */}
      <div className="stat-card">
        <div className="stat-card__top">
          <div className="stat-card__icon-box stat-card__icon-box--red">
            <WifiOff size={18} />
          </div>
          <span className="stat-card__trend stat-card__trend--down">
            <TrendingDown size={14} /> -1.0%
          </span>
        </div>
        <div className="stat-card__value tabular-nums" style={{ color: '#DC2626' }}>5</div>
        <div className="stat-card__bottom">
          <span className="stat-card__label">Vehicles Offline</span>
          <span style={{ fontSize: '11px', color: '#94A3B8' }}>Signal disconnected</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;
