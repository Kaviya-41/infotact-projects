/**
 * MapPlaceholder.tsx – Live Fleet Map Visualization Centerpiece
 * Preserves #fleet-map-canvas for Week 3 integration while providing a
 * light, enterprise-grade static map visualizer.
 */

import React, { useState } from 'react';
import { Compass, ZoomIn, ZoomOut, Layers, Navigation, Truck } from 'lucide-react';
import '../styles/dashboard.css';

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

interface MapPlaceholderProps {
  height?: number;
  onSelectVehicle?: (id: string) => void;
  selectedVehicleId?: string;
}

const MapPlaceholder: React.FC<MapPlaceholderProps> = ({
  height = 500,
  onSelectVehicle,
  selectedVehicleId = 'FLT-024'
}) => {
  const [zoomLevel, setZoomLevel] = useState(12);

  return (
    <div className="map-container-card" style={{ height: `${height}px` }}>
      {/* Top Map Header Controls */}
      <div className="map-header">
        <div className="map-title-badge">
          <Navigation size={16} color="#2563EB" />
          <span>Live Fleet Command Map</span>
          <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 500, marginLeft: '4px' }}>
            ({SAMPLE_MARKERS.length} Active Satellites)
          </span>
        </div>

        <div className="map-controls-group">
          <button className="map-btn" title="Toggle Layers">
            <Layers size={14} style={{ display: 'inline', marginRight: '4px' }} /> Satellite
          </button>
          <button className="map-btn" onClick={() => setZoomLevel(prev => Math.min(prev + 1, 18))} title="Zoom In">
            <ZoomIn size={14} />
          </button>
          <button className="map-btn" onClick={() => setZoomLevel(prev => Math.max(prev - 1, 6))} title="Zoom Out">
            <ZoomOut size={14} />
          </button>
        </div>
      </div>

      {/* Canvas Mount Point for Week 3 (Preserved) & SVG Map Visualizer */}
      <div className="map-visualizer" style={{ position: 'relative', overflow: 'hidden' }}>
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
            zIndex: 1
          }}
        ></canvas>

        {/* Light Map Background SVG Grid & Vector Roads */}
        <svg
          width="100%"
          height="100%"
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#F8FAFC' }}
        >
          {/* Subtle Grid */}
          <defs>
            <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8F0" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#map-grid)" />

          {/* Simulated Primary Highways (Gray Lines) */}
          <path d="M -50 180 Q 300 220 600 150 T 1200 300" fill="none" stroke="#CBD5E1" strokeWidth="6" strokeLinecap="round" />
          <path d="M 220 -50 Q 250 250 400 600" fill="none" stroke="#CBD5E1" strokeWidth="6" strokeLinecap="round" />
          <path d="M -50 420 Q 500 380 1100 480" fill="none" stroke="#E2E8F0" strokeWidth="4" />
          <path d="M 650 -50 Q 580 300 750 600" fill="none" stroke="#E2E8F0" strokeWidth="4" />

          {/* Active Fleet Route (Blue Highlight) */}
          <path
            d="M 180 450 Q 280 620 420 380 T 680 250"
            fill="none"
            stroke="#2563EB"
            strokeWidth="3.5"
            strokeDasharray="6 4"
          />

          {/* Geofence Region Overlay */}
          <path
            d="M 320 180 L 520 190 L 580 320 L 380 340 Z"
            fill="rgba(37, 99, 235, 0.04)"
            stroke="#2563EB"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <text x="340" y="210" fill="#2563EB" fontSize="11" fontWeight="600" letterSpacing="0.5">
            GEOFENCE REGION ALPHA
          </text>
        </svg>

        {/* Interactive Vehicle Markers Overlay */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 5 }}>
          {SAMPLE_MARKERS.map((v) => {
            const isSelected = selectedVehicleId === v.id;
            const statusColor = v.status === 'Moving' ? '#16A34A' : v.status === 'Stopped' ? '#D97706' : '#DC2626';

            return (
              <div
                key={v.id}
                onClick={() => onSelectVehicle && onSelectVehicle(v.id)}
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
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Marker Badge */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: isSelected ? '#0F172A' : '#FFFFFF',
                  color: isSelected ? '#FFFFFF' : '#0F172A',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: 700,
                  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.12)',
                  border: isSelected ? '2px solid #2563EB' : '1px solid #E2E8F0',
                  whiteSpace: 'nowrap'
                }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: statusColor,
                    display: 'inline-block',
                    boxShadow: v.status === 'Moving' ? `0 0 0 3px ${statusColor}33` : 'none'
                  }}></span>
                  <Truck size={12} />
                  <span>{v.id}</span>
                  {v.status === 'Moving' && (
                    <span style={{ fontSize: '10px', color: isSelected ? '#60A5FA' : '#2563EB', fontWeight: 600 }}>
                      {v.speed} km/h
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Left Legend & Controls */}
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          zIndex: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          border: '1px solid #E2E8F0',
          borderRadius: '10px',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          fontSize: '12px',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16A34A', display: 'inline-block' }}></span>
            <span style={{ fontWeight: 500, color: '#334155' }}>Moving (28)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#D97706', display: 'inline-block' }}></span>
            <span style={{ fontWeight: 500, color: '#334155' }}>Stopped (9)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#DC2626', display: 'inline-block' }}></span>
            <span style={{ fontWeight: 500, color: '#334155' }}>Offline (5)</span>
          </div>
        </div>

        {/* Bottom Right Scale & Compass */}
        <div style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '6px 12px',
            fontSize: '11px',
            fontWeight: 600,
            color: '#64748B'
          }}>
            Scale: 5 km | Zoom {zoomLevel}x
          </div>

          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
          }}>
            <Compass size={18} color="#2563EB" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPlaceholder;
