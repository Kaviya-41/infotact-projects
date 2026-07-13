/**
 * MapPlaceholder.tsx
 * Live Map section placeholder card.
 *
 * Week 1 – Static placeholder only.
 * Week 3 – Canvas Renderer will be mounted inside #fleet-map-canvas.
 *
 * The <canvas id="fleet-map-canvas"> element is already present in the DOM
 * so Week 3 can attach a CanvasRenderingContext2D without any structural
 * changes to this component. Simply un-hide it and start drawing.
 */

import React, { useState } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────────

type MapLayer = 'satellite' | 'traffic' | 'terrain';

interface MapPlaceholderProps {
  /** Height of the map area in pixels. Defaults to 400. */
  height?: number;
}

// ── Component ──────────────────────────────────────────────────────────────────

const MapPlaceholder: React.FC<MapPlaceholderProps> = ({ height = 400 }) => {
  const [activeLayer, setActiveLayer] = useState<MapLayer>('satellite');

  const layers: { id: MapLayer; label: string }[] = [
    { id: 'satellite', label: 'Satellite' },
    { id: 'traffic',   label: 'Traffic'   },
    { id: 'terrain',   label: 'Terrain'   },
  ];

  return (
    <section aria-label="Live map section">
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

          {/* Layer controls – non-functional in Week 1 */}
          <div className="map-card__controls" role="group" aria-label="Map layer selector">
            {layers.map((layer) => (
              <button
                key={layer.id}
                id={`map-layer-${layer.id}`}
                className={`map-btn${activeLayer === layer.id ? ' active' : ''}`}
                type="button"
                onClick={() => setActiveLayer(layer.id)}
                aria-pressed={activeLayer === layer.id}
              >
                {layer.label}
              </button>
            ))}
          </div>
        </div>

        {/* Canvas area – Week 3 will render into #fleet-map-canvas */}
        <div
          className="map-card__canvas-area"
          style={{ minHeight: height }}
          aria-label="Map canvas area – Canvas Renderer will be integrated in Week 3"
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

          {/* Placeholder content (visible in Week 1) */}
          <div className="map-placeholder-icon" aria-hidden="true">🗺</div>

          <div className="map-placeholder-text">
            <p className="map-placeholder-heading">Canvas Renderer will be integrated in Week 3.</p>
            <p className="map-placeholder-desc">
              The <code>#fleet-map-canvas</code> element is already present in the DOM.
              Vehicle telemetry from <code>Socket.io</code> will drive real-time
              position updates rendered via the <strong>Canvas API</strong> and{' '}
              <code>requestAnimationFrame</code>.
            </p>
          </div>

          <span className="map-placeholder-week-tag">
            <span aria-hidden="true">📅</span>
            Scheduled: Week 3 – Canvas + Socket.io Integration
          </span>
        </div>
      </div>
    </section>
  );
};

export default MapPlaceholder;
