/**
 * MapPlaceholder.tsx - Enterprise Fleet Command Center Live Map
 *
 * Upgraded Live Fleet Map section acting as the centerpiece of FleetDash.
 * Features:
 *  - 60 FPS requestAnimationFrame Canvas rendering engine (#fleet-map-canvas)
 *  - Dark premium world map theme with subtle blue glow, grid overlay, logistics connection lines
 *  - Top telemetry bar: Active Vehicles, Live Updates/sec, Connected Status, Current Time
 *  - Left Floating Panel: Fleet Summary (Online, Offline, Trips Today)
 *  - Right Floating Panel: Latest Alert (Vehicle ID, Severity, Time)
 *  - Interactive Map Controls: Zoom In/Out, Re-center, Fullscreen, Live indicator, Refresh, GPS status
 *  - Premium Vehicle Markers: Heading direction arrow, type icons, speed badges, online pulse, hover tooltips
 *  - Floating Map Legend: Online, Offline, Moving, Idle, Maintenance
 *  - Preserves canvas element ID, layer selectors, marker formats, and props.
 */

import React, { memo, useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Types ──────────────────────────────────────────────────────────────────────

type MapLayer = 'satellite' | 'traffic' | 'terrain';

interface MapPlaceholderProps {
  /** Height of the map area in pixels. Defaults to 580. */
  height?: number;
}

export interface ExtendedVehicleMarker {
  id: string;
  label: string;
  type: string;
  status: 'moving' | 'stopped' | 'offline' | 'idle' | 'maintenance';
  top: string;
  left: string;
  xRatio: number;
  yRatio: number;
  heading: number; // angle in degrees
  speed: string;
  driver: string;
  fuel: string;
  battery: string;
  gpsAccuracy: string;
  lastUpdated: string;
  coordinates: string;
}

// ── Vehicles Initial Data ───────────────────────────────────────────────────────

const INITIAL_VEHICLES: ExtendedVehicleMarker[] = [
  {
    id: 'FLT-001',
    label: 'FLT-001',
    type: 'Heavy Hauler',
    status: 'moving',
    top: '25%',
    left: '20%',
    xRatio: 0.20,
    yRatio: 0.25,
    heading: 65,
    speed: '68 km/h',
    driver: 'Rahul Kumar',
    fuel: '84%',
    battery: '96%',
    gpsAccuracy: '±1.2m (HDOP 0.7)',
    lastUpdated: 'Just now',
    coordinates: '12.9716° N, 77.5946° E',
  },
  {
    id: 'FLT-002',
    label: 'FLT-002',
    type: 'Delivery Van',
    status: 'moving',
    top: '55%',
    left: '38%',
    xRatio: 0.38,
    yRatio: 0.55,
    heading: 140,
    speed: '48 km/h',
    driver: 'Arjun Singh',
    fuel: '72%',
    battery: '91%',
    gpsAccuracy: '±1.5m (HDOP 0.8)',
    lastUpdated: '2 sec ago',
    coordinates: '13.0827° N, 80.2707° E',
  },
  {
    id: 'FLT-003',
    label: 'FLT-003',
    type: 'Cargo Tractor',
    status: 'idle',
    top: '38%',
    left: '58%',
    xRatio: 0.58,
    yRatio: 0.38,
    heading: 0,
    speed: '0 km/h (Idle)',
    driver: 'Kiran Patel',
    fuel: '18%',
    battery: '88%',
    gpsAccuracy: '±0.9m (HDOP 0.6)',
    lastUpdated: '5 sec ago',
    coordinates: '19.0760° N, 72.8777° E',
  },
  {
    id: 'FLT-004',
    label: 'FLT-004',
    type: 'Express Semi',
    status: 'moving',
    top: '70%',
    left: '72%',
    xRatio: 0.72,
    yRatio: 0.70,
    heading: 210,
    speed: '76 km/h',
    driver: 'Naveen Reddy',
    fuel: '90%',
    battery: '98%',
    gpsAccuracy: '±1.1m (HDOP 0.7)',
    lastUpdated: 'Just now',
    coordinates: '28.7041° N, 77.1025° E',
  },
  {
    id: 'FLT-005',
    label: 'FLT-005',
    type: 'Fleet SUV',
    status: 'offline',
    top: '18%',
    left: '78%',
    xRatio: 0.78,
    yRatio: 0.18,
    heading: 90,
    speed: 'Offline',
    driver: 'Priya Sharma',
    fuel: '64%',
    battery: '45%',
    gpsAccuracy: 'Signal Lost',
    lastUpdated: '4 min ago',
    coordinates: '22.5726° N, 88.3639° E',
  },
  {
    id: 'FLT-007',
    label: 'FLT-007',
    type: 'Heavy Hauler',
    status: 'moving',
    top: '62%',
    left: '22%',
    xRatio: 0.22,
    yRatio: 0.62,
    heading: 320,
    speed: '64 km/h',
    driver: 'Suresh Babu',
    fuel: '79%',
    battery: '94%',
    gpsAccuracy: '±1.0m (HDOP 0.6)',
    lastUpdated: '1 sec ago',
    coordinates: '17.3850° N, 78.4867° E',
  },
  {
    id: 'FLT-008',
    label: 'FLT-008',
    type: 'Delivery Van',
    status: 'maintenance',
    top: '80%',
    left: '48%',
    xRatio: 0.48,
    yRatio: 0.80,
    heading: 180,
    speed: '0 km/h (Maint)',
    driver: 'Deepak Menon',
    fuel: '55%',
    battery: '82%',
    gpsAccuracy: '±1.4m (HDOP 0.8)',
    lastUpdated: '10 sec ago',
    coordinates: '10.8505° N, 76.2711° E',
  },
  {
    id: 'FLT-009',
    label: 'FLT-009',
    type: 'Express Semi',
    status: 'moving',
    top: '32%',
    left: '86%',
    xRatio: 0.86,
    yRatio: 0.32,
    heading: 45,
    speed: '70 km/h',
    driver: 'Akash Verma',
    fuel: '87%',
    battery: '95%',
    gpsAccuracy: '±1.2m (HDOP 0.7)',
    lastUpdated: 'Just now',
    coordinates: '23.0225° N, 72.5714° E',
  },
  {
    id: 'FLT-010',
    label: 'FLT-010',
    type: 'Cargo Tractor',
    status: 'offline',
    top: '76%',
    left: '88%',
    xRatio: 0.88,
    yRatio: 0.76,
    heading: 270,
    speed: 'Offline',
    driver: 'Mohan Das',
    fuel: '32%',
    battery: '30%',
    gpsAccuracy: 'No Telemetry',
    lastUpdated: '18 min ago',
    coordinates: '15.2993° N, 74.1240° E',
  },
];

const MARKER_ICONS: Record<string, string> = {
  'FLT-001': '🚛',
  'FLT-002': '🚐',
  'FLT-003': '🚜',
  'FLT-004': '🚚',
  'FLT-005': '🚙',
  'FLT-007': '🚛',
  'FLT-008': '🚐',
  'FLT-009': '🚚',
  'FLT-010': '🚜',
};

// ── Hover Tooltip Sub-component ────────────────────────────────────────────────

const RichHoverTooltip: React.FC<{ marker: ExtendedVehicleMarker }> = memo(({ marker }) => {
  return (
    <motion.div
      className="map-marker-tooltip-rich"
      initial={{ opacity: 0, y: 6, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.92 }}
      transition={{ duration: 0.18 }}
    >
      <div className="tooltip-header">
        <span className="tooltip-title">{marker.id}</span>
        <span className={`tooltip-status-badge ${marker.status}`}>
          ● {marker.status.toUpperCase()}
        </span>
      </div>

      <div className="tooltip-grid">
        <div className="tooltip-row">
          <span className="tooltip-key">Driver:</span>
          <span className="tooltip-val">{marker.driver}</span>
        </div>
        <div className="tooltip-row">
          <span className="tooltip-key">Type:</span>
          <span className="tooltip-val">{marker.type}</span>
        </div>
        <div className="tooltip-row">
          <span className="tooltip-key">Speed:</span>
          <span className="tooltip-val" style={{ color: '#00D4FF' }}>{marker.speed}</span>
        </div>
        <div className="tooltip-row">
          <span className="tooltip-key">Heading:</span>
          <span className="tooltip-val">{marker.heading}°</span>
        </div>
        <div className="tooltip-row">
          <span className="tooltip-key">Last Updated:</span>
          <span className="tooltip-val" style={{ color: '#8DA2C0' }}>{marker.lastUpdated}</span>
        </div>
        <div className="tooltip-row">
          <span className="tooltip-key">GPS Coordinates:</span>
          <span className="tooltip-val" style={{ fontSize: '10px' }}>{marker.coordinates}</span>
        </div>
      </div>
    </motion.div>
  );
});
RichHoverTooltip.displayName = 'RichHoverTooltip';

// ── Vehicle Marker Component ───────────────────────────────────────────────────

const MarkerItem: React.FC<{
  marker: ExtendedVehicleMarker;
  index: number;
  isSelected: boolean;
  onSelect: (m: ExtendedVehicleMarker) => void;
}> = memo(({ marker, isSelected, onSelect }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`map-marker map-marker--${marker.status}${isSelected ? ' selected' : ''}`}
      style={{ top: marker.top, left: marker.left }}
      role="button"
      tabIndex={0}
      aria-label={`${marker.id} (${marker.type}) - ${marker.status}`}
      onClick={() => onSelect(marker)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <AnimatePresence>
        {hovered && <RichHoverTooltip marker={marker} />}
      </AnimatePresence>

      <div className="map-marker__wrapper">
        {/* Direction Arrow */}
        {marker.status === 'moving' && (
          <div
            className="map-marker__heading-arrow"
            style={{ transform: `rotate(${marker.heading}deg)` }}
          />
        )}

        <div className="map-marker__pin-body">
          <span>{MARKER_ICONS[marker.id] ?? '🚛'}</span>
        </div>
      </div>

      <span className="map-marker__speed-badge">
        {marker.id} · {marker.status === 'moving' ? marker.speed : marker.status.toUpperCase()}
      </span>
    </div>
  );
});
MarkerItem.displayName = 'MarkerItem';

