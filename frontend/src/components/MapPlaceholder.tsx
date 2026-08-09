/**
 * MapPlaceholder.tsx – Live Fleet Command Map Component
 * Real-Time Enterprise Fleet Telemetry Map with:
 * - Header: "Live Fleet Map", Subtitle: "Real-time vehicle positions and operational status"
 * - Mode controls: Live, Satellite, Traffic
 * - Stacked top-right controls: Zoom In (+), Zoom Out (-), Fullscreen, Recenter (36px rounded buttons)
 * - Vehicle markers: Status dot, 🚚 vehicle icon, Vehicle ID, speed (FLT-001 68 km/h, FLT-004, FLT-007, etc.)
 * - Pulse ring animations for moving/online vehicles
 * - Active route curve with directional indicators (Bengaluru → Chennai)
 * - Geofence Region Alpha polygon with dashed border & transparent fill
 * - Bottom legend and interactive vehicle HUD drawer trigger
 */

import React, { useState, useCallback, memo } from 'react';
import {
  Layers, Navigation, Truck, Maximize2, ZoomIn, ZoomOut, Compass,
  RotateCcw
} from 'lucide-react';
import VehicleHUD from './dashboard/VehicleHUD';
import '../styles/dashboard.css';

interface VehicleMarker {
  id: string;
  name: string;
  driver: string;
  status: 'Online' | 'Moving' | 'Idle' | 'Offline' | 'Maintenance';
  speed: number;
  fuel: number;
  tripProgress: number;
  eta: string;
  route: { origin: string; destination: string };
  x: number;
  y: number;
}

const SAMPLE_MARKERS: VehicleMarker[] = [
  { id: 'FLT-001', name: 'Volvo FH16 #01', driver: 'Arjun Kumar', status: 'Moving', speed: 68, fuel: 72, tripProgress: 72, eta: '02:45 PM', route: { origin: 'Bengaluru', destination: 'Hosur' }, x: 42, y: 38 },
  { id: 'FLT-002', name: 'Cascadia #02', driver: 'Rohan Sharma', status: 'Online', speed: 48, fuel: 82, tripProgress: 45, eta: '04:10 PM', route: { origin: 'Bengaluru', destination: 'Mysore' }, x: 28, y: 62 },
  { id: 'FLT-003', name: 'Kenworth #03', driver: 'Rajesh Verma', status: 'Idle', speed: 0, fuel: 34, tripProgress: 90, eta: '04:15 PM', route: { origin: 'Mumbai', destination: 'Pune' }, x: 55, y: 70 },
  { id: 'FLT-004', name: 'Freightliner #04', driver: 'Karthik S', status: 'Moving', speed: 54, fuel: 48, tripProgress: 48, eta: '05:20 PM', route: { origin: 'Bengaluru', destination: 'Chennai' }, x: 68, y: 25 },
  { id: 'FLT-007', name: 'Scania R500 #07', driver: 'Marcus Vance', status: 'Moving', speed: 64, fuel: 18, tripProgress: 88, eta: '12:30 PM', route: { origin: 'Delhi', destination: 'Jaipur' }, x: 18, y: 45 },
  { id: 'FLT-008', name: 'Tata Prima #08', driver: 'Vikram Singh', status: 'Maintenance', speed: 0, fuel: 60, tripProgress: 0, eta: '—', route: { origin: 'Depot', destination: 'Service' }, x: 35, y: 80 },
  { id: 'FLT-010', name: 'Isuzu Giga #10', driver: 'Suresh Patel', status: 'Offline', speed: 0, fuel: 40, tripProgress: 15, eta: '—', route: { origin: 'Ahmedabad', destination: 'Surat' }, x: 78, y: 52 },
];

interface MapPlaceholderProps {
  height?: number;
  onSelectVehicle?: (id: string) => void;
  selectedVehicleId?: string | null;
}

