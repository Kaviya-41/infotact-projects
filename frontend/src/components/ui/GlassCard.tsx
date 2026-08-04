/**
 * GlassCard.tsx – Reusable glassmorphism card wrapper
 * Light-theme frosted glass effect with Framer Motion hover animations.
 */

import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  compact?: boolean;
  title?: string;
  titleIcon?: React.ReactNode;
  headerRight?: React.ReactNode;
  id?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  compact = false,
  title,
  titleIcon,
  headerRight,
  id,
}) => {
  return (
    <motion.div
      className={`glass-card${compact ? ' glass-card--compact' : ''} ${className}`}
      id={id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
    >
      {title && (
        <div className="glass-card__header">
          <h3 className="glass-card__title">
            {titleIcon && <span className="glass-card__title-icon">{titleIcon}</span>}
            {title}
          </h3>
          {headerRight}
        </div>
      )}
      {children}
    </motion.div>
  );
};

export default GlassCard;
