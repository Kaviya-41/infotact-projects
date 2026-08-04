/**
 * GlassCard.tsx – Reusable Light Glassmorphism Card Wrapper
 */

import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  compact?: boolean;
  title?: string;
  titleIcon?: React.ReactNode;
  headerRight?: React.ReactNode;
  id?: string;
  style?: React.CSSProperties;
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  compact = false,
  title,
  titleIcon,
  headerRight,
  id,
  style,
}) => {
  return (
    <div
      className={`glass-card${compact ? ' glass-card--compact' : ''} ${className}`}
      id={id}
      style={style}
    >
      {title && (
        <div className="glass-card__header">
          <h3 className="glass-card__title">
            {titleIcon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{titleIcon}</span>}
            {title}
          </h3>
          {headerRight}
        </div>
      )}
      {children}
    </div>
  );
};

export default GlassCard;
