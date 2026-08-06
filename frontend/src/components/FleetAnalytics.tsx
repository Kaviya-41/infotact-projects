/**
 * FleetAnalytics.tsx – Fleet Performance Analytics Component
 * Displays 7-day performance trend chart and supporting operational statistics:
 * Distance Today (3,420 km), Trips Completed (128), Avg Speed (54 km/h), Fleet Utilization (84%), On-Time Delivery (92%).
 */

import React from 'react';
import '../styles/dashboard.css';

const FleetAnalytics: React.FC = () => {
  return (
    <div className="analytics-section">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
        {/* Main Chart Card */}
        <div className="fd-card fd-card--no-hover" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>
                Fleet Performance
              </h3>
              <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
                Last 7 days distance travelled vs trips completed
              </p>
            </div>
            <div style={{ display: 'flex', gap: '16px', fontSize: '12px', fontWeight: 600 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2563EB' }}>
                <span style={{ width: '12px', height: '3px', backgroundColor: '#2563EB', borderRadius: '2px', display: 'inline-block' }} />
                Distance (km)
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10B981' }}>
                <span style={{ width: '12px', height: '3px', backgroundColor: '#10B981', borderRadius: '2px', display: 'inline-block' }} />
                Trips Completed
              </span>
            </div>
          </div>

          {/* SVG Smooth Area Line Chart */}
          <div style={{ position: 'relative', width: '100%', height: '220px' }}>
            <svg width="100%" height="100%" viewBox="0 0 800 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="distAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="tripsAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              <line x1="0" y1="40" x2="800" y2="40" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="0" y1="80" x2="800" y2="80" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="0" y1="120" x2="800" y2="120" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="0" y1="160" x2="800" y2="160" stroke="#F1F5F9" strokeWidth="1" />

              {/* Area Fills */}
              <path
                d="M 0 140 Q 130 90 260 110 T 520 60 T 800 40 L 800 190 L 0 190 Z"
                fill="url(#distAreaGrad)"
              />

              {/* Primary Line: Distance */}
              <path
                d="M 0 140 Q 130 90 260 110 T 520 60 T 800 40"
                fill="none" stroke="#2563EB" strokeWidth="3" strokeLinecap="round"
              />

              {/* Secondary Line: Trips */}
              <path
                d="M 0 160 Q 130 130 260 140 T 520 100 T 800 80"
                fill="none" stroke="#10B981" strokeWidth="2.5" strokeDasharray="5 3" strokeLinecap="round"
              />

              {/* Data Points */}
              <circle cx="260" cy="110" r="4.5" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2.5" />
              <circle cx="520" cy="60" r="4.5" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2.5" />
              <circle cx="800" cy="40" r="4.5" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2.5" />
            </svg>

            {/* Day Labels */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>

        {/* Supporting Statistics Column */}
        <div className="fd-card fd-card--no-hover" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justify: 'space-between' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
            Supporting Metrics
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>Distance Today</span>
              <span style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', fontFamily: 'var(--fd-font-mono)' }}>3,420 km</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>Trips Completed</span>
              <span style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', fontFamily: 'var(--fd-font-mono)' }}>128</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>Average Speed</span>
              <span style={{ fontSize: '16px', fontWeight: 800, color: '#2563EB', fontFamily: 'var(--fd-font-mono)' }}>54 km/h</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>Fleet Utilization</span>
              <span style={{ fontSize: '16px', fontWeight: 800, color: '#8B5CF6', fontFamily: 'var(--fd-font-mono)' }}>84%</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>On-Time Delivery</span>
              <span style={{ fontSize: '16px', fontWeight: 800, color: '#10B981', fontFamily: 'var(--fd-font-mono)' }}>92%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FleetAnalytics;
