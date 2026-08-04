/**
 * SystemHealthCard.tsx – Infrastructure health monitoring card
 * Shows operational status, progress bars, and status badges for each system.
 */

import React from 'react';
import type { InfrastructureHealthItem } from '../../types/telemetry';
import GlassCard from '../ui/GlassCard';

interface SystemHealthCardProps {
  items: InfrastructureHealthItem[];
}

const getBarColor = (pct: number): string => {
  if (pct >= 75) return 'linear-gradient(90deg, #10B981, #34D399)';
  if (pct >= 40) return 'linear-gradient(90deg, #F59E0B, #FBBF24)';
  return 'linear-gradient(90deg, #EF4444, #F87171)';
};

const SystemHealthCard: React.FC<SystemHealthCardProps> = ({ items }) => {
  return (
    <GlassCard title="System Integrity" titleIcon="🏗️" id="system-health-card">
      <div className="health-card__list">
        {items.map(item => (
          <div className="health-item" key={item.id}>
            <div className={`health-item__icon health-item__icon--${item.status}`}>
              {item.icon}
            </div>
            <div className="health-item__info">
              <span className="health-item__name">{item.name}</span>
              <div className="health-item__bar-wrap">
                <div className="health-item__bar">
                  <div
                    className="health-item__bar-fill"
                    style={{
                      width: `${item.healthPercent}%`,
                      background: getBarColor(item.healthPercent),
                    }}
                  />
                </div>
                <span className="health-item__pct">{item.healthPercent}%</span>
              </div>
            </div>
            <span className={`health-item__status health-item__status--${item.status}`}>
              {item.status === 'operational' ? '● Online' : item.status === 'degraded' ? '◐ Degraded' : '○ Offline'}
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

export default SystemHealthCard;
