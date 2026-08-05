/**
 * GlassCard.tsx – Reusable Dark Obsidian Glassmorphism Card Wrapper
 */

import React from 'react';
import { motion } from 'framer-motion';

export interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  compact?: boolean;
  title?: string;
  titleIcon?: React.ReactNode;
  headerRight?: React.ReactNode;
  id?: string;
  style?: React.CSSProperties;
}

export const GlassCard: React.FC<GlassCardProps> = ({
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`bg-[#161B26]/65 backdrop-blur-md border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-2xl p-4 glass-card${compact ? ' glass-card--compact' : ''} ${className}`}
      id={id}
      style={style}
    >
      {title && (
        <div className="glass-card__header flex items-center justify-between mb-3">
          <h3 className="glass-card__title text-sm font-semibold text-white flex items-center gap-2">
            {titleIcon && <span className="inline-flex items-center">{titleIcon}</span>}
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

