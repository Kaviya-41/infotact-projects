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

// ── Vehicle Marker Sub-component ───────────────────────────────────────────────

const Marker: React.FC<{ marker: VehicleMarker; index: number }> = memo(({ marker, index }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className={`map-marker map-marker--${marker.status}`}
      style={{ top: marker.top, left: marker.left }}
      role="img"
      aria-label={`${marker.id} – ${marker.status}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.3 + index * 0.06, type: 'spring', stiffness: 260 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.3, zIndex: 20 }}
    >
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
        ● {marker.status.charAt(0).toUpperCase() + marker.status.slice(1)}
      </span>
    </motion.div>
  );
});
AnimatedTooltip.displayName = 'AnimatedTooltip';

// ── Component ──────────────────────────────────────────────────────────────────

const MapPlaceholder: React.FC<MapPlaceholderProps> = ({ height = 520 }) => {
  const [activeLayer, setActiveLayer] = useState<MapLayer>('satellite');

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
      aria-label="Live map section"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.15, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="map-card">
        {/* Card Header */}
        <div className="map-card__header">
          <div className="map-card__title">
            <span aria-hidden="true">🗺</span>
            Live Map
            <span className="map-card__live-badge" role="status" aria-label="Status: Pending integration">
              <span className="live-dot" aria-hidden="true" />
              LIVE
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Vehicle count */}
            <div className="map-vehicle-count" aria-label="Active vehicles on map">
              🚛 {VEHICLE_MARKERS.length} Vehicles
            </div>
            {/* GPS indicator */}
            <div className="map-gps-indicator" aria-label="GPS signal active">
              <span className="map-gps-dot" aria-hidden="true" />
              GPS
            </div>
            {/* Layer controls */}
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
          aria-label="Static fleet map preview"
        >
          {/*
           * WEEK 3 INTEGRATION POINT
           * ────────────────────────────────────────────────────────────────
           * 1. Remove opacity: 0 from #fleet-map-canvas in dashboard.css
           * 2. Get canvas ref: const canvasRef = useRef<HTMLCanvasElement>(null)
           * 3. On socket telemetry events, call renderFrame(ctx, vehiclePositions)
           * 4. Use requestAnimationFrame for smooth 60 fps rendering loop
           * ────────────────────────────────────────────────────────────────
           */}
          <canvas
            id="fleet-map-canvas"
            aria-hidden="true"
            /* Canvas dimensions set programmatically in Week 3 */
          />

          {/* ── Static SVG road network + animated routes ─────────── */}
          <svg
            className="map-roads"
            viewBox="0 0 1000 500"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            {/* Major horizontal roads */}
            <line x1="0"    y1="120" x2="1000" y2="110" stroke="#1a2840" strokeWidth="14" />
            <line x1="0"    y1="122" x2="1000" y2="112" stroke="#243654" strokeWidth="2"  strokeDasharray="40 20" />
            <line x1="0"    y1="280" x2="1000" y2="295" stroke="#1a2840" strokeWidth="10" />
            <line x1="0"    y1="282" x2="1000" y2="297" stroke="#243654" strokeWidth="2"  strokeDasharray="30 15" />
            <line x1="0"    y1="420" x2="1000" y2="410" stroke="#1a2840" strokeWidth="8"  />

            {/* Major vertical roads */}
            <line x1="200" y1="0" x2="195" y2="500" stroke="#1a2840" strokeWidth="12" />
            <line x1="202" y1="0" x2="197" y2="500" stroke="#243654" strokeWidth="2"  strokeDasharray="35 18" />
            <line x1="550" y1="0" x2="555" y2="500" stroke="#1a2840" strokeWidth="10" />
            <line x1="552" y1="0" x2="557" y2="500" stroke="#243654" strokeWidth="2"  strokeDasharray="30 15" />
            <line x1="840" y1="0" x2="845" y2="500" stroke="#1a2840" strokeWidth="8"  />

            {/* Diagonal roads */}
            <path d="M 0 380 Q 250 300 500 280 T 1000 240" stroke="#1a2840" strokeWidth="7" fill="none" />
            <path d="M 0 50  Q 180 180 350 280 T 700 450"  stroke="#1a2840" strokeWidth="6" fill="none" />

            {/* Minor roads */}
            <line x1="200" y1="120" x2="550" y2="120" stroke="#182236" strokeWidth="5" />
            <line x1="550" y1="280" x2="840" y2="280" stroke="#182236" strokeWidth="5" />
            <line x1="200" y1="280" x2="200" y2="420" stroke="#182236" strokeWidth="5" />
            <line x1="840" y1="120" x2="840" y2="420" stroke="#182236" strokeWidth="5" />

            {/* Intersections */}
            <circle cx="200" cy="120" r="14" fill="none" stroke="#1a2840" strokeWidth="8" />
            <circle cx="550" cy="280" r="12" fill="none" stroke="#1a2840" strokeWidth="7" />
            <circle cx="840" cy="120" r="10" fill="none" stroke="#182236" strokeWidth="6" />

            {/* ── Animated glowing route lines ── */}
            <path d="M 180 220 Q 280 300 380 550" stroke="#4F8CFF" strokeWidth="1.8" fill="none"
              strokeDasharray="10 8" opacity="0.55" className="map-route-animated" style={{ animationDuration: '6s' }} />
            <path d="M 180 220 Q 280 300 380 550" stroke="#4F8CFF" strokeWidth="4" fill="none"
              strokeDasharray="10 8" opacity="0.12" className="map-route-glow" style={{ animationDuration: '6s' }} />

            <path d="M 720 360 Q 790 200 880 300" stroke="#31D67B" strokeWidth="1.8" fill="none"
              strokeDasharray="10 8" opacity="0.5" className="map-route-animated" style={{ animationDuration: '8s', animationDelay: '-2s' }} />
            <path d="M 720 360 Q 790 200 880 300" stroke="#31D67B" strokeWidth="4" fill="none"
              strokeDasharray="10 8" opacity="0.12" className="map-route-glow" style={{ animationDuration: '8s', animationDelay: '-2s' }} />

            <path d="M 200 300 Q 290 320 380 550" stroke="#00D4FF" strokeWidth="1.5" fill="none"
              strokeDasharray="8 10" opacity="0.4" className="map-route-animated" style={{ animationDuration: '10s', animationDelay: '-4s' }} />

            {/* Hub pulse circles */}
            <circle cx="200" cy="290" r="6" fill="#4F8CFF" opacity="0.5" className="map-hub-pulse" />
            <circle cx="550" cy="200" r="5" fill="#31D67B" opacity="0.5" className="map-hub-pulse" style={{ animationDelay: '-1s' }} />
            <circle cx="720" cy="350" r="5" fill="#00D4FF" opacity="0.5" className="map-hub-pulse" style={{ animationDelay: '-0.5s' }} />
          </svg>

          {/* ── Vehicle Markers ── */}
          <div className="map-markers-layer" aria-label="Vehicle positions">
            {VEHICLE_MARKERS.map((m, i) => (
              <Marker key={m.id} marker={m} index={i} />
            ))}
          </div>

          {/* ── Zoom + Compass Controls ── */}
          <div className="map-overlay-controls" aria-label="Map zoom controls">
            <motion.button className="map-zoom-btn" type="button" aria-label="Zoom in" title="Zoom in"
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>+</motion.button>
            <motion.button className="map-zoom-btn" type="button" aria-label="Zoom out" title="Zoom out"
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>−</motion.button>
            <div className="map-compass" aria-label="Compass" title="North">🧭</div>
          </div>

          {/* ── Map Legend ── */}
          <div className="map-legend" aria-label="Map legend">
            <span className="map-legend__title">Legend</span>
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
          </div>

          {/* Week 3 integration hint */}
          <span className="map-placeholder-week-tag">
            <span aria-hidden="true">📅</span>
            Canvas + Socket.io integration: Week 3
          </span>
        </div>

        {/* ── Map Status Bar ── */}
        <div className="map-status-bar" aria-label="Map statistics">
          <div className="map-status-item">
            <span className="map-status-dot" style={{ background: '#31D67B' }} aria-hidden="true" />
            <span>{movingCount} Moving</span>
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
            <span>Active Routes: 3</span>
          </div>
          <div className="map-status-sep" aria-hidden="true" />
          <div className="map-status-item">
            <span aria-hidden="true">📏</span>
            <span>Distance Today: 2,840 km</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default MapPlaceholder;
