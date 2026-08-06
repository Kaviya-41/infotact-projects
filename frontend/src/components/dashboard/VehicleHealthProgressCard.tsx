/**
 * VehicleHealthProgressCard.tsx – Vehicle health breakdown card with progress bars
 * Shows Healthy, Attention Required, Maintenance, and Critical breakdowns.
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertCircle, Wrench, Siren } from 'lucide-react';
import '../../styles/dashboard.css';

interface HealthCategory {
  id: string;
  label: string;
  count: number;
  pct: number;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
}

const CATEGORIES: HealthCategory[] = [
  {
    id: 'healthy',
    label: 'Healthy',
    count: 32,
    pct: 76,
    color: '#10B981',
    bgColor: 'rgba(16, 185, 129, 0.08)',
    icon: <Shield size={14} />,
  },
  {
    id: 'attention',
    label: 'Attention Required',
    count: 6,
    pct: 14,
    color: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.08)',
    icon: <AlertCircle size={14} />,
  },
  {
    id: 'maintenance',
    label: 'Maintenance',
    count: 3,
    pct: 7,
    color: '#8B5CF6',
    bgColor: 'rgba(139, 92, 246, 0.08)',
    icon: <Wrench size={14} />,
  },
  {
    id: 'critical',
    label: 'Critical',
    count: 1,
    pct: 3,
    color: '#EF4444',
    bgColor: 'rgba(239, 68, 68, 0.08)',
    icon: <Siren size={14} />,
  },
];

export const VehicleHealthProgressCard: React.FC = () => {
  return (
    <motion.div
      className="fd-card fd-card--no-hover"
      id="vehicle-health-progress-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="fd-card__header">
        <div>
          <h3 className="fd-card__title">
            <span style={{
              width: '28px', height: '28px', borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#10B981',
            }}>
              <Shield size={14} />
            </span>
            Vehicle Health
          </h3>
          <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
            Diagnostic status across fleet
          </p>
        </div>

        <span style={{
          fontSize: '12px', fontWeight: 600, color: '#10B981',
          background: 'rgba(16, 185, 129, 0.08)', padding: '4px 10px',
          borderRadius: '9999px', border: '1px solid rgba(16, 185, 129, 0.15)',
        }}>
          42 Total
        </span>
      </div>

      {/* Category breakdown rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '8px 0' }}>
        {CATEGORIES.map((cat) => (
          <div key={cat.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#334155' }}>
                <span style={{ color: cat.color, display: 'flex' }}>{cat.icon}</span>
                {cat.label}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 600, color: '#64748B', fontSize: '12px' }}>
                  {cat.count} {cat.count === 1 ? 'vehicle' : 'vehicles'}
                </span>
                <span style={{ fontWeight: 700, color: cat.color, fontFamily: 'var(--fd-font-mono)', minWidth: '32px', textAlign: 'right' }}>
                  {cat.pct}%
                </span>
              </div>
            </div>

            {/* Bar */}
            <div style={{ height: '7px', backgroundColor: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
              <motion.div
                style={{ height: '100%', backgroundColor: cat.color, borderRadius: '4px' }}
                initial={{ width: 0 }}
                animate={{ width: `${cat.pct}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default memo(VehicleHealthProgressCard);
