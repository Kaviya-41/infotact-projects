/**
 * MapPlaceholder.tsx – Live Fleet Map Component
 * Centerpiece hero visualizer with top controls (Live, Satellite, Traffic, Fullscreen),
 * vehicle markers, bottom status legend, and vehicle drawer click trigger.
 */

import React, { useState, useCallback, memo } from 'react';
import { Compass, ZoomIn, ZoomOut, Layers, Navigation, Truck, Maximize2 } from 'lucide-react';
import VehicleHUD from './dashboard/VehicleHUD';
import '../styles/dashboard.css';

interface VehicleMarker {
  id: string;
  name: string;
  driver: string;
  status: 'Moving' | 'Stopped' | 'Offline' | 'Maintenance' | 'Idle';
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
  { id: 'FLT-002', name: 'Cascadia #02', driver: 'Rohan Sharma', status: 'Moving', speed: 48, fuel: 82, tripProgress: 45, eta: '04:10 PM', route: { origin: 'Bengaluru', destination: 'Mysore' }, x: 28, y: 62 },
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

  return (
    <div className="map-container-card" style={height ? { height: `${height}px` } : { flex: 1 }}>
      {/* Top Map Header Controls */}
      <div className="map-header">
        <div className="map-title-badge">
          <Navigation size={16} color="#2563EB" />
          <span>Live Fleet Map</span>
          <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500 }}>
            (Real-time vehicle positions)
          </span>
        </div>

        {/* Top-right controls: Live Satellite Traffic Fullscreen */}
        <div className="map-controls-group">
          {(['Live', 'Satellite', 'Traffic'] as const).map((mode) => (
            <button
              key={mode}
              className="map-btn"
              style={{
                backgroundColor: mapMode === mode ? '#2563EB' : '#FFFFFF',
                color: mapMode === mode ? '#FFFFFF' : '#475569',
                borderColor: mapMode === mode ? '#2563EB' : '#E2E8F0',
                fontWeight: mapMode === mode ? 700 : 500,
              }}
              onClick={() => setMapMode(mode)}
            >
              {mode === 'Satellite' && <Layers size={13} style={{ marginRight: '3px' }} />}
              {mode}
            </button>
          ))}

          <button
            className="map-btn"
            title="Fullscreen"
            aria-label="Toggle Fullscreen"
            onClick={() => {
              const el = document.getElementById('fleet-map-stage');
              if (el) el.requestFullscreen?.();
            }}
          >
            <Maximize2 size={13} />
          </button>

          <button className="map-btn" onClick={() => setZoomLevel(prev => Math.min(prev + 1, 18))} title="Zoom In" aria-label="Zoom in">
            <ZoomIn size={13} />
          </button>
          <button className="map-btn" onClick={() => setZoomLevel(prev => Math.max(prev - 1, 6))} title="Zoom Out" aria-label="Zoom out">
            <ZoomOut size={13} />
          </button>
        </div>
      </div>

      {/* Map Visualizer */}
      <div className="map-visualizer" id="fleet-map-stage">
        {/* Canvas for Week 3 */}
        <canvas
          id="fleet-map-canvas"
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1,
          }}
        />

        {/* SVG Map Background */}
        <svg
          width="100%" height="100%"
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: mapMode === 'Satellite' ? '#0F172A' : '#F8FAFC' }}
        >
          {/* Grid Pattern */}
          <defs>
            <pattern id="light-map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke={mapMode === 'Satellite' ? '#1E293B' : '#E2E8F0'} strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#light-map-grid)" />

          {/* Primary Highways */}
          <path d="M -50 180 Q 300 220 600 150 T 1200 300" fill="none" stroke={mapMode === 'Satellite' ? '#334155' : '#CBD5E1'} strokeWidth="6" strokeLinecap="round" />
          <path d="M 220 -50 Q 250 250 400 600" fill="none" stroke={mapMode === 'Satellite' ? '#334155' : '#CBD5E1'} strokeWidth="6" strokeLinecap="round" />
          <path d="M -50 420 Q 500 380 1100 480" fill="none" stroke={mapMode === 'Satellite' ? '#1E293B' : '#E2E8F0'} strokeWidth="4" />

          {/* Active Fleet Route (Blue Highlight) */}
          <path d="M 180 450 Q 280 620 420 380 T 680 250" fill="none" stroke="#2563EB" strokeWidth="3" strokeDasharray="6 4" opacity="0.7" />

          {/* Geofence Region */}
          <path d="M 320 180 L 520 190 L 580 320 L 380 340 Z" fill="rgba(37, 99, 235, 0.04)" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="4 4" />
          <text x="340" y="210" fill="#2563EB" fontSize="10" fontWeight="600" letterSpacing="0.5" opacity="0.7">
            GEOFENCE ZONE ALPHA
          </text>
        </svg>

        {/* Vehicle Markers */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 5 }}>
          {SAMPLE_MARKERS.map((v) => {
            const isSelected = selectedId === v.id;
            const statusColor = v.status === 'Moving'
              ? '#10B981'
              : v.status === 'Idle'
                ? '#F59E0B'
                : v.status === 'Maintenance'
                  ? '#8B5CF6'
                  : v.status === 'Offline'
                    ? '#EF4444'
                    : '#2563EB';

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
                  transition: 'transform 0.2s ease',
                }}
                role="button"
                tabIndex={0}
                aria-label={`Vehicle ${v.id}: ${v.status}${v.speed > 0 ? `, ${v.speed} km/h` : ''}`}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelect(v.id); } }}
              >
                {/* Marker Badge */}
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
                    ? '0 4px 20px rgba(37, 99, 235, 0.35), 0 0 0 2px #2563EB'
                    : '0 2px 8px rgba(15, 23, 42, 0.1)',
                  border: isSelected ? '2px solid #2563EB' : '1px solid #E2E8F0',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                }}>
                  <span style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    backgroundColor: statusColor, display: 'inline-block',
                    boxShadow: v.status === 'Moving' ? `0 0 0 3px ${statusColor}33` : 'none',
                  }} aria-hidden="true" />
                  <Truck size={12} />
                  <span>{v.id}</span>
                  {v.speed > 0 && (
                    <span style={{ fontSize: '10px', color: isSelected ? '#60A5FA' : '#2563EB', fontWeight: 600 }}>
                      {v.speed} km/h
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Vehicle HUD Overlay */}
        {selectedVehicle && <VehicleHUD vehicle={selectedVehicle} />}

        {/* Bottom Legend: Online Moving Idle Offline Maintenance */}
        <div style={{
          position: 'absolute', bottom: '16px', left: '16px', zIndex: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)',
          border: '1px solid #E2E8F0', borderRadius: '10px', padding: '8px 14px',
          display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12px',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} aria-hidden="true" />
            <span style={{ fontWeight: 600, color: '#334155' }}>Online</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2563EB' }} aria-hidden="true" />
            <span style={{ fontWeight: 600, color: '#334155' }}>Moving</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B' }} aria-hidden="true" />
            <span style={{ fontWeight: 600, color: '#334155' }}>Idle</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444' }} aria-hidden="true" />
            <span style={{ fontWeight: 600, color: '#334155' }}>Offline</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#8B5CF6' }} aria-hidden="true" />
            <span style={{ fontWeight: 600, color: '#334155' }}>Maintenance</span>
          </div>
        </div>

        {/* Bottom Right Scale & Compass */}
        <div style={{
          position: 'absolute', bottom: '16px', right: '16px', zIndex: 10,
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #E2E8F0',
            borderRadius: '8px', padding: '6px 12px', fontSize: '11px',
            fontWeight: 600, color: '#64748B',
          }}>
            Zoom {zoomLevel}x
          </div>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
          }}>
            <Compass size={18} color="#2563EB" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(MapPlaceholder);
