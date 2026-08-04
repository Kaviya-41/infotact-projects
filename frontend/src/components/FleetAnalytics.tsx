/**
 * FleetAnalytics.tsx – Fleet Telemetry Performance Analytics Component
 */

import React from 'react';
import '../styles/dashboard.css';

const FleetAnalytics: React.FC = () => {
  return (
    <div className="analytics-section">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.3px' }}>
            Fleet Performance & Efficiency Analytics
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
            Telemetry aggregations across active routes today
          </p>
        </div>

        <div style={{ fontSize: '12px', color: '#2563EB', fontWeight: 600, backgroundColor: '#EFF6FF', padding: '6px 12px', borderRadius: '8px' }}>
          Real-time Engine Diagnostics Active
        </div>
      </div>

      {/* Analytics KPI Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px' }}>
        {/* Metric 1 */}
        <div className="fleet-card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>Distance Today</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: '4px 0' }} className="tabular-nums">3,420 km</div>
          <div style={{ fontSize: '11px', color: '#16A34A', fontWeight: 600 }}>↑ +12.4% vs avg</div>
        </div>

        {/* Metric 2 */}
        <div className="fleet-card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>Avg Fleet Speed</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: '4px 0' }} className="tabular-nums">54 km/h</div>
          <div style={{ fontSize: '11px', color: '#16A34A', fontWeight: 600 }}>Optimal Range</div>
        </div>

        {/* Metric 3 */}
        <div className="fleet-card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>Trips Completed</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: '4px 0' }} className="tabular-nums">124</div>
          <div style={{ fontSize: '11px', color: '#16A34A', fontWeight: 600 }}>↑ 98% On Time</div>
        </div>

        {/* Metric 4 */}
        <div className="fleet-card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>Fleet Utilization</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#2563EB', margin: '4px 0' }} className="tabular-nums">88.4%</div>
          <div style={{ fontSize: '11px', color: '#2563EB', fontWeight: 600 }}>High Efficiency</div>
        </div>

        {/* Metric 5 */}
        <div className="fleet-card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>Avg Idle Time</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: '4px 0' }} className="tabular-nums">1.2 h/veh</div>
          <div style={{ fontSize: '11px', color: '#D97706', fontWeight: 600 }}>↓ -18 min reduced</div>
        </div>

        {/* Metric 6 */}
        <div className="fleet-card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>Fuel Efficiency</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#16A34A', margin: '4px 0' }} className="tabular-nums">4.2 km/L</div>
          <div style={{ fontSize: '11px', color: '#16A34A', fontWeight: 600 }}>Optimal Efficiency</div>
        </div>
      </div>

      {/* Analytics Chart Visualization (Minimal Vector Line Graph) */}
      <div className="fleet-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 className="fleet-card__title">Fleet Telemetry Velocity & Utilization Trend (24 Hours)</h3>
            <p style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>Real-time speed and route throughput over the past 24 hours</p>
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '12px', fontWeight: 600 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2563EB' }}>
              <span style={{ width: '10px', height: '3px', backgroundColor: '#2563EB', borderRadius: '2px' }} /> Fleet Avg Speed (km/h)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16A34A' }}>
              <span style={{ width: '10px', height: '3px', backgroundColor: '#16A34A', borderRadius: '2px' }} /> Fuel Consumption Rate
            </span>
          </div>
        </div>

        {/* Vector SVG Minimal Line Chart */}
        <div style={{ position: 'relative', width: '100%', height: '220px' }}>
          <svg width="100%" height="100%" viewBox="0 0 800 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#16A34A" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#16A34A" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <line x1="0" y1="40" x2="800" y2="40" stroke="#F1F5F9" strokeWidth="1" />
            <line x1="0" y1="80" x2="800" y2="80" stroke="#F1F5F9" strokeWidth="1" />
            <line x1="0" y1="120" x2="800" y2="120" stroke="#F1F5F9" strokeWidth="1" />
            <line x1="0" y1="160" x2="800" y2="160" stroke="#F1F5F9" strokeWidth="1" />

            {/* Area Fills */}
            <path
              d="M 0 160 Q 100 120 200 80 T 400 60 T 600 90 T 800 50 L 800 190 L 0 190 Z"
              fill="url(#blueGradient)"
            />

            {/* Line Paths */}
            <path
              d="M 0 160 Q 100 120 200 80 T 400 60 T 600 90 T 800 50"
              fill="none"
              stroke="#2563EB"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M 0 170 Q 100 140 200 110 T 400 100 T 600 120 T 800 90"
              fill="none"
              stroke="#16A34A"
              strokeWidth="2.5"
              strokeDasharray="5 3"
              strokeLinecap="round"
            />

            {/* Data Point Dots */}
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
