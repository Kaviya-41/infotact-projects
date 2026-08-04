/**
 * StatusBadge.tsx – Severity-aware status badge
 * Shows a colored dot + text with optional pulse animation.
 */

import React from 'react';

type BadgeVariant = 'critical' | 'warning' | 'stable' | 'info';

interface StatusBadgeProps {
  variant: BadgeVariant;
  label: string;
  pulse?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ variant, label, pulse = false }) => {
  return (
    <span className={`status-badge status-badge--${variant}${pulse ? ' status-badge--pulse' : ''}`}>
      <span className="status-badge__dot" aria-hidden="true" />
      {label}
    </span>
  );
};

export default StatusBadge;
