/**
 * MapPlaceholder.tsx – Live Fleet Command Map Component
 * Real-Time Enterprise Fleet Telemetry Map with:
 * - Header: "Live Fleet Map", Subtitle: "Real-time vehicle positions and operational status"
 * - Live telemetry badge: "● LIVE 60Hz" & "42 Vehicles Tracked"
 * - Mode controls: Live, Satellite, Traffic + Layer toggles (Vehicles, Routes, Geofences)
 * - Stacked top-right controls: Zoom In (+), Zoom Out (-), Recenter, Fullscreen (40px rounded-xl buttons)
 * - Vehicle markers: Status dot, 🚚 vehicle icon, Vehicle ID, speed/status with live pulse
 * - Active route corridor with waypoints (Bengaluru → Hosur → Vellore → Chennai)
 * - Geofence Region Alpha with vehicle counter badge
 * - Bottom legend and interactive vehicle HUD overlay
 */

import React, { useState, useCallback, memo } from 'react';
import {
  Layers, Navigation, Truck, Maximize2, ZoomIn, ZoomOut, Compass,
  RotateCcw, Radio, Shield, MapPin
} from 'lucide-react';
import VehicleHUD from './dashboard/VehicleHUD';
import '../styles/dashboard.css';

export interface VehicleMarker {
  id: string;
  name: string;
  driver: string;
  status: 'Online' | 'Moving' | 'Idle' | 'Offline' | 'Maintenance';
  speed: number;
  fuel: number;
  tripProgress: number;
  eta: string;
  route: { origin: string; destination: string };
  engineStatus?: string;
  lastUpdate?: string;
  x: number;
  y: number;
}

export const SAMPLE_MARKERS: VehicleMarker[] = [
  { id: 'FLT-001', name: 'Volvo FH16 #01', driver: 'Arjun Kumar', status: 'Moving', speed: 68, fuel: 72, tripProgress: 72, eta: '02:45 PM', route: { origin: 'Bengaluru', destination: 'Hosur' }, engineStatus: 'Optimal', lastUpdate: 'Just now', x: 42, y: 38 },
  { id: 'FLT-002', name: 'Cascadia #02', driver: 'Rohan Sharma', status: 'Online', speed: 48, fuel: 82, tripProgress: 45, eta: '04:10 PM', route: { origin: 'Bengaluru', destination: 'Mysore' }, engineStatus: 'Normal', lastUpdate: '1s ago', x: 28, y: 62 },
  { id: 'FLT-003', name: 'Kenworth #03', driver: 'Rajesh Verma', status: 'Idle', speed: 0, fuel: 34, tripProgress: 90, eta: '04:15 PM', route: { origin: 'Mumbai', destination: 'Pune' }, engineStatus: 'High Temp 112°C', lastUpdate: 'Just now', x: 46, y: 25 },
  { id: 'FLT-004', name: 'Freightliner #04', driver: 'Karthik S', status: 'Moving', speed: 54, fuel: 48, tripProgress: 48, eta: '05:20 PM', route: { origin: 'Bengaluru', destination: 'Chennai' }, engineStatus: 'Optimal', lastUpdate: 'Just now', x: 60, y: 28 },
  { id: 'FLT-007', name: 'Scania R500 #07', driver: 'Marcus Vance', status: 'Moving', speed: 64, fuel: 18, tripProgress: 88, eta: '12:30 PM', route: { origin: 'Delhi', destination: 'Jaipur' }, engineStatus: 'Normal (Low Fuel)', lastUpdate: 'Just now', x: 18, y: 45 },
  { id: 'FLT-008', name: 'Tata Prima #08', driver: 'Vikram Singh', status: 'Maintenance', speed: 0, fuel: 60, tripProgress: 0, eta: '—', route: { origin: 'Depot', destination: 'Service' }, engineStatus: 'Brake Inspection', lastUpdate: '10m ago', x: 35, y: 80 },
  { id: 'FLT-010', name: 'Isuzu Giga #10', driver: 'Suresh Patel', status: 'Offline', speed: 0, fuel: 40, tripProgress: 15, eta: '—', route: { origin: 'Ahmedabad', destination: 'Surat' }, engineStatus: 'Disconnected', lastUpdate: '5m ago', x: 78, y: 52 },
  { id: 'FLT-012', name: 'Mercedes Sprinter #12', driver: 'Amit Roy', status: 'Moving', speed: 72, fuel: 88, tripProgress: 35, eta: '03:15 PM', route: { origin: 'Pune', destination: 'Mumbai' }, engineStatus: 'Optimal', lastUpdate: 'Just now', x: 52, y: 66 },
  { id: 'FLT-015', name: 'Heavy Truck #15', driver: 'Vikram Malhotra', status: 'Online', speed: 40, fuel: 65, tripProgress: 60, eta: '06:00 PM', route: { origin: 'Chennai', destination: 'Nellore' }, engineStatus: 'Normal', lastUpdate: 'Just now', x: 82, y: 28 },
];

