/**
 * StatusBadge.tsx – Automotive Status Badge Component
 */

import React from 'react';

type BadgeVariant = 'moving' | 'stopped' | 'offline' | 'healthy' | 'warning' | 'critical';

interface StatusBadgeProps {
  variant: BadgeVariant;
  label: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ variant, label }) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'moving':
      case 'healthy':
        return 'status-badge--moving';
      case 'stopped':
      case 'warning':
        return 'status-badge--stopped';
      case 'offline':
      case 'critical':
        return 'status-badge--offline';
      default:
        return 'status-badge--moving';
    }
  };

  return (
    <span className={`status-badge ${getVariantClass()}`}>
      <span className="status-badge__dot" aria-hidden="true" />
      {label}
    </span>
  );
};

export default StatusBadge;
