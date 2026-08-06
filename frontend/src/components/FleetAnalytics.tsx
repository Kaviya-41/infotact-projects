/**
 * FleetAnalytics.tsx – Fleet Telemetry Performance Analytics
 * Premium light theme with 6-metric KPI row and SVG line chart.
 */

import React from 'react';
import '../styles/dashboard.css';

const FleetAnalytics: React.FC = () => {
  return (
    <div className="analytics-section">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.3px' }}>
            Fleet Performance & Efficiency
          </h2>
          <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '2px' }}>
            Telemetry aggregations across active routes today
          </p>
        </div>

        <div style={{
          fontSize: '12px', color: '#2563EB', fontWeight: 600,
          backgroundColor: 'rgba(37, 99, 235, 0.08)', padding: '6px 14px',
          borderRadius: '8px', border: '1px solid rgba(37, 99, 235, 0.12)',
        }}>
          Real-time Diagnostics Active
        </div>
      </div>

      {/* Analytics KPI Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px' }}>
        {[
          { label: 'Distance Today', value: '3,420 km', change: '↑ +12.4% vs avg', color: '#10B981' },
          { label: 'Avg Fleet Speed', value: '54 km/h', change: 'Optimal Range', color: '#10B981' },
          { label: 'Trips Completed', value: '124', change: '↑ 98% On Time', color: '#10B981' },
          { label: 'Fleet Utilization', value: '88.4%', change: 'High Efficiency', color: '#2563EB', valueColor: '#2563EB' },
          { label: 'Avg Idle Time', value: '1.2 h/veh', change: '↓ -18 min reduced', color: '#F59E0B' },
          { label: 'Fuel Efficiency', value: '4.2 km/L', change: 'Optimal Efficiency', color: '#10B981', valueColor: '#10B981' },
        ].map((metric) => (
          <div
            key={metric.label}
            className="fd-card fd-card--compact"
            style={{ padding: '16px' }}
          >
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
              {metric.label}
            </div>
            <div
              className="tabular-nums"
              style={{
                fontSize: '22px', fontWeight: 800, margin: '4px 0',
                color: metric.valueColor || '#0F172A',
              }}
            >
              {metric.value}
            </div>
            <div style={{ fontSize: '11px', color: metric.color, fontWeight: 600 }}>
              {metric.change}
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Chart Visualization */}
      <div className="fd-card fd-card--no-hover" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#0F172A' }}>
              Fleet Velocity & Utilization Trend (24h)
            </h3>
            <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
              Speed and route throughput over the past 24 hours
            </p>
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '12px', fontWeight: 600 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2563EB' }}>
              <span style={{ width: '12px', height: '3px', backgroundColor: '#2563EB', borderRadius: '2px', display: 'inline-block' }} />
              Avg Speed (km/h)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10B981' }}>
              <span style={{ width: '12px', height: '3px', backgroundColor: '#10B981', borderRadius: '2px', display: 'inline-block' }} />
              Fuel Consumption
            </span>
          </div>
        </div>

        {/* SVG Line Chart */}
        <div style={{ position: 'relative', width: '100%', height: '220px' }}>
          <svg width="100%" height="100%" viewBox="0 0 800 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="blueAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <line x1="0" y1="40" x2="800" y2="40" stroke="#F1F5F9" strokeWidth="1" />
            <line x1="0" y1="80" x2="800" y2="80" stroke="#F1F5F9" strokeWidth="1" />
            <line x1="0" y1="120" x2="800" y2="120" stroke="#F1F5F9" strokeWidth="1" />
            <line x1="0" y1="160" x2="800" y2="160" stroke="#F1F5F9" strokeWidth="1" />

            {/* Area Fill */}
            <path
              d="M 0 160 Q 100 120 200 80 T 400 60 T 600 90 T 800 50 L 800 190 L 0 190 Z"
              fill="url(#blueAreaGrad)"
            />

            {/* Line Paths */}
            <path
              d="M 0 160 Q 100 120 200 80 T 400 60 T 600 90 T 800 50"
              fill="none" stroke="#2563EB" strokeWidth="3" strokeLinecap="round"
            />
            <path
              d="M 0 170 Q 100 140 200 110 T 400 100 T 600 120 T 800 90"
              fill="none" stroke="#10B981" strokeWidth="2.5" strokeDasharray="5 3" strokeLinecap="round"
            />

            {/* Data Points */}
            <circle cx="200" cy="80" r="4" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2.5" />
            <circle cx="400" cy="60" r="4" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2.5" />
            <circle cx="600" cy="90" r="4" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2.5" />
          </svg>

          {/* Time Labels */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: '#94A3B8', fontWeight: 500 }}>
            <span>00:00</span>
            <span>04:00</span>
            <span>08:00</span>
            <span>12:00</span>
            <span>16:00</span>
            <span>20:00</span>
            <span>24:00</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FleetAnalytics;