const MapPlaceholder: React.FC<MapPlaceholderProps> = ({
  height,
  onSelectVehicle,
  selectedVehicleId: externalSelectedId,
}) => {
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>('FLT-004');
  const [zoomLevel, setZoomLevel] = useState(12);
  const [mapMode, setMapMode] = useState<'Live' | 'Satellite' | 'Traffic'>('Live');

  const selectedId = externalSelectedId !== undefined ? externalSelectedId : internalSelectedId;
  const selectedVehicle = SAMPLE_MARKERS.find(v => v.id === selectedId);

  const handleSelect = useCallback((id: string) => {
    setInternalSelectedId(id);
    onSelectVehicle?.(id);
  }, [onSelectVehicle]);

  const toggleFullscreen = () => {
    const el = document.getElementById('fleet-map-container');
    if (el) {
      if (!document.fullscreenElement) {
        el.requestFullscreen?.().catch(() => {});
      } else {
        document.exitFullscreen?.().catch(() => {});
      }
    }
  };

  const handleRecenter = () => {
    setZoomLevel(12);
    setInternalSelectedId('FLT-004');
    onSelectVehicle?.('FLT-004');
  };

  const getStatusColor = (status: VehicleMarker['status']) => {
    switch (status) {
      case 'Online': return '#10B981';
      case 'Moving': return '#2563EB';
      case 'Idle': return '#F59E0B';
      case 'Offline': return '#EF4444';
      case 'Maintenance': return '#7C3AED';
      default: return '#2563EB';
    }
  };

  return (
    <div
      className="map-container-card"
      id="fleet-map-container"
      style={height ? { height: `${height}px` } : { flex: 1, minHeight: '520px' }}
    >
      {/* Top Map Header Controls */}
      <div className="map-header">
        <div className="map-title-badge">
          <div className="map-title-icon">
            <Navigation size={15} color="#2563EB" />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>
              Live Fleet Map
            </div>
            <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 400 }}>
              Real-time vehicle positions and operational status
            </div>
          </div>
        </div>

        {/* Top-right layer controls: Live, Satellite, Traffic */}
        <div className="map-controls-group">
          {(['Live', 'Satellite', 'Traffic'] as const).map((mode) => (
            <button
              key={mode}
              className={`map-btn ${mapMode === mode ? 'active' : ''}`}
              onClick={() => setMapMode(mode)}
              title={`Switch to ${mode} map layer`}
            >
              {mode === 'Satellite' && <Layers size={13} />}
              <span>{mode}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Map Visualizer Viewport */}
      <div className="map-visualizer" id="fleet-map-stage">
        {/* Canvas for HTML5 Hardware Acceleration */}
        <canvas
          id="fleet-map-canvas"
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1,
          }}
        />

        {/* Vector SVG Map Layer */}
        <svg
          width="100%" height="100%"
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: mapMode === 'Satellite' ? '#0F172A' : '#F8FAFC',
            transition: 'background-color 0.3s ease'
          }}
        >
          {/* Grid Pattern */}
          <defs>
            <pattern id="light-map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke={mapMode === 'Satellite' ? '#1E293B' : '#E2E8F0'} strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#light-map-grid)" />

          {/* Primary Arterial Road Lines */}
          <path d="M -50 180 Q 300 220 600 150 T 1200 300" fill="none" stroke={mapMode === 'Satellite' ? '#334155' : '#CBD5E1'} strokeWidth="6" strokeLinecap="round" />
          <path d="M 220 -50 Q 250 250 400 600" fill="none" stroke={mapMode === 'Satellite' ? '#334155' : '#CBD5E1'} strokeWidth="6" strokeLinecap="round" />
          <path d="M -50 420 Q 500 380 1100 480" fill="none" stroke={mapMode === 'Satellite' ? '#1E293B' : '#E2E8F0'} strokeWidth="4" />

          {/* Active Fleet Primary Route Line (Bengaluru → Chennai) */}
          <path d="M 180 450 Q 280 620 420 380 T 680 250" fill="none" stroke="#2563EB" strokeWidth="3.5" strokeDasharray="6 4" opacity="0.85" />
          <text x="320" y="475" fill="#2563EB" fontSize="10.5" fontWeight="700" letterSpacing="0.3">
            Bengaluru → Chennai Corridor
          </text>

          {/* Geofence Region Alpha Polygon */}
          <path d="M 320 180 L 520 190 L 580 320 L 380 340 Z" fill="rgba(37, 99, 235, 0.05)" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="5 4" />
          <text x="340" y="210" fill="#2563EB" fontSize="10" fontWeight="700" letterSpacing="0.5" opacity="0.85">
            GEOFENCE REGION ALPHA
          </text>
        </svg>

        {/* Vertically Stacked Top-Right Map Control Buttons (w-9 h-9) */}
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          zIndex: 25,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          <button
            className="map-control-btn-stacked"
            onClick={() => setZoomLevel(prev => Math.min(prev + 1, 18))}
            title="Zoom In (+)"
            aria-label="Zoom in"
          >
            <ZoomIn size={15} color="#0F172A" />
          </button>

          <button
            className="map-control-btn-stacked"
            onClick={() => setZoomLevel(prev => Math.max(prev - 1, 6))}
            title="Zoom Out (−)"
            aria-label="Zoom out"
          >
            <ZoomOut size={15} color="#0F172A" />
          </button>

          <button
            className="map-control-btn-stacked"
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            aria-label="Toggle Fullscreen"
          >
            <Maximize2 size={14} color="#0F172A" />
          </button>

          <button
            className="map-control-btn-stacked"
            onClick={handleRecenter}
            title="Recenter Map View"
            aria-label="Recenter map view"
          >
            <RotateCcw size={14} color="#2563EB" />
          </button>
        </div>

        {/* Interactive Vehicle Markers */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 15 }}>
          {SAMPLE_MARKERS.map((v) => {
            const isSelected = selectedId === v.id;
            const statusColor = getStatusColor(v.status);
            const isAnimated = v.status === 'Moving' || v.status === 'Online';

            return (
              <div
                key={v.id}
                onClick={() => handleSelect(v.id)}
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
                  transition: 'transform 0.15s ease',
                  zIndex: isSelected ? 20 : 10,
                }}
                role="button"
                tabIndex={0}
                aria-label={`Vehicle ${v.id}: ${v.status}${v.speed > 0 ? `, ${v.speed} km/h` : ''}`}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelect(v.id); } }}
              >
                {/* Marker Pill Badge */}
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
                  boxShadow: isSelected
                    ? '0 4px 16px rgba(37, 99, 235, 0.35), 0 0 0 2px #2563EB'
                    : '0 2px 8px rgba(15, 23, 42, 0.12)',
                  border: isSelected ? '2px solid #2563EB' : '1px solid #E2E8F0',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}>
                  <span
                    style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      backgroundColor: statusColor, display: 'inline-block',
                      boxShadow: isAnimated ? `0 0 0 3px ${statusColor}33` : 'none',
                    }}
                    aria-hidden="true"
                  />
                  <Truck size={12} />
                  <span>{v.id}</span>
                  {v.speed > 0 ? (
                    <span style={{ fontSize: '10px', color: isSelected ? '#60A5FA' : '#2563EB', fontWeight: 600 }}>
                      {v.speed} km/h
                    </span>
                  ) : (
                    <span style={{ fontSize: '10px', color: isSelected ? '#94A3B8' : '#64748B', fontWeight: 500 }}>
                      {v.status}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Vehicle HUD Overlay */}
        {selectedVehicle && <VehicleHUD vehicle={selectedVehicle} />}

        {/* Bottom Legend Bar */}
        <div className="map-legend">
          <div className="map-legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#10B981' }} />
            <span>Online</span>
          </div>
          <div className="map-legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#2563EB' }} />
            <span>Moving</span>
          </div>
          <div className="map-legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#F59E0B' }} />
            <span>Idle</span>
          </div>
          <div className="map-legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#EF4444' }} />
            <span>Offline</span>
          </div>
          <div className="map-legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#7C3AED' }} />
            <span>Maintenance</span>
          </div>
        </div>

        {/* Bottom Left Scale & Compass */}
        <div className="map-scale-compass">
          <div className="map-zoom-badge">
            Zoom {zoomLevel}x
          </div>
          <div className="map-compass-btn" title="North Alignment">
            <Compass size={15} color="#2563EB" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(MapPlaceholder);
