/**
 * DashboardLayout.tsx – Main layout wrapper for DisasterIQ
 *
 * Provides: Sidebar + Header + scrollable page content.
 * Route-aware header titles. Light theme background with
 * subtle decorative grid and particle canvas.
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
  '/':                { title: 'Command Center',              subtitle: 'Real-time disaster intelligence & threat monitoring' },
  '/incident-map':    { title: 'Incident Map',                subtitle: 'Live incident tracking & evacuation route visualization' },
  '/infrastructure':  { title: 'Infrastructure Monitor',      subtitle: 'Critical systems health & operational status' },
  '/alerts':          { title: 'Alert Console',               subtitle: 'Active warnings, advisories, and emergency notifications' },
  '/reports':         { title: 'Reports & Analytics',         subtitle: 'Historical data analysis & response performance metrics' },
  '/settings':        { title: 'Settings',                    subtitle: 'Configure dashboard preferences & notification channels' },
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

  const routeMeta = ROUTE_META[location.pathname] ?? ROUTE_META['/'];

  // Animated floating particles – light theme
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    // Spawn particles with warm/cool hues for light theme
    const count = 35;
    particlesRef.current = Array.from({ length: count }, () => ({
      x:      Math.random() * canvas.width,
      y:      Math.random() * canvas.height,
      size:   Math.random() * 1.8 + 0.3,
      speedX: (Math.random() - 0.5) * 0.25,
      speedY: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.25 + 0.05,
      hue:    Math.random() > 0.5 ? 30 : 215,  // amber or blue
    }));

    let frame = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      // Soft connecting lines between nearby particles
      const ps = particlesRef.current;
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const dx = ps[i].x - ps[j].x;
          const dy = ps[i].y - ps[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const alpha = (1 - dist / 150) * 0.04;
            ctx.beginPath();
            ctx.moveTo(ps[i].x, ps[i].y);
            ctx.lineTo(ps[j].x, ps[j].y);
            ctx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      ps.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < -10)  p.x = canvas.width + 10;
        if (p.x > canvas.width + 10)  p.x = -10;
        if (p.y < -10)  p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        grd.addColorStop(0, `hsla(${p.hue}, 80%, 55%, ${p.opacity})`);
        grd.addColorStop(1, `hsla(${p.hue}, 80%, 55%, 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
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
      {/* Soft gradient background */}
      <div className="bg-radial-glow" aria-hidden="true" />

      {/* Grid overlay */}
      <div className="bg-grid" aria-hidden="true" />

      {/* Animated particles */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.5,
        }}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="main-content">
        <Header title={routeMeta.title} subtitle={routeMeta.subtitle} />
        <main className="page-content" id="main-page-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