// ── Vehicle Detail Modal Popup ────────────────────────────────────────────────

const VehicleDetailModal: React.FC<{ marker: ExtendedVehicleMarker; onClose: () => void }> = memo(({ marker, onClose }) => {
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
              <h3>{marker.id} ({marker.type})</h3>
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
            <span className="popup-label">Assigned Driver</span>
            <span className="popup-value highlight">{marker.driver}</span>
          </div>
          <div className="popup-item">
            <span className="popup-label">Telemetry Speed</span>
            <span className="popup-value cyan">{marker.speed} ({marker.heading}°)</span>
          </div>
          <div className="popup-item">
            <span className="popup-label">Fuel Level</span>
            <div className="popup-progress-wrap">
              <span className="popup-value green">{marker.fuel}</span>
              <div className="popup-progress-bar">
                <div className="popup-progress-fill" style={{ width: marker.fuel }} />
              </div>
            </div>
          </div>
          <div className="popup-item">
            <span className="popup-label">EV Battery Health</span>
            <div className="popup-progress-wrap">
              <span className="popup-value purple">{marker.battery}</span>
              <div className="popup-progress-bar">
                <div className="popup-progress-fill purple" style={{ width: marker.battery }} />
              </div>
            </div>
          </div>
          <div className="popup-item">
            <span className="popup-label">GPS Accuracy</span>
            <span className="popup-value">{marker.gpsAccuracy}</span>
          </div>
          <div className="popup-item">
            <span className="popup-label">Current Coordinates</span>
            <span className="popup-value muted">{marker.coordinates}</span>
          </div>
        </div>

        <div className="popup-actions">
          <button type="button" className="popup-btn primary" onClick={() => alert(`Tracking telemetry stream for ${marker.id}`)}>
            📡 Open Live Telemetry Stream
          </button>
          <button type="button" className="popup-btn secondary" onClick={() => alert(`Comms signal dispatched to ${marker.driver}`)}>
            💬 Dispatch Message to Driver
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
});
VehicleDetailModal.displayName = 'VehicleDetailModal';

