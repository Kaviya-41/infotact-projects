/**
 * MapPlaceholder.tsx
 * Live Map section – enhanced static map with animated routes and vehicle markers.
 *
 * Week 1 – Static visual map (no Canvas API, no Google Maps, no Socket.io).
 * Week 3 – Canvas Renderer will mount inside #fleet-map-canvas (already in DOM).
 *
 * UI Enhancement v2: Framer Motion entrance, bottom status bar,
 * animated SVG route network, enhanced markers with tooltip, larger height.
 * All existing state, canvas element, marker data, layer controls preserved.
 */

import React, { memo, useState } from 'react';
import { motion } from 'framer-motion';

// ── Types ──────────────────────────────────────────────────────────────────────

type MapLayer = 'satellite' | 'traffic' | 'terrain';

interface MapPlaceholderProps {
  /** Height of the map area in pixels. Defaults to 420. */
  height?: number;
}

interface VehicleMarker {
  id: string;
  label: string;
  status: 'moving' | 'stopped' | 'offline';
  top: string;
  left: string;
}

// ── Dummy Markers ──────────────────────────────────────────────────────────────

const VEHICLE_MARKERS: VehicleMarker[] = [
  { id: 'FLT-001', label: 'FLT-001', status: 'moving',  top: '22%',  left: '18%'  },
  { id: 'FLT-002', label: 'FLT-002', status: 'moving',  top: '55%',  left: '38%'  },
  { id: 'FLT-003', label: 'FLT-003', status: 'stopped', top: '38%',  left: '58%'  },
  { id: 'FLT-004', label: 'FLT-004', status: 'moving',  top: '72%',  left: '72%'  },
  { id: 'FLT-005', label: 'FLT-005', status: 'offline', top: '18%',  left: '78%'  },
  { id: 'FLT-007', label: 'FLT-007', status: 'moving',  top: '60%',  left: '20%'  },
  { id: 'FLT-008', label: 'FLT-008', status: 'stopped', top: '82%',  left: '48%'  },
  { id: 'FLT-009', label: 'FLT-009', status: 'moving',  top: '30%',  left: '88%'  },
  { id: 'FLT-010', label: 'FLT-010', status: 'offline', top: '78%',  left: '88%'  },
];

const MARKER_ICONS: Record<string, string> = {
  'FLT-001': '🚛', 'FLT-002': '🚐', 'FLT-003': '🚛', 'FLT-004': '🚜',
  'FLT-005': '🚚', 'FLT-007': '🚛', 'FLT-008': '🚐', 'FLT-009': '🚜', 'FLT-010': '🚛',
};

const DUMMY_DETAILS: Record<string, { driver: string; speed: string; fuel: string; battery: string; gpsAccuracy: string; lastUpdated: string }> = {
  'FLT-001': { driver: 'Rahul Kumar', speed: '65 km/h', fuel: '84%', battery: '96%', gpsAccuracy: '±1.2m (HDOP 0.7)', lastUpdated: '2 sec ago' },
  'FLT-002': { driver: 'Arjun Singh', speed: '48 km/h', fuel: '72%', battery: '91%', gpsAccuracy: '±1.5m (HDOP 0.8)', lastUpdated: '5 sec ago' },
  'FLT-003': { driver: 'Kiran Patel', speed: '0 km/h (Stopped)', fuel: '18%', battery: '88%', gpsAccuracy: '±0.9m (HDOP 0.6)', lastUpdated: '12 sec ago' },
  'FLT-004': { driver: 'Naveen Reddy', speed: '72 km/h', fuel: '90%', battery: '98%', gpsAccuracy: '±1.1m (HDOP 0.7)', lastUpdated: '1 sec ago' },
  'FLT-005': { driver: 'Priya Sharma', speed: 'Offline', fuel: '64%', battery: '45%', gpsAccuracy: 'No Signal', lastUpdated: '4 min ago' },
  'FLT-007': { driver: 'Suresh Babu', speed: '68 km/h', fuel: '79%', battery: '94%', gpsAccuracy: '±1.0m (HDOP 0.6)', lastUpdated: '3 sec ago' },
  'FLT-008': { driver: 'Deepak Menon', speed: '0 km/h (Stopped)', fuel: '55%', battery: '82%', gpsAccuracy: '±1.4m (HDOP 0.8)', lastUpdated: '8 sec ago' },
  'FLT-009': { driver: 'Akash Verma', speed: '61 km/h', fuel: '87%', battery: '95%', gpsAccuracy: '±1.2m (HDOP 0.7)', lastUpdated: '4 sec ago' },
  'FLT-010': { driver: 'Mohan Das', speed: 'Offline', fuel: '32%', battery: '30%', gpsAccuracy: 'Signal Lost', lastUpdated: '18 min ago' },
};

