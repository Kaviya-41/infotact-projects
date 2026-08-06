/**
 * RecentActivityCard.tsx – Timeline stream of real-time fleet events
 * Positioned at the bottom of the dashboard.
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, ShieldAlert, AlertTriangle, PlayCircle, WifiOff, ChevronRight } from 'lucide-react';
import '../../styles/dashboard.css';

interface ActivityItem {
  id: string;
  time: string;
  vehicleId: string;
  title: string;
  subtitle: string;
  type: 'completed' | 'geofence' | 'alert' | 'started' | 'offline';
}

const ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    time: '10:42 AM',
    vehicleId: 'FLT-001',
    title: 'FLT-001 completed Bengaluru → Hosur',
    subtitle: 'Trip completed successfully',
    type: 'completed',
  },
  {
    id: 'act-2',
    time: '10:38 AM',
    vehicleId: 'FLT-007',
    title: 'FLT-007 entered Bengaluru Hub',
    subtitle: 'Geofence entry detected',
    type: 'geofence',
  },
  {
    id: 'act-3',
    time: '10:31 AM',
    vehicleId: 'FLT-003',
    title: 'FLT-003 generated temperature alert',
    subtitle: 'Engine temperature above threshold',
    type: 'alert',
  },
  {
    id: 'act-4',
    time: '10:25 AM',
    vehicleId: 'FLT-004',
    title: 'FLT-004 started Bengaluru → Chennai',
    subtitle: 'Trip initiated',
    type: 'started',
  },
  {
    id: 'act-5',
    time: '10:18 AM',
    vehicleId: 'FLT-010',
    title: 'FLT-010 went offline',
    subtitle: 'Telemetry connection lost',
    type: 'offline',
  },
];

const typeConfig = {
  completed: { color: '#10B981', bg: 'rgba(16, 185, 129, 0.08)', Icon: CheckCircle2 },
  geofence:  { color: '#0EA5E9', bg: 'rgba(14, 165, 233, 0.08)', Icon: ShieldAlert },
  alert:     { color: '#EF4444', bg: 'rgba(239, 68, 68, 0.08)', Icon: AlertTriangle },
  started:   { color: '#2563EB', bg: 'rgba(37, 99, 235, 0.08)', Icon: PlayCircle },
  offline:   { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.08)', Icon: WifiOff },
};

export const RecentActivityCard: React.FC = () => {
  return (
    <motion.div
      className="fd-card fd-card--no-hover"
      id="recent-activity-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="fd-card__header">
        <div>
          <h3 className="fd-card__title">
            <span style={{
              width: '28px', height: '28px', borderRadius: '8px',
              background: 'rgba(37, 99, 235, 0.08)', border: '1px solid rgba(37, 99, 235, 0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#2563EB',
            }}>
              <Clock size={14} />
            </span>
            Recent Activity
          </h3>
          <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
            Real-time event stream from active vehicles
          </p>
        </div>

        <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>
          Today
        </span>
      </div>

      {/* Timeline Stream */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {ACTIVITIES.map((act, idx) => {
          const config = typeConfig[act.type];
          const ActIcon = config.Icon;

          return (
            <motion.div
              key={act.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.25 }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 14px', borderRadius: '10px',
                backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  backgroundColor: config.bg, color: config.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <ActIcon size={16} />
                </span>

                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                    {act.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '1px' }}>
                    {act.subtitle}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '12px', fontWeight: 600, color: '#94A3B8', fontFamily: 'var(--fd-font-mono)', whiteSpace: 'nowrap', marginLeft: '12px' }}>
                {act.time}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer Link */}
      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <a href="#activity" onClick={(e) => e.preventDefault()} style={{
          fontSize: '13px', fontWeight: 700, color: '#2563EB',
          textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px',
        }}>
          View Full Activity <ChevronRight size={14} />
        </a>
      </div>
    </motion.div>
  );
};

export default memo(RecentActivityCard);
