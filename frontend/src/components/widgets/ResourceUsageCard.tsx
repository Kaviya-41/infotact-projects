/**
 * ResourceUsageCard.tsx – Disaster response resource allocation card
 * Shows breakdown of personnel, vehicles, medical supplies, etc.
 */

import React from 'react';
import type { ResourceAllocation } from '../../types/telemetry';
import GlassCard from '../ui/GlassCard';

interface ResourceUsageCardProps {
  resources: ResourceAllocation[];
}

const ResourceUsageCard: React.FC<ResourceUsageCardProps> = ({ resources }) => {
  return (
    <GlassCard title="Resource Allocation" titleIcon="📦" id="resource-usage-card">
      <div className="resource-list">
        {resources.map(res => {
          const pct = Math.round((res.allocated / res.total) * 100);
          return (
            <div className="resource-item" key={res.id}>
              <div className="resource-item__header">
                <span className="resource-item__label">
                  <span
                    className="resource-item__label-dot"
                    style={{ background: res.color }}
                  />
                  {res.name}
                </span>
                <span className="resource-item__value">
                  {res.allocated}/{res.total} {res.unit}
                </span>
              </div>
              <div className="resource-item__bar">
                <div
                  className="resource-item__bar-fill"
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${res.color}, ${res.color}dd)`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};

export default ResourceUsageCard;