// ── Vehicle Marker Sub-component ───────────────────────────────────────────────

const Marker: React.FC<{ marker: VehicleMarker; index: number; onSelect: (m: VehicleMarker) => void }> = memo(({ marker, index, onSelect }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className={`map-marker map-marker--${marker.status}`}
      style={{ top: marker.top, left: marker.left }}
      role="button"
      tabIndex={0}
      aria-label={`${marker.id} – ${marker.status}`}
      onClick={() => onSelect(marker)}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(marker)}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.3 + index * 0.06, type: 'spring', stiffness: 260 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.35, zIndex: 25 }}
    >
      {/* Concentric pulse rings */}
      <span className="marker-pulse-ring" aria-hidden="true" />

      <div className="map-marker__pin" aria-hidden="true">
        <span className="map-marker__icon">{MARKER_ICONS[marker.id] ?? '🚛'}</span>
      </div>
      <span className="map-marker__label">{marker.label}</span>

      {/* Tooltip on hover */}
      <AnimatedTooltip visible={hovered} marker={marker} />
    </motion.div>
  );
});
Marker.displayName = 'Marker';

// ── Tooltip ────────────────────────────────────────────────────────────────────

const AnimatedTooltip: React.FC<{ visible: boolean; marker: VehicleMarker }> = memo(({ visible, marker }) => {
  const statusColors: Record<string, string> = {
    moving: '#31D67B', stopped: '#FFB547', offline: '#FF5C5C',
  };
  return (
    <motion.div
      className="map-marker-tooltip"
      initial={{ opacity: 0, y: 4, scale: 0.9 }}
      animate={visible ? { opacity: 1, y: -8, scale: 1 } : { opacity: 0, y: 4, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <strong>{marker.id}</strong>
      <span style={{ color: statusColors[marker.status] ?? '#8DA2C0' }}>
        ● {marker.status.charAt(0).toUpperCase() + marker.status.slice(1)} (Click details)
      </span>
    </motion.div>
  );
});
AnimatedTooltip.displayName = 'AnimatedTooltip';

// ── Live Vehicle Detail Modal Popup ────────────────────────────────────────────

const VehicleDetailModal: React.FC<{ marker: VehicleMarker; onClose: () => void }> = memo(({ marker, onClose }) => {
  const details = DUMMY_DETAILS[marker.id] ?? {
    driver: 'Unknown Driver', speed: '55 km/h', fuel: '75%', battery: '90%', gpsAccuracy: '±1.2m', lastUpdated: '1 sec ago',
  };

  return (
    <motion.div
      className="map-vehicle-popup-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="map-vehicle-popup-card"
        initial={{ opacity: 0, scale: 0.88, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.88, y: 20 }}
        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="popup-header">
          <div className="popup-title">
            <span className="popup-icon">{MARKER_ICONS[marker.id] ?? '🚛'}</span>
            <div>
              <h3>{marker.id}</h3>
              <span className={`popup-status-badge status-${marker.status}`}>
                ● {marker.status.toUpperCase()}
              </span>
            </div>
          </div>
          <button className="popup-close-btn" type="button" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="popup-grid">
          <div className="popup-item">
            <span className="popup-label">Driver Name</span>
            <span className="popup-value highlight">{details.driver}</span>
          </div>
          <div className="popup-item">
            <span className="popup-label">Current Speed</span>
            <span className="popup-value cyan">{details.speed}</span>
          </div>
          <div className="popup-item">
            <span className="popup-label">Fuel Tank Level</span>
            <div className="popup-progress-wrap">
              <span className="popup-value green">{details.fuel}</span>
              <div className="popup-progress-bar">
                <div className="popup-progress-fill" style={{ width: details.fuel }} />
              </div>
            </div>
          </div>
          <div className="popup-item">
            <span className="popup-label">EV Battery Health</span>
            <div className="popup-progress-wrap">
              <span className="popup-value purple">{details.battery}</span>
              <div className="popup-progress-bar">
                <div className="popup-progress-fill purple" style={{ width: details.battery }} />
              </div>
            </div>
          </div>
          <div className="popup-item">
            <span className="popup-label">GPS Telemetry Signal</span>
            <span className="popup-value">{details.gpsAccuracy}</span>
          </div>
          <div className="popup-item">
            <span className="popup-label">Last Pinged</span>
            <span className="popup-value muted">{details.lastUpdated}</span>
          </div>
        </div>

        <div className="popup-actions">
          <button type="button" className="popup-btn primary" onClick={() => alert(`Tracking telemetry stream for ${marker.id}`)}>
            📡 Live Telemetry Stream
          </button>
          <button type="button" className="popup-btn secondary" onClick={() => alert(`Comms signal sent to ${details.driver}`)}>
            💬 Contact Driver
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
});
VehicleDetailModal.displayName = 'VehicleDetailModal';

// ── Component ──────────────────────────────────────────────────────────────────

const MapPlaceholder: React.FC<MapPlaceholderProps> = ({ height = 540 }) => {
  const [activeLayer, setActiveLayer] = useState<MapLayer>('satellite');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [selectedMarker, setSelectedMarker] = useState<VehicleMarker | null>(null);

  const layers: { id: MapLayer; label: string }[] = [
    { id: 'satellite', label: 'Satellite' },
    { id: 'traffic',   label: 'Traffic'   },
    { id: 'terrain',   label: 'Terrain'   },
  ];

  const movingCount  = VEHICLE_MARKERS.filter(m => m.status === 'moving').length;
  const stoppedCount = VEHICLE_MARKERS.filter(m => m.status === 'stopped').length;
  const offlineCount = VEHICLE_MARKERS.filter(m => m.status === 'offline').length;

  return (
    <motion.section
      aria-label="Live command center map"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.15, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="map-card">
        {/* Card Header Toolbar */}
        <div className="map-card__header">
          <div className="map-card__title">
            <span aria-hidden="true">🗺</span>
            Command Center Live Map
            <span className="map-card__live-badge" role="status" aria-label="Status: Live">
              <span className="live-dot" aria-hidden="true" />
              LIVE 60Hz
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <div className="map-vehicle-count" aria-label="Active vehicles on map">
              🚚 {VEHICLE_MARKERS.length} Vehicles Online
            </div>
            <div className="map-gps-indicator" aria-label="GPS active">
              <span className="map-gps-dot" aria-hidden="true" />
              GPS Locked (12 Satellites)
            </div>

            {/* Floating Layer Toolbar */}
            <div className="map-card__controls" role="group" aria-label="Map layer selector">
              {layers.map((layer) => (
                <motion.button
                  key={layer.id}
                  id={`map-layer-${layer.id}`}
                  className={`map-btn${activeLayer === layer.id ? ' active' : ''}`}
                  type="button"
                  onClick={() => setActiveLayer(layer.id)}
                  aria-pressed={activeLayer === layer.id}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ duration: 0.12 }}
                >
                  {layer.label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Map Canvas Area */}
        <div
          className={`map-card__canvas-area map-layer--${activeLayer}`}
          style={{ minHeight: height }}
          aria-label="Interactive fleet command map"
        >
          {/* Canvas element retained for Week 3 compatibility */}
          <canvas id="fleet-map-canvas" aria-hidden="true" />

          {/* ── Static SVG Road Network, Labels, Geofence, & Route Lines ── */}
          <svg
            className="map-roads"
            viewBox="0 0 1000 500"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#00D4FF" />
              </marker>
              <filter id="geofenceGlow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>

            {/* Major Highways */}
            <line x1="0" y1="120" x2="1000" y2="110" stroke="#1c2d4a" strokeWidth="14" />
            <line x1="0" y1="122" x2="1000" y2="112" stroke="#4F8CFF" strokeWidth="2" strokeDasharray="30 15" opacity="0.5" />

            <line x1="0" y1="280" x2="1000" y2="295" stroke="#1c2d4a" strokeWidth="12" />
            <line x1="0" y1="282" x2="1000" y2="297" stroke="#00D4FF" strokeWidth="2" strokeDasharray="25 12" opacity="0.4" />

            <line x1="0" y1="420" x2="1000" y2="410" stroke="#16253d" strokeWidth="10" />

            {/* Vertical Arterial Roads */}
            <line x1="200" y1="0" x2="195" y2="500" stroke="#1c2d4a" strokeWidth="14" />
            <line x1="202" y1="0" x2="197" y2="500" stroke="#31D67B" strokeWidth="2" strokeDasharray="30 15" opacity="0.4" />

            <line x1="550" y1="0" x2="555" y2="500" stroke="#1c2d4a" strokeWidth="12" />
            <line x1="840" y1="0" x2="845" y2="500" stroke="#16253d" strokeWidth="10" />

            {/* Diagonal Bypass Expressways */}
            <path d="M 0 380 Q 250 300 500 280 T 1000 240" stroke="#1c2d4a" strokeWidth="8" fill="none" />
            <path d="M 0 50  Q 180 180 350 280 T 700 450"  stroke="#16253d" strokeWidth="6" fill="none" />

            {/* Intersections & Roundabouts */}
            <circle cx="200" cy="120" r="16" fill="none" stroke="#2a426d" strokeWidth="6" />
            <circle cx="550" cy="280" r="14" fill="none" stroke="#2a426d" strokeWidth="5" />
            <circle cx="840" cy="120" r="12" fill="none" stroke="#1c2d4a" strokeWidth="4" />

            {/* ── Road Labels ── */}
            <text x="70" y="102" fill="rgba(141,162,192,0.8)" fontSize="10" fontFamily="Space Grotesk, sans-serif" fontWeight="700" letterSpacing="1">NH-44 EXPRESSWAY</text>
            <text x="70" y="272" fill="rgba(141,162,192,0.7)" fontSize="9" fontFamily="Space Grotesk, sans-serif" fontWeight="600">OUTER RING ROAD</text>
            <text x="210" y="40" fill="rgba(141,162,192,0.7)" fontSize="9" fontFamily="Space Grotesk, sans-serif" fontWeight="600">AIRPORT ARTERIAL</text>
            <text x="562" y="40" fill="rgba(141,162,192,0.7)" fontSize="9" fontFamily="Space Grotesk, sans-serif" fontWeight="600">TECH PARK BYPASS</text>

            {/* ── City & Hub Labels ── */}
            <g transform="translate(180, 100)">
              <rect x="-6" y="-14" width="130" height="20" rx="4" fill="rgba(8,17,32,0.85)" stroke="rgba(79,140,255,0.4)" strokeWidth="1" />
              <text x="4" y="0" fill="#FFFFFF" fontSize="9.5" fontWeight="700" fontFamily="Inter, sans-serif">🏢 Bengaluru Central Hub</text>
            </g>

            <g transform="translate(530, 260)">
              <rect x="-6" y="-14" width="115" height="20" rx="4" fill="rgba(8,17,32,0.85)" stroke="rgba(0,212,255,0.4)" strokeWidth="1" />
              <text x="4" y="0" fill="#FFFFFF" fontSize="9.5" fontWeight="700" fontFamily="Inter, sans-serif">📦 Whitefield Depot</text>
            </g>

            <g transform="translate(740, 100)">
              <rect x="-6" y="-14" width="135" height="20" rx="4" fill="rgba(8,17,32,0.85)" stroke="rgba(49,214,123,0.4)" strokeWidth="1" />
              <text x="4" y="0" fill="#FFFFFF" fontSize="9.5" fontWeight="700" fontFamily="Inter, sans-serif">🏭 Electronic City Hub</text>
            </g>

            {/* ── Fake Geofence Restricted Circle ── */}
            <circle cx="750" cy="380" r="75" fill="rgba(255,92,92,0.08)" stroke="#FF5C5C" strokeWidth="1.8" strokeDasharray="6 4" filter="url(#geofenceGlow)" className="map-geofence-pulse" />
            <text x="750" y="384" textAnchor="middle" fill="#FF5C5C" fontSize="9" fontWeight="800" fontFamily="Space Grotesk, sans-serif" letterSpacing="0.8">
              ⚠ GEOFENCE ZONE ALPHA
            </text>

            {/* ── Animated glowing route lines with directional arrows ── */}
            <path d="M 180 220 Q 280 300 380 440" stroke="#4F8CFF" strokeWidth="2.5" fill="none"
              strokeDasharray="12 8" opacity="0.7" className="map-route-animated" markerEnd="url(#arrow)" />

            <path d="M 720 360 Q 790 200 880 300" stroke="#31D67B" strokeWidth="2.5" fill="none"
              strokeDasharray="12 8" opacity="0.65" className="map-route-animated" style={{ animationDelay: '-2s' }} markerEnd="url(#arrow)" />

            <path d="M 200 300 Q 320 310 550 280" stroke="#00D4FF" strokeWidth="2.5" fill="none"
              strokeDasharray="10 8" opacity="0.6" className="map-route-animated" style={{ animationDelay: '-4s' }} markerEnd="url(#arrow)" />

            {/* Hub Pulse Rings */}
            <circle cx="200" cy="290" r="6" fill="#4F8CFF" opacity="0.8" className="map-hub-pulse" />
            <circle cx="550" cy="200" r="6" fill="#31D67B" opacity="0.8" className="map-hub-pulse" style={{ animationDelay: '-1s' }} />
            <circle cx="750" cy="380" r="6" fill="#FF5C5C" opacity="0.8" className="map-hub-pulse" style={{ animationDelay: '-0.5s' }} />
          </svg>

          {/* ── Vehicle Markers ── */}
          <div className="map-markers-layer" aria-label="Vehicle positions">
            {VEHICLE_MARKERS.map((m, i) => (
              <Marker key={m.id} marker={m} index={i} onSelect={setSelectedMarker} />
            ))}
          </div>

          {/* ── Zoom + Compass + Scale Controls ── */}
          <div className="map-overlay-controls" aria-label="Map controls">
            <motion.button
              className="map-zoom-btn"
              type="button"
              aria-label="Zoom in"
              title="Zoom in"
              onClick={() => setZoomLevel(z => Math.min(z + 15, 200))}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              +
            </motion.button>
            <span className="map-zoom-level">{zoomLevel}%</span>
            <motion.button
              className="map-zoom-btn"
              type="button"
              aria-label="Zoom out"
              title="Zoom out"
              onClick={() => setZoomLevel(z => Math.max(z - 15, 50))}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              −
            </motion.button>

            {/* 360 North Compass Widget */}
            <div className="map-compass-box" title="North Compass">
              <span className="compass-n">N</span>
              <div className="compass-arrow" />
            </div>

            {/* Scale Bar Widget */}
            <div className="map-scale-bar" title="Map Scale">
              <span className="scale-line" />
              <span className="scale-text">5 km</span>
            </div>
          </div>

          {/* ── Map Legend ── */}
          <div className="map-legend" aria-label="Map legend">
            <span className="map-legend__title">Fleet Command Legend</span>
            <div className="map-legend__item">
              <span className="map-legend__dot map-legend__dot--moving"  aria-hidden="true" />
              Moving
            </div>
            <div className="map-legend__item">
              <span className="map-legend__dot map-legend__dot--stopped" aria-hidden="true" />
              Stopped
            </div>
            <div className="map-legend__item">
              <span className="map-legend__dot map-legend__dot--offline" aria-hidden="true" />
              Offline
            </div>
            <div className="map-legend__item">
              <span className="map-legend__dot" style={{ background: '#FF5C5C' }} aria-hidden="true" />
              Geofence
            </div>
          </div>

          {/* Floating Vehicle Detail Popup Modal */}
          {selectedMarker && (
            <VehicleDetailModal marker={selectedMarker} onClose={() => setSelectedMarker(null)} />
          )}

          <span className="map-placeholder-week-tag">
            <span aria-hidden="true">🛰</span>
            Command Center Mode: Active
          </span>
        </div>

        {/* ── Map Status Bar ── */}
        <div className="map-status-bar" aria-label="Map statistics">
          <div className="map-status-item">
            <span className="map-status-dot" style={{ background: '#31D67B' }} aria-hidden="true" />
            <span>{movingCount} Moving Vehicles</span>
          </div>
          <div className="map-status-sep" aria-hidden="true" />
          <div className="map-status-item">
            <span className="map-status-dot" style={{ background: '#FFB547' }} aria-hidden="true" />
            <span>{stoppedCount} Stopped</span>
          </div>
          <div className="map-status-sep" aria-hidden="true" />
          <div className="map-status-item">
            <span className="map-status-dot" style={{ background: '#FF5C5C' }} aria-hidden="true" />
            <span>{offlineCount} Offline</span>
          </div>
          <div className="map-status-sep" aria-hidden="true" />
          <div className="map-status-item">
            <span aria-hidden="true">📍</span>
            <span>Active Routes: 3 Corridors</span>
          </div>
          <div className="map-status-sep" aria-hidden="true" />
          <div className="map-status-item">
            <span aria-hidden="true">📏</span>
            <span>Distance Today: 3,420 km</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default MapPlaceholder;
