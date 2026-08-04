/**
 * FleetMapCanvas.tsx – Live Fleet Map / Vehicle Telemetry Canvas Stage
 * Centerpiece stage preserving #fleet-map-canvas for Week 3 integration.
 */

import React, { useState } from 'react';
import { Compass, ZoomIn, ZoomOut, Truck } from 'lucide-react';
import ActiveRouteCard from '../widgets/ActiveRouteCard';
import VehicleAlertBanner from '../widgets/VehicleAlertBanner';

interface VehicleMarker {
  id: string;
  name: string;
  driver: string;
  status: 'Moving' | 'Stopped' | 'Offline';
  speed: number;
  x: number; // percentage
  y: number; // percentage
}

const SAMPLE_MARKERS: VehicleMarker[] = [
  { id: 'FLT-024', name: 'Cascadia #24', driver: 'Arjun Kumar', status: 'Moving', speed: 68, x: 42, y: 38 },
  { id: 'FLT-012', name: 'Sprinter Van #12', driver: 'Sarah Chen', status: 'Moving', speed: 54, x: 28, y: 62 },
  { id: 'FLT-007', name: 'Volvo FH16 #07', driver: 'Marcus Vance', status: 'Moving', speed: 72, x: 68, y: 25 },
  { id: 'FLT-031', name: 'Ford Transit #31', driver: 'Elena Rostova', status: 'Stopped', speed: 0, x: 55, y: 70 },
  { id: 'FLT-018', name: 'Kenworth T680 #18', driver: 'David Miller', status: 'Offline', speed: 0, x: 78, y: 52 },
  { id: 'FLT-005', name: 'Isuzu NPR #05', driver: 'Kenji Sato', status: 'Moving', speed: 48, x: 18, y: 45 },
];

const FleetMapCanvas: React.FC = () => {
  const [selectedId, setSelectedId] = useState('FLT-024');
  const [zoomLevel, setZoomLevel] = useState(12);

  return (
    <div className="center-stage" id="fleet-map-stage">
      {/* Top Floating Overlay Cards */}
      <div className="canvas-overlay-top-left">
        <ActiveRouteCard />
      </div>

      <div className="canvas-overlay-top-center">
        <VehicleAlertBanner />
      </div>

      {/* Main Map Visualizer Stage */}
      <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '620px', flex: 1 }}>
        {/* Preserved Canvas Element for Week 3 integration */}
        <canvas
          id="fleet-map-canvas"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        ></canvas>

        {/* Vector SVG Light Map Grid & Road Network */}
        <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#F8FAFC' }}>
          <defs>
            <pattern id="light-map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(15, 23, 42, 0.05)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#light-map-grid)" />

          {/* Primary Arterial Road Lines */}
          <path d="M -50 200 Q 350 240 700 180 T 1300 320" fill="none" stroke="#CBD5E1" strokeWidth="8" strokeLinecap="round" />
          <path d="M 240 -50 Q 270 280 440 680" fill="none" stroke="#CBD5E1" strokeWidth="8" strokeLinecap="round" />
          <path d="M -50 460 Q 550 420 1200 520" fill="none" stroke="#E2E8F0" strokeWidth="5" />
          <path d="M 720 -50 Q 640 340 820 680" fill="none" stroke="#E2E8F0" strokeWidth="5" />

          {/* Active Fleet Route (Highlight Blue Line) */}
          <path
            d="M 200 480 Q 300 640 440 400 T 700 280"
            fill="none"
            stroke="#2563EB"
            strokeWidth="4"
            strokeDasharray="8 5"
          />

          {/* Geofence Overlay */}
          <polygon
            points="340,190 540,200 600,340 400,360"
            fill="rgba(37, 99, 235, 0.04)"
            stroke="#2563EB"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <text x="360" y="220" fill="#2563EB" fontSize="11" fontWeight="700" letterSpacing="0.5">
            GEOFENCE REGION ALPHA
          </text>
        </svg>

        {/* Vehicle Markers */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 }}>
          {SAMPLE_MARKERS.map((v) => {
            const isSelected = selectedId === v.id;
            const statusColor = v.status === 'Moving' ? '#16A34A' : v.status === 'Stopped' ? '#D97706' : '#DC2626';

            return (
              <div
                key={v.id}
                onClick={() => setSelectedId(v.id)}
                style={{
                  position: 'absolute',
                  left: `${v.x}%`,
                  top: `${v.y}%`,
                  transform: 'translate(-50%, -50%)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: isSelected ? '#0F172A' : '#FFFFFF',
                  color: isSelected ? '#FFFFFF' : '#0F172A',
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: 700,
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
                  border: isSelected ? '2px solid #2563EB' : '1px solid rgba(15, 23, 42, 0.1)',
                  whiteSpace: 'nowrap',
                }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: statusColor,
                    display: 'inline-block',
                  }}></span>
                  <Truck size={13} />
                  <span>{v.id}</span>
                  {v.status === 'Moving' && (
                    <span style={{ fontSize: '10px', color: isSelected ? '#60A5FA' : '#2563EB', fontWeight: 700 }} className="font-mono">
                      {v.speed} km/h
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Map Bottom Legend & Controls */}
        <div style={{
          position: 'absolute',
          bottom: '24px',
          left: '24px',
          zIndex: 20,
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(15, 23, 42, 0.08)',
          borderRadius: '12px',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          fontSize: '12px',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16A34A', display: 'inline-block' }}></span>
            <span style={{ fontWeight: 600, color: '#334155' }}>Moving (28)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#D97706', display: 'inline-block' }}></span>
            <span style={{ fontWeight: 600, color: '#334155' }}>Stopped (9)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#DC2626', display: 'inline-block' }}></span>
            <span style={{ fontWeight: 600, color: '#334155' }}>Offline (5)</span>
          </div>
        </div>

        {/* Bottom Right Scale & Controls */}
        <div style={{
          position: 'absolute',
          bottom: '24px',
          right: '24px',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={() => setZoomLevel(prev => Math.min(prev + 1, 18))} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#FFFFFF', cursor: 'pointer' }}>
              <ZoomIn size={14} />
            </button>
            <button onClick={() => setZoomLevel(prev => Math.max(prev - 1, 6))} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#FFFFFF', cursor: 'pointer' }}>
              <ZoomOut size={14} />
            </button>
          </div>

          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(15, 23, 42, 0.08)',
            borderRadius: '8px',
            padding: '8px 14px',
            fontSize: '11px',
            fontWeight: 600,
            color: '#64748B'
          }}>
            Scale: 5 km | {zoomLevel}x
          </div>

          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.06)'
          }}>
            <Compass size={20} color="#2563EB" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FleetMapCanvas;
