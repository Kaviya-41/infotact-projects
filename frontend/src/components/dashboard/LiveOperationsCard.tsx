/**
 * LiveOperationsCard.tsx – Real-Time Operational Telemetry Metrics Panel
 * Positioned beside the main Live Fleet Map.
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Activity, Radio, Clock, Wifi } from 'lucide-react';
import '../../styles/dashboard.css';

export const LiveOperationsCard: React.FC = () => {
  return (
    <motion.div
      className="fd-card fd-card--no-hover"
      id="live-operations-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="fd-card__header">
        <h3 className="fd-card__title">
          <span style={{
            width: '28px', height: '28px', borderRadius: '8px',
            background: 'rgba(37, 99, 235, 0.08)', border: '1px solid rgba(37, 99, 235, 0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#2563EB',
          }}>
            <Activity size={14} />
          </span>
          Live Operations
        </h3>
        <span style={{
          fontSize: '11px', fontWeight: 600, color: '#10B981',
          background: 'rgba(16, 185, 129, 0.08)', padding: '3px 10px',
          borderRadius: '9999px', border: '1px solid rgba(16, 185, 129, 0.2)',
          display: 'flex', alignItems: 'center', gap: '4px',
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} aria-hidden="true" />
          Live 60Hz
        </span>
      </div>

      {/* Vehicle Operational Breakdown */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} aria-hidden="true" />
            Online Vehicles
          </span>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', fontFamily: 'var(--fd-font-mono)' }}>35</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }} aria-hidden="true" />
            Offline Vehicles
          </span>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#EF4444', fontFamily: 'var(--fd-font-mono)' }}>7</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8B5CF6' }} aria-hidden="true" />
            Active Trips
          </span>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#8B5CF6', fontFamily: 'var(--fd-font-mono)' }}>18</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B' }} aria-hidden="true" />
            Idle Vehicles
          </span>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#F59E0B', fontFamily: 'var(--fd-font-mono)' }}>5</span>
        </div>
      </div>

      <div style={{ height: '1px', background: '#E2E8F0', margin: '14px 0' }} />

      {/* Socket & Network Diagnostics */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
            SOCKET CONNECTION
          </span>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Radio size={12} /> ● Connected
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
          <span style={{ color: '#475569', fontWeight: 500 }}>Update Frequency</span>
          <span style={{ fontWeight: 700, color: '#0F172A', fontFamily: 'var(--fd-font-mono)' }}>60 Hz</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
          <span style={{ color: '#475569', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Wifi size={13} color="#2563EB" /> Network Latency
          </span>
          <span style={{ fontWeight: 700, color: '#10B981', fontFamily: 'var(--fd-font-mono)' }}>14 ms</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
          <span style={{ color: '#475569', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={13} color="#94A3B8" /> Last Sync
          </span>
          <span style={{ fontWeight: 600, color: '#64748B' }}>Just now</span>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(LiveOperationsCard);