// ── Main Map Component ─────────────────────────────────────────────────────────

const MapPlaceholder: React.FC<MapPlaceholderProps> = ({ height = 580 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [activeLayer, setActiveLayer] = useState<MapLayer>('satellite');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [selectedMarker, setSelectedMarker] = useState<ExtendedVehicleMarker | null>(null);
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');
  const [vehicles, setVehicles] = useState<ExtendedVehicleMarker[]>(INITIAL_VEHICLES);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Live ticking clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(now.toUTCString().split(' ')[4] + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Recenter helper
  const handleRecenter = useCallback(() => {
    setZoomLevel(100);
    setSelectedMarker(null);
  }, []);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.error(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
      setIsFullscreen(false);
    }
  }, []);

  // 60 FPS Canvas Rendering Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let time = 0;

    // Route particles
    const particles = Array.from({ length: 30 }).map(() => ({
      xRatio: Math.random(),
      yRatio: Math.random(),
      speed: 0.0003 + Math.random() * 0.0008,
      size: 1 + Math.random() * 2,
      alpha: 0.2 + Math.random() * 0.6,
    }));

    // Waypoints for logistics routes
    const routes = [
      [
        { x: 0.18, y: 0.25 },
        { x: 0.38, y: 0.55 },
        { x: 0.72, y: 0.70 },
      ],
      [
        { x: 0.22, y: 0.62 },
        { x: 0.58, y: 0.38 },
        { x: 0.86, y: 0.32 },
      ],
      [
        { x: 0.78, y: 0.18 },
        { x: 0.58, y: 0.38 },
        { x: 0.48, y: 0.80 },
      ]
    ];

    const render = () => {
      time += 0.016;

      // Handle DPI scaling & canvas sizing
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      // Apply zoom scale transform center
      ctx.translate(w / 2, h / 2);
      ctx.scale(zoomLevel / 100, zoomLevel / 100);
      ctx.translate(-w / 2, -h / 2);

      // ── 1. Grid & Coordinates Overlay ──
      ctx.strokeStyle = 'rgba(79, 140, 255, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // ── 2. Continent Dot Grid (Dark World Map Representation) ──
      ctx.fillStyle = 'rgba(79, 140, 255, 0.08)';
      for (let cx = 60; cx < w - 60; cx += 16) {
        for (let cy = 40; cy < h - 40; cy += 16) {
          // World continent shape approximation math noise
          const nx = (cx / w) * 6;
          const ny = (cy / h) * 4;
          const val = Math.sin(nx) * Math.cos(ny) + Math.cos(nx * 0.5);
          if (val > 0.15) {
            ctx.beginPath();
            ctx.arc(cx, cy, 1.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // ── 3. Animated Logistics Bezier Connection Routes ──
      routes.forEach((route, idx) => {
        ctx.beginPath();
        ctx.moveTo(route[0].x * w, route[0].y * h);
        ctx.quadraticCurveTo(
          route[1].x * w,
          route[1].y * h,
          route[2].x * w,
          route[2].y * h
        );
        ctx.strokeStyle = idx === 0 ? 'rgba(0, 212, 255, 0.35)' : 'rgba(79, 140, 255, 0.25)';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 6]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Animated pulse along route
        const progress = (time * 0.2 + idx * 0.3) % 1;
        const pX = (1 - progress) * (1 - progress) * (route[0].x * w) + 2 * (1 - progress) * progress * (route[1].x * w) + progress * progress * (route[2].x * w);
        const pY = (1 - progress) * (1 - progress) * (route[0].y * h) + 2 * (1 - progress) * progress * (route[1].y * h) + progress * progress * (route[2].y * h);

        ctx.beginPath();
        ctx.arc(pX, pY, 4, 0, Math.PI * 2);
        ctx.fillStyle = idx === 0 ? '#00D4FF' : '#31D67B';
        ctx.shadowColor = idx === 0 ? '#00D4FF' : '#31D67B';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // ── 4. Animated Geofence Zones ──
      const gfX = w * 0.76;
      const gfY = h * 0.74;
      const gfR = 85 + Math.sin(time * 2) * 4;

      ctx.beginPath();
      ctx.arc(gfX, gfY, gfR, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 92, 92, 0.06)';
      ctx.fill();
      ctx.strokeStyle = '#FF5C5C';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // ── 5. Moving Telemetry Particles ──
      particles.forEach((p) => {
        p.xRatio += p.speed;
        if (p.xRatio > 1) p.xRatio = 0;

        const px = p.xRatio * w;
        const py = p.yRatio * h;

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(79, 140, 255, ${p.alpha})`;
        ctx.fill();
      });

      ctx.restore();

      // Smooth vehicle position animation loop
      setVehicles((prev) =>
        prev.map((v) => {
          if (v.status !== 'moving') return v;
          const rad = (v.heading * Math.PI) / 180;
          let newX = v.xRatio + Math.sin(rad) * 0.00012;
          let newY = v.yRatio - Math.cos(rad) * 0.00012;
          if (newX < 0.1) newX = 0.85;
          if (newX > 0.9) newX = 0.15;
          if (newY < 0.1) newY = 0.85;
          if (newY > 0.9) newY = 0.15;
          return {
            ...v,
            xRatio: newX,
            yRatio: newY,
            left: `${(newX * 100).toFixed(2)}%`,
            top: `${(newY * 100).toFixed(2)}%`,
          };
        })
      );

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animFrameId);
  }, [zoomLevel]);

  const movingCount = vehicles.filter((v) => v.status === 'moving').length;
  const stoppedCount = vehicles.filter((v) => v.status === 'stopped' || v.status === 'idle').length;
  const offlineCount = vehicles.filter((v) => v.status === 'offline').length;

  return (
    <motion.section
      ref={containerRef}
      className="live-fleet-map-container"
      aria-label="Enterprise Live Fleet Command Center Map"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.15, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="map-card">
        {/* Card Header Toolbar */}
        <div className="map-card__header">
          <div className="map-card__title">
            <span aria-hidden="true">🗺</span>
            Enterprise Fleet Command Map
            <span className="map-card__live-badge" role="status" aria-label="Status: Live">
              <span className="live-dot" aria-hidden="true" />
              ● LIVE 60Hz
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <div className="map-vehicle-count">
              🚚 {vehicles.length} Active Telemetry Units
            </div>
            <div className="map-gps-indicator">
              <span className="map-gps-dot" aria-hidden="true" />
              GPS Locked (12 Satellites)
            </div>

            {/* Layer Controls */}
            <div className="map-card__controls" role="group" aria-label="Map layer selector">
              {(['satellite', 'traffic', 'terrain'] as MapLayer[]).map((layer) => (
                <motion.button
                  key={layer}
                  id={`map-layer-${layer}`}
                  className={`map-btn${activeLayer === layer ? ' active' : ''}`}
                  type="button"
                  onClick={() => setActiveLayer(layer)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                >
                  {layer.charAt(0).toUpperCase() + layer.slice(1)}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Map Canvas Area */}
        <div
          className={`map-card__canvas-area map-layer--${activeLayer}`}
          style={{ minHeight: height }}
          aria-label="Interactive 60 FPS fleet command canvas map"
        >
          {/* 60 FPS Canvas Element */}
          <canvas id="fleet-map-canvas" ref={canvasRef} aria-hidden="true" />

          {/* ── Top Telemetry Overlay Bar ── */}
          <div className="map-top-overlay-bar" aria-label="Live Telemetry Overlay">
            <div className="map-top-metric">
              <span>Active Vehicles:</span>
              <strong>{vehicles.length} Units</strong>
            </div>
            <div className="map-top-sep" />
            <div className="map-top-metric">
              <span>Live Updates/sec:</span>
              <strong>60 FPS</strong>
            </div>
            <div className="map-top-sep" />
            <div className="map-top-metric status-connected">
              <span>Connected Status:</span>
              <strong>● WebSocket Connected (60Hz)</strong>
            </div>
            <div className="map-top-sep" />
            <div className="map-top-metric time-display">
              <span>Current Time:</span>
              <strong>{currentTimeStr || '08:56:38 UTC'}</strong>
            </div>
          </div>

          {/* ── Floating Left Panel: Fleet Summary ── */}
          <div className="map-panel-left" aria-label="Fleet Summary Panel">
            <div className="map-panel-title">
              <span>📊</span> Fleet Summary
            </div>
            <div className="map-panel-row">
              <span className="map-panel-label">Online Units:</span>
              <span className="map-panel-value green">35</span>
            </div>
            <div className="map-panel-row">
              <span className="map-panel-label">Offline Units:</span>
              <span className="map-panel-value red">7</span>
            </div>
            <div className="map-panel-row">
              <span className="map-panel-label">Trips Today:</span>
              <span className="map-panel-value cyan">128</span>
            </div>
          </div>

          {/* ── Floating Right Panel: Latest Alert ── */}
          <div className="map-panel-right" aria-label="Latest Alert Panel">
            <div className="map-panel-alert-title">
              <span>🚨 Latest Alert</span>
              <span className="map-panel-alert-badge">HIGH</span>
            </div>
            <div className="map-panel-alert-body">
              <span className="map-panel-alert-vehicle">Vehicle FLT-003</span>
              <span className="map-panel-alert-desc">High Engine Temp Alert</span>
              <span className="map-panel-alert-time">2 mins ago · Zone Alpha</span>
            </div>
          </div>

          {/* ── Vehicle Markers Layer ── */}
          <div className="map-markers-layer" aria-label="Vehicle markers">
            {vehicles.map((m, i) => (
              <MarkerItem
                key={m.id}
                marker={m}
                index={i}
                isSelected={selectedMarker?.id === m.id}
                onSelect={setSelectedMarker}
              />
            ))}
          </div>

          {/* ── Map Overlay Controls (Zoom, Recenter, Fullscreen) ── */}
          <div className="map-overlay-controls" aria-label="Map controls">
            <motion.button
              className="map-control-btn"
              type="button"
              title="Zoom In"
              aria-label="Zoom in"
              onClick={() => setZoomLevel((z) => Math.min(z + 15, 200))}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              +
            </motion.button>
            <div
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: '#00D4FF',
                textAlign: 'center',
                fontFamily: 'Space Grotesk, sans-serif',
              }}
            >
              {zoomLevel}%
            </div>
            <motion.button
              className="map-control-btn"
              type="button"
              title="Zoom Out"
              aria-label="Zoom out"
              onClick={() => setZoomLevel((z) => Math.max(z - 15, 60))}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              −
            </motion.button>
            <motion.button
              className="map-control-btn"
              type="button"
              title="Re-center Map View"
              aria-label="Re-center map view"
              onClick={handleRecenter}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              🎯
            </motion.button>
            <motion.button
              className="map-control-btn"
              type="button"
              title="Fullscreen Mode"
              aria-label="Toggle fullscreen"
              onClick={toggleFullscreen}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isFullscreen ? '↙' : '⛶'}
            </motion.button>
          </div>

          {/* ── Floating Map Legend ── */}
          <div className="map-legend-floating" aria-label="Map Legend">
            <div className="map-legend-item">
              <span className="map-legend-dot online" /> Online
            </div>
            <div className="map-legend-item">
              <span className="map-legend-dot moving" /> Moving
            </div>
            <div className="map-legend-item">
              <span className="map-legend-dot idle" /> Idle
            </div>
            <div className="map-legend-item">
              <span className="map-legend-dot offline" /> Offline
            </div>
            <div className="map-legend-item">
              <span className="map-legend-dot maintenance" /> Maintenance
            </div>
          </div>

          {/* Floating Vehicle Detail Popup Modal */}
          <AnimatePresence>
            {selectedMarker && (
              <VehicleDetailModal marker={selectedMarker} onClose={() => setSelectedMarker(null)} />
            )}
          </AnimatePresence>
        </div>

        {/* ── Map Status Bar ── */}
        <div className="map-status-bar" aria-label="Map status bar">
          <div className="map-status-item">
            <span className="map-status-dot" style={{ background: '#31D67B' }} aria-hidden="true" />
            <span>{movingCount} Moving Vehicles</span>
          </div>
          <div className="map-status-sep" aria-hidden="true" />
          <div className="map-status-item">
            <span className="map-status-dot" style={{ background: '#FFB547' }} aria-hidden="true" />
            <span>{stoppedCount} Idle/Stopped</span>
          </div>
          <div className="map-status-sep" aria-hidden="true" />
          <div className="map-status-item">
            <span className="map-status-dot" style={{ background: '#FF5C5C' }} aria-hidden="true" />
            <span>{offlineCount} Offline</span>
          </div>
          <div className="map-status-sep" aria-hidden="true" />
          <div className="map-status-item">
            <span aria-hidden="true">📍</span>
            <span>Active Corridors: 3 Global Corridors</span>
          </div>
          <div className="map-status-sep" aria-hidden="true" />
          <div className="map-status-item">
            <span aria-hidden="true">📏</span>
            <span>Telemetry Distance: 3,420 km Today</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default MapPlaceholder;
