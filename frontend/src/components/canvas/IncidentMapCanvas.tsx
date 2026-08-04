/**
 * IncidentMapCanvas.tsx – Interactive Canvas-based disaster incident map
 *
 * Renders simulated storm trajectories, seismic zones, evacuation routes,
 * and atmospheric particle effects on an HTML5 Canvas 2D context.
 * Light-mode aesthetic with amber/blue markers.
 */

import React, { useRef, useCallback } from 'react';
import { useCanvasRenderer } from '../../hooks/useCanvasRenderer';

// ── Data structures ────────────────────────────────────────────────────────────

interface IncidentNode {
  rx: number;  // relative x (0-1)
  ry: number;  // relative y (0-1)
  type: 'storm' | 'seismic' | 'flood' | 'shelter' | 'drone';
  label: string;
  severity: number; // 0-1
}

const INCIDENT_NODES: IncidentNode[] = [
  { rx: 0.25, ry: 0.30, type: 'storm',   label: 'Hurricane Path',      severity: 0.9 },
  { rx: 0.45, ry: 0.55, type: 'seismic',  label: 'Seismic Zone A',      severity: 0.6 },
  { rx: 0.65, ry: 0.25, type: 'flood',    label: 'Flood Risk Area',     severity: 0.7 },
  { rx: 0.80, ry: 0.60, type: 'shelter',  label: 'Highland Shelter',    severity: 0.2 },
  { rx: 0.15, ry: 0.70, type: 'drone',    label: 'Drone Patrol',        severity: 0.3 },
  { rx: 0.55, ry: 0.75, type: 'shelter',  label: 'Valley Safe Zone',    severity: 0.15 },
  { rx: 0.35, ry: 0.15, type: 'storm',    label: 'Storm Front Edge',    severity: 0.8 },
  { rx: 0.70, ry: 0.45, type: 'flood',    label: 'River Overflow Zone', severity: 0.5 },
];

const EVAC_ROUTES: [number, number][] = [
  [0, 3], [2, 3], [4, 5], [1, 5], [6, 0], [7, 3],
];

// Particle pool
interface MapParticle {
  x: number; y: number; size: number; speedX: number; speedY: number; opacity: number;
}

const createParticles = (count: number): MapParticle[] =>
  Array.from({ length: count }, () => ({
    x: Math.random(),
    y: Math.random(),
    size: Math.random() * 1.8 + 0.4,
    speedX: (Math.random() - 0.5) * 0.001,
    speedY: (Math.random() - 0.5) * 0.0008,
    opacity: Math.random() * 0.4 + 0.1,
  }));

const NODE_COLORS: Record<string, string> = {
  storm:   '#EF4444',
  seismic: '#F59E0B',
  flood:   '#3B82F6',
  shelter: '#10B981',
  drone:   '#8B5CF6',
};

// ── Component ──────────────────────────────────────────────────────────────────

const IncidentMapCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<MapParticle[]>(createParticles(50));

  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, frame: number) => {
    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, '#F8FAFC');
    bgGrad.addColorStop(1, '#EFF6FF');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.03)';
    ctx.lineWidth = 1;
    const gridSize = 50;
    for (let x = 0; x < w; x += gridSize) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += gridSize) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Evacuation route lines (animated dashes)
    EVAC_ROUTES.forEach(([a, b]) => {
      const na = INCIDENT_NODES[a];
      const nb = INCIDENT_NODES[b];
      const ax = na.rx * w, ay = na.ry * h;
      const bx = nb.rx * w, by = nb.ry * h;

      ctx.beginPath();
      ctx.moveTo(ax, ay);

      // Curved path
      const mx = (ax + bx) / 2 + Math.sin(frame * 0.01) * 15;
      const my = (ay + by) / 2 - 20;
      ctx.quadraticCurveTo(mx, my, bx, by);

      ctx.strokeStyle = 'rgba(59, 130, 246, 0.15)';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 6]);
      ctx.lineDashOffset = -frame * 0.5;
      ctx.stroke();
      ctx.setLineDash([]);

      // Animated pulse along route
      const progress = ((frame * 0.3) % 100) / 100;
      const t = progress;
      const pulseX = (1 - t) * (1 - t) * ax + 2 * (1 - t) * t * mx + t * t * bx;
      const pulseY = (1 - t) * (1 - t) * ay + 2 * (1 - t) * t * my + t * t * by;

      const pulseGrad = ctx.createRadialGradient(pulseX, pulseY, 0, pulseX, pulseY, 8);
      pulseGrad.addColorStop(0, 'rgba(59, 130, 246, 0.5)');
      pulseGrad.addColorStop(1, 'rgba(59, 130, 246, 0)');
      ctx.beginPath();
      ctx.arc(pulseX, pulseY, 8, 0, Math.PI * 2);
      ctx.fillStyle = pulseGrad;
      ctx.fill();
    });

    // Incident nodes
    INCIDENT_NODES.forEach((node, i) => {
      const x = node.rx * w;
      const y = node.ry * h;
      const color = NODE_COLORS[node.type] || '#999';
      const pulsePhase = (frame * 0.02 + i * 0.8) % (Math.PI * 2);
      const pulse = Math.sin(pulsePhase) * 0.5 + 0.5;

      // Danger zone radius for high-severity nodes
      if (node.severity > 0.5) {
        const zoneR = 30 + node.severity * 30 + pulse * 10;
        const zoneGrad = ctx.createRadialGradient(x, y, 0, x, y, zoneR);
        zoneGrad.addColorStop(0, color.replace(')', ', 0.08)').replace('rgb', 'rgba'));
        zoneGrad.addColorStop(1, 'transparent');

        // Use hex to rgba conversion
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);

        const grad2 = ctx.createRadialGradient(x, y, 0, x, y, zoneR);
        grad2.addColorStop(0, `rgba(${r},${g},${b},${0.06 + pulse * 0.04})`);
        grad2.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.arc(x, y, zoneR, 0, Math.PI * 2);
        ctx.fillStyle = grad2;
        ctx.fill();

        // Pulse ring
        const ringR = 15 + pulse * 12;
        ctx.beginPath();
        ctx.arc(x, y, ringR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${r},${g},${b},${0.2 * (1 - pulse)})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Core node dot
      const coreR = 5 + pulse * 2;
      ctx.beginPath();
      ctx.arc(x, y, coreR, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      // White border
      ctx.beginPath();
      ctx.arc(x, y, coreR + 2, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      ctx.font = '500 11px Inter, sans-serif';
      ctx.fillStyle = 'rgba(26, 29, 38, 0.7)';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, x, y - coreR - 8);
    });

    // Floating particles (atmospheric)
    particlesRef.current.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < -0.02) p.x = 1.02;
      if (p.x > 1.02) p.x = -0.02;
      if (p.y < -0.02) p.y = 1.02;
      if (p.y > 1.02) p.y = -0.02;

      const px = p.x * w;
      const py = p.y * h;

      const pGrad = ctx.createRadialGradient(px, py, 0, px, py, p.size * 3);
      pGrad.addColorStop(0, `rgba(59, 130, 246, ${p.opacity})`);
      pGrad.addColorStop(1, 'rgba(59, 130, 246, 0)');

      ctx.beginPath();
      ctx.arc(px, py, p.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = pGrad;
      ctx.fill();
    });

    // Compass indicator (top-right)
    const compassX = w - 40;
    const compassY = 40;
    ctx.save();
    ctx.translate(compassX, compassY);

    // Compass circle
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.08)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // N arrow
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(3, 2);
    ctx.lineTo(-3, 2);
    ctx.closePath();
    ctx.fillStyle = '#EF4444';
    ctx.fill();

    // S arrow
    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.lineTo(3, -2);
    ctx.lineTo(-3, -2);
    ctx.closePath();
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fill();

    ctx.font = 'bold 8px Inter, sans-serif';
    ctx.fillStyle = '#EF4444';
    ctx.textAlign = 'center';
    ctx.fillText('N', 0, -14);

    ctx.restore();

    // Scale bar (bottom-right)
    const scaleX = w - 120;
    const scaleY = h - 20;
    ctx.beginPath();
    ctx.moveTo(scaleX, scaleY);
    ctx.lineTo(scaleX + 80, scaleY);
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Scale ticks
    ctx.beginPath();
    ctx.moveTo(scaleX, scaleY - 4);
    ctx.lineTo(scaleX, scaleY + 4);
    ctx.moveTo(scaleX + 80, scaleY - 4);
    ctx.lineTo(scaleX + 80, scaleY + 4);
    ctx.stroke();

    ctx.font = '500 10px Inter, sans-serif';
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.textAlign = 'center';
    ctx.fillText('10 km', scaleX + 40, scaleY - 8);

  }, []);

  useCanvasRenderer({ canvasRef, draw });

  return (
    <div className="canvas-stage" id="incident-map-canvas" role="img" aria-label="Real-time disaster incident map showing storm trajectories, seismic zones, flood risks, and evacuation routes">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default IncidentMapCanvas;