interface MapPlaceholderProps {
  height?: number;
  onSelectVehicle?: (id: string) => void;
  selectedVehicleId?: string | null;
  onOpenDrawer?: (id: string) => void;
}

const MapPlaceholder: React.FC<MapPlaceholderProps> = ({
  height,
  onSelectVehicle,
  selectedVehicleId: externalSelectedId,
  onOpenDrawer,
}) => {
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>('FLT-004');
  const [zoomLevel, setZoomLevel] = useState(12);
  const [mapMode, setMapMode] = useState<'Live' | 'Satellite' | 'Traffic'>('Live');
  const [layerVehicles, setLayerVehicles] = useState(true);
  const [layerRoutes, setLayerRoutes] = useState(true);
  const [layerGeofence, setLayerGeofence] = useState(true);

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
      style={height ? { height: `${height}px` } : { flex: 1, minHeight: '560px' }}
    >
      {/* Top Map Header Controls */}
      <div className="map-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', flexWrap: 'wrap', gap: '10px' }}>
        <div className="map-title-badge">
          <div className="map-title-icon">
            <Navigation size={16} color="#2563EB" />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>
              Live Fleet Map
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 400 }}>
              Real-time vehicle positions and operational status
            </div>
          </div>
        </div>

        {/* Center / Right controls: Live Telemetry, Layer Toggles, Mode Segment */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Live Telemetry Ping */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '4px 10px', borderRadius: '20px',
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            fontSize: '11px', fontWeight: 700, color: '#10B981'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', display: 'inline-block', boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.25)' }} />
            <span>LIVE 60Hz</span>
          </div>

          {/* 42 Vehicles Tracked Badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            padding: '4px 10px', borderRadius: '20px',
            backgroundColor: '#F1F5F9', border: '1px solid #E2E8F0',
            fontSize: '11px', fontWeight: 600, color: '#0F172A'
          }}>
            <Truck size={12} color="#2563EB" />
            <span>42 Vehicles Tracked</span>
          </div>

          {/* Map Layer Mode Controls: Live | Satellite | Traffic */}
          <div className="map-controls-group">
            {(['Live', 'Satellite', 'Traffic'] as const).map((mode) => (
              <button
                key={mode}
                className={`map-btn ${mapMode === mode ? 'active' : ''}`}
                onClick={() => setMapMode(mode)}
                title={`Switch to ${mode} map view`}
              >
                {mode === 'Satellite' && <Layers size={12} />}
                {mode === 'Traffic' && <Radio size={12} />}
                <span>{mode}</span>
              </button>
            ))}
          </div>

          {/* Layer Filter Toggles */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={() => setLayerVehicles(prev => !prev)}
              style={{
                fontSize: '11px', fontWeight: 600, padding: '4px 8px', borderRadius: '6px',
                border: '1px solid #E2E8F0',
                backgroundColor: layerVehicles ? '#EFF6FF' : '#FFFFFF',
                color: layerVehicles ? '#2563EB' : '#64748B',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px'
              }}
              title="Toggle Vehicles Layer"
            >
              <Truck size={11} />
              <span>Vehicles</span>
            </button>

            <button
              onClick={() => setLayerRoutes(prev => !prev)}
              style={{
                fontSize: '11px', fontWeight: 600, padding: '4px 8px', borderRadius: '6px',
                border: '1px solid #E2E8F0',
                backgroundColor: layerRoutes ? '#EFF6FF' : '#FFFFFF',
                color: layerRoutes ? '#2563EB' : '#64748B',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px'
              }}
              title="Toggle Routes Layer"
            >
              <MapPin size={11} />
              <span>Routes</span>
            </button>

            <button
              onClick={() => setLayerGeofence(prev => !prev)}
              style={{
                fontSize: '11px', fontWeight: 600, padding: '4px 8px', borderRadius: '6px',
                border: '1px solid #E2E8F0',
                backgroundColor: layerGeofence ? '#EFF6FF' : '#FFFFFF',
                color: layerGeofence ? '#2563EB' : '#64748B',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px'
              }}
              title="Toggle Geofences Layer"
            >
              <Shield size={11} />
              <span>Geofence</span>
            </button>
          </div>
        </div>
      </div>

      {/* Map Visualizer Viewport */}
      <div className="map-visualizer" id="fleet-map-stage" style={{ position: 'relative', minHeight: '480px', flex: 1, overflow: 'hidden' }}>
        {/* Canvas for Hardware Acceleration */}
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
            <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#0EA5E9" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#light-map-grid)" />

          {/* Primary Arterial Road Lines */}
          <path d="M -50 180 Q 300 220 600 150 T 1400 300" fill="none" stroke={mapMode === 'Satellite' ? '#334155' : mapMode === 'Traffic' ? '#10B981' : '#CBD5E1'} strokeWidth={mapMode === 'Traffic' ? '7' : '6'} strokeLinecap="round" opacity={mapMode === 'Traffic' ? '0.7' : '1'} />
          <path d="M 220 -50 Q 250 250 400 700" fill="none" stroke={mapMode === 'Satellite' ? '#334155' : mapMode === 'Traffic' ? '#F59E0B' : '#CBD5E1'} strokeWidth={mapMode === 'Traffic' ? '7' : '6'} strokeLinecap="round" opacity={mapMode === 'Traffic' ? '0.7' : '1'} />
          <path d="M -50 420 Q 500 380 1400 480" fill="none" stroke={mapMode === 'Satellite' ? '#1E293B' : mapMode === 'Traffic' ? '#10B981' : '#E2E8F0'} strokeWidth="4" />
          <path d="M 500 -50 Q 600 300 850 700" fill="none" stroke={mapMode === 'Satellite' ? '#1E293B' : mapMode === 'Traffic' ? '#EF4444' : '#E2E8F0'} strokeWidth="4" />

          {/* Secondary Feeder Roads */}
          <path d="M 100 100 L 300 220 L 450 180" fill="none" stroke={mapMode === 'Satellite' ? '#1E293B' : '#E2E8F0'} strokeWidth="2.5" />
          <path d="M 350 450 L 550 500 L 750 400" fill="none" stroke={mapMode === 'Satellite' ? '#1E293B' : '#E2E8F0'} strokeWidth="2.5" />

          {/* Active Fleet Primary Route Corridor (Bengaluru → Chennai) */}
          {layerRoutes && (
            <g id="route-corridor">
              {/* Route Glow */}
              <path d="M 180 450 Q 280 620 420 380 T 780 250" fill="none" stroke="rgba(37, 99, 235, 0.15)" strokeWidth="12" strokeLinecap="round" />
              {/* Route Main Line */}
              <path d="M 180 450 Q 280 620 420 380 T 780 250" fill="none" stroke="url(#routeGrad)" strokeWidth="4" strokeDasharray="8 5" strokeLinecap="round" />

              {/* Waypoint 1: Bengaluru Origin */}
              <circle cx="180" cy="450" r="7" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
              <text x="140" y="475" fill="#0F172A" fontSize="10.5" fontWeight="700">Bengaluru Depot</text>

              {/* Waypoint 2: Hosur Toll */}
              <circle cx="340" cy="510" r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
              <text x="350" y="525" fill="#64748B" fontSize="9.5" fontWeight="600">Hosur Toll (KM 42)</text>

              {/* Waypoint 3: Vellore Hub */}
              <circle cx="560" cy="310" r="5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
              <text x="570" y="325" fill="#64748B" fontSize="9.5" fontWeight="600">Vellore Hub (KM 148)</text>

              {/* Waypoint 4: Chennai Destination */}
              <circle cx="780" cy="250" r="7" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
              <text x="740" y="275" fill="#0F172A" fontSize="10.5" fontWeight="700">Chennai Port Terminal</text>

              {/* Corridor Route Label */}
              <rect x="330" y="390" width="190" height="22" rx="6" fill="#FFFFFF" stroke="#DBEAFE" />
              <text x="340" y="405" fill="#2563EB" fontSize="10" fontWeight="700" letterSpacing="0.4">
                Bengaluru ──→ Chennai Corridor
              </text>
            </g>
          )}

          {/* Geofence Region Alpha Polygon */}
          {layerGeofence && (
            <g id="geofence-alpha">
              <path d="M 380 140 L 660 150 L 710 320 L 410 340 Z" fill="rgba(37, 99, 235, 0.05)" stroke="#2563EB" strokeWidth="1.75" strokeDasharray="6 4" />
            </g>
          )}
        </svg>

        {/* Floating Geofence Label Chip inside Map */}
        {layerGeofence && (
          <div style={{
            position: 'absolute', top: '155px', left: '420px', zIndex: 12,
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '4px 10px', borderRadius: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #BFDBFE',
            boxShadow: '0 2px 6px rgba(37, 99, 235, 0.08)',
            pointerEvents: 'none'
          }}>
            <Shield size={11} color="#2563EB" />
            <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#2563EB', letterSpacing: '0.3px' }}>
              Geofence Region Alpha
            </span>
            <span style={{
              fontSize: '9.5px', fontWeight: 700, color: '#10B981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              padding: '1px 5px', borderRadius: '4px'
            }}>
              ● 2 Vehicles Inside
            </span>
          </div>
        )}

        {/* Vertically Stacked 40px × 40px Top-Right Map Controls */}
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
            style={{ width: '40px', height: '40px', borderRadius: '12px' }}
          >
            <ZoomIn size={16} color="#0F172A" />
          </button>

          <button
            className="map-control-btn-stacked"
            onClick={() => setZoomLevel(prev => Math.max(prev - 1, 6))}
            title="Zoom Out (−)"
            aria-label="Zoom out"
            style={{ width: '40px', height: '40px', borderRadius: '12px' }}
          >
            <ZoomOut size={16} color="#0F172A" />
          </button>

          <button
            className="map-control-btn-stacked"
            onClick={handleRecenter}
            title="Recenter Map View"
            aria-label="Recenter map view"
            style={{ width: '40px', height: '40px', borderRadius: '12px' }}
          >
            <RotateCcw size={15} color="#2563EB" />
          </button>

          <button
            className="map-control-btn-stacked"
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            aria-label="Toggle Fullscreen"
            style={{ width: '40px', height: '40px', borderRadius: '12px' }}
          >
            <Maximize2 size={15} color="#0F172A" />
          </button>
        </div>

        {/* Interactive Floating Vehicle Marker Chips */}
        {layerVehicles && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 15, pointerEvents: 'none' }}>
            {SAMPLE_MARKERS.map((v) => {
              const isSelected = selectedId === v.id;
              const statusColor = getStatusColor(v.status);
              const isMoving = v.status === 'Moving';
              const isOnline = v.status === 'Online';
              const isPulse = isMoving || isOnline;

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
                    pointerEvents: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'transform 0.15s ease',
                    zIndex: isSelected ? 24 : 10,
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Vehicle ${v.id}: ${v.status}${v.speed > 0 ? `, ${v.speed} km/h` : ''}`}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelect(v.id); } }}
                >
                  {/* Floating Marker Chip */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: isSelected ? '#0F172A' : '#FFFFFF',
                    color: isSelected ? '#FFFFFF' : '#0F172A',
                    padding: '5px 12px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontWeight: 700,
                    boxShadow: isSelected
                      ? '0 6px 20px rgba(37, 99, 235, 0.4), 0 0 0 2px #2563EB'
                      : '0 2px 8px rgba(15, 23, 42, 0.1)',
                    border: isSelected ? '2px solid #2563EB' : '1px solid #E2E8F0',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                  }}>
                    {/* Pulsing Status Indicator Dot */}
                    <span
                      style={{
                        width: '7px', height: '7px', borderRadius: '50%',
                        backgroundColor: statusColor, display: 'inline-block',
                        boxShadow: isPulse ? `0 0 0 3px ${statusColor}33` : 'none',
                        animation: isPulse ? 'header-pulse 2s ease-in-out infinite' : 'none',
                      }}
                      aria-hidden="true"
                    />
                    <Truck size={12} color={isSelected ? '#60A5FA' : '#2563EB'} />
                    <span>{v.id}</span>
                    {v.speed > 0 ? (
                      <span style={{ fontSize: '10px', color: isSelected ? '#93C5FD' : '#2563EB', fontWeight: 700 }}>
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
        )}

        {/* Selected Vehicle Floating HUD Overlay */}
        {selectedVehicle && (
          <VehicleHUD
            vehicle={selectedVehicle}
            onClose={() => setInternalSelectedId(null)}
            onOpenDrawer={onOpenDrawer}
          />
        )}

        {/* Bottom-Left Legend Bar */}
        <div className="map-legend" style={{
          position: 'absolute', bottom: '16px', left: '16px', zIndex: 10,
          background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)',
          border: '1px solid #E2E8F0', borderRadius: '10px',
          padding: '7px 14px', display: 'flex', alignItems: 'center', gap: '14px',
          fontSize: '11.5px', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.06)'
        }}>
          <div className="map-legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#10B981', width: '7px', height: '7px', borderRadius: '50%' }} />
            <span>Online</span>
          </div>
          <div className="map-legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#2563EB', width: '7px', height: '7px', borderRadius: '50%' }} />
            <span>Moving</span>
          </div>
          <div className="map-legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#F59E0B', width: '7px', height: '7px', borderRadius: '50%' }} />
            <span>Idle</span>
          </div>
          <div className="map-legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#EF4444', width: '7px', height: '7px', borderRadius: '50%' }} />
            <span>Offline</span>
          </div>
          <div className="map-legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#7C3AED', width: '7px', height: '7px', borderRadius: '50%' }} />
            <span>Maintenance</span>
          </div>
        </div>

        {/* Bottom Right Scale & Compass */}
        <div className="map-scale-compass" style={{
          position: 'absolute', bottom: '16px', right: '16px', zIndex: 10,
          display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          <div className="map-zoom-badge" style={{
            background: 'rgba(255, 255, 255, 0.95)', border: '1px solid #E2E8F0',
            borderRadius: '8px', padding: '5px 10px', fontSize: '11px', fontWeight: 600, color: '#64748B'
          }}>
            Zoom {zoomLevel}x
          </div>
          <div className="map-compass-btn" title="North Alignment" style={{
            width: '32px', height: '32px', borderRadius: '50%', background: '#FFFFFF',
            border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.06)'
          }}>
            <Compass size={16} color="#2563EB" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(MapPlaceholder);

