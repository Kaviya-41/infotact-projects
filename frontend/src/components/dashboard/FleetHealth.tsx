/**
 * FleetHealth.tsx – Fleet Operational Status Radial / Donut Visualization
 */

import React from 'react';
import '../../styles/dashboard.css';

const FleetHealth: React.FC = () => {
  const total = 42;
  const moving = 28;
  const stopped = 9;
  const offline = 5;

  const movingPct = Math.round((moving / total) * 100);
  const stoppedPct = Math.round((stopped / total) * 100);
  const offlinePct = Math.round((offline / total) * 100);

  return (
    <div className="fleet-card" id="fleet-health-card">
      <div className="fleet-card__header">
        <h3 className="fleet-card__title">Fleet Health & Status Breakdown</h3>
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#2563EB', backgroundColor: '#EFF6FF', padding: '4px 8px', borderRadius: '6px' }}>
          99.8% System Health
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '16px 0' }}>
        {/* SVG Donut Chart */}
        <div style={{ position: 'relative', width: '130px', height: '130px', flexShrink: 0 }}>
          <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            {/* Background ring */}
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#F1F5F9"
              strokeWidth="3.8"
            />
            {/* Moving Arc (Green) */}
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#16A34A"
              strokeWidth="3.8"
              strokeDasharray={`${movingPct}, 100`}
            />
            {/* Stopped Arc (Amber) */}
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#D97706"
              strokeWidth="3.8"
              strokeDasharray={`${stoppedPct}, 100`}
              strokeDashoffset={`-${movingPct}`}
            />
            {/* Offline Arc (Red) */}
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#DC2626"
              strokeWidth="3.8"
              strokeDasharray={`${offlinePct}, 100`}
              strokeDashoffset={`-${movingPct + stoppedPct}`}
            />
          </svg>
          {/* Donut Center Label */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span className="tabular-nums" style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', lineHeight: '1' }}>
              42
            </span>
            <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
              Vehicles
            </span>
          </div>
        </div>

        {/* Breakdown Legend List */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Moving */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#334155' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16A34A', display: 'inline-block' }}></span> Moving
              </span>
              <span className="tabular-nums" style={{ fontWeight: 700, color: '#0F172A' }}>28 ({movingPct}%)</span>
            </div>
            <div style={{ height: '4px', backgroundColor: '#F1F5F9', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${movingPct}%`, backgroundColor: '#16A34A' }}></div>
            </div>
          </div>

          {/* Stopped */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#334155' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#D97706', display: 'inline-block' }}></span> Stopped / Idle
              </span>
              <span className="tabular-nums" style={{ fontWeight: 700, color: '#0F172A' }}>9 ({stoppedPct}%)</span>
            </div>
            <div style={{ height: '4px', backgroundColor: '#F1F5F9', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${stoppedPct}%`, backgroundColor: '#D97706' }}></div>
            </div>
          </div>

          {/* Offline */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#334155' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#DC2626', display: 'inline-block' }}></span> Offline / Signal Loss
              </span>
              <span className="tabular-nums" style={{ fontWeight: 700, color: '#0F172A' }}>5 ({offlinePct}%)</span>
            </div>
            <div style={{ height: '4px', backgroundColor: '#F1F5F9', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${offlinePct}%`, backgroundColor: '#DC2626' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FleetHealth;
