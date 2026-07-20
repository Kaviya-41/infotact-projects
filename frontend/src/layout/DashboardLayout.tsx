/**
 * DashboardLayout.tsx
 * Shared layout wrapper: Sidebar + Header + scrollable page content.
 * Route-aware: Header title/subtitle update based on current path.
 *
 * UI Enhancement: Added bg-grid and bg-particles overlay layers
 * for the premium animated background. Particles are rendered via
 * canvas – no external libraries needed.
 */

import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

// ── Types ──────────────────────────────────────────────────────────────────────

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// ── Route → Header mapping ─────────────────────────────────────────────────────

const ROUTE_META: Record<string, { title: string; subtitle: string }> = {
  '/':         { title: 'Fleet Dashboard',          subtitle: 'Real-time fleet monitoring & analytics' },
  '/live-map': { title: 'Live Map',                 subtitle: 'Real-time vehicle positions & route tracking' },
  '/vehicles': { title: 'Vehicle Fleet',            subtitle: 'Manage and monitor all vehicles' },
  '/alerts':   { title: 'Alerts & Notifications',   subtitle: 'Monitor critical events and incidents' },
  '/reports':  { title: 'Reports',                  subtitle: 'Fleet performance analytics & exports' },
  '/settings': { title: 'Settings',                 subtitle: 'Configure your fleet management preferences' },
};

// ── Particle configuration ─────────────────────────────────────────────────────

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  hue: number;
}

// ── Component ──────────────────────────────────────────────────────────────────

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const location = useLocation();

  // Resolve header title from current route
  const routeMeta = ROUTE_META[location.pathname] ?? ROUTE_META['/'];

  // Animated floating particles on background canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    // Spawn particles
    const count = 55;
    particlesRef.current = Array.from({ length: count }, () => ({
      x:      Math.random() * canvas.width,
      y:      Math.random() * canvas.height,
      size:   Math.random() * 2.2 + 0.4,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: (Math.random() - 0.5) * 0.28,
      opacity: Math.random() * 0.45 + 0.1,
      hue:    Math.random() > 0.6 ? 215 : 195, // blue or cyan hues
    }));

    // Connection line pairs (logistics hubs — fixed positions scaled to viewport)
    const hubPositions = [
      { rx: 0.14, ry: 0.21 },
      { rx: 0.45, ry: 0.19 },
      { rx: 0.63, ry: 0.19 },
      { rx: 0.46, ry: 0.51 },
      { rx: 0.77, ry: 0.61 },
      { rx: 0.17, ry: 0.54 },
    ];

    const connections: [number, number][] = [
      [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [2, 4],
    ];

    let frame = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      const hubs = hubPositions.map(h => ({
        x: h.rx * canvas.width,
        y: h.ry * canvas.height,
      }));

      // Draw animated connection lines
      connections.forEach(([a, b]) => {
        const ha = hubs[a];
        const hb = hubs[b];
        const progress = ((frame * 0.4) % 100) / 100;

        const grad = ctx.createLinearGradient(ha.x, ha.y, hb.x, hb.y);
        grad.addColorStop(0,        'rgba(79,140,255,0)');
        grad.addColorStop(Math.max(0, progress - 0.25), 'rgba(79,140,255,0)');
        grad.addColorStop(progress,  'rgba(79,140,255,0.35)');
        grad.addColorStop(Math.min(1, progress + 0.25), 'rgba(0,212,255,0.15)');
        grad.addColorStop(1,        'rgba(0,212,255,0)');

        ctx.beginPath();
        ctx.moveTo(ha.x, ha.y);
        ctx.lineTo(hb.x, hb.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      // Draw hub pulse rings
      hubs.forEach((hub, i) => {
        const pulsePhase = (frame * 0.015 + i * 0.5) % (2 * Math.PI);
        const pulse = Math.sin(pulsePhase) * 0.5 + 0.5;

        // Outer ring
        ctx.beginPath();
        ctx.arc(hub.x, hub.y, 8 + pulse * 6, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(79,140,255,${0.15 * (1 - pulse)})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Inner dot
        ctx.beginPath();
        ctx.arc(hub.x, hub.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(79,140,255,${0.5 + pulse * 0.4})`;
        ctx.fill();

        // Glow
        const grd = ctx.createRadialGradient(hub.x, hub.y, 0, hub.x, hub.y, 14);
        grd.addColorStop(0, `rgba(79,140,255,${0.18 * pulse})`);
        grd.addColorStop(1, 'rgba(79,140,255,0)');
        ctx.beginPath();
        ctx.arc(hub.x, hub.y, 14, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      });

      // Draw floating particles
      particlesRef.current.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around
        if (p.x < -10)  p.x = canvas.width + 10;
        if (p.x > canvas.width + 10)  p.x = -10;
        if (p.y < -10)  p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        grd.addColorStop(0, `hsla(${p.hue},90%,70%,${p.opacity})`);
        grd.addColorStop(1, `hsla(${p.hue},90%,70%,0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="dashboard-shell">
      {/* Soft radial blue background glow */}
      <div className="bg-radial-glow" aria-hidden="true" />

      {/* Subtle SVG World Map Watermark */}
      <div className="bg-world-map" aria-hidden="true">
        <svg viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
          <path
            d="M150,150 Q180,120 220,140 T300,160 Q340,200 320,240 T250,280 Q180,260 150,220 Z M450,120 Q500,90 550,130 T650,150 Q680,220 620,260 T500,280 Q440,240 450,180 Z M750,180 Q800,160 850,200 T900,260 Q860,320 800,300 T720,240 Z M200,340 Q250,320 280,360 T260,420 Q220,440 180,400 Z M600,340 Q660,320 720,360 T760,420 Q700,460 620,440 Z"
            fill="none"
            stroke="rgba(79, 140, 255, 0.04)"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
        </svg>
      </div>

      {/* Animated background grid overlay */}
      <div className="bg-grid" aria-hidden="true" />

      {/* Animated particles canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.65,
        }}
        aria-hidden="true"
      />

      {/* Left navigation sidebar */}
      <Sidebar />

      {/* Right: header + page content */}
      <div className="main-content">
        <Header title={routeMeta.title} subtitle={routeMeta.subtitle} />

        {/* Scrollable page body */}
        <main className="page-content" id="main-page-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
