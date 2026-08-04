/**
 * LoginPage.tsx – Premium light-themed login/signup page
 * Features a hero panel with animated canvas and a glassmorphism form card.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, MapPin, Activity, Radio } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/dashboard.css';

// ── Login canvas animation ─────────────────────────────────────────────────────

const useLoginCanvas = (canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let frame = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener('resize', resize);

    // Particles for atmospheric feel
    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.2,
    }));

    // Concentric radar rings
    const radarCenter = { x: 0.5, y: 0.5 };

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      frame++;

      const cx = radarCenter.x * w;
      const cy = radarCenter.y * h;

      // Radar sweep
      const sweepAngle = (frame * 0.008) % (Math.PI * 2);
      const sweepGrad = ctx.createConicGradient(sweepAngle, cx, cy);
      sweepGrad.addColorStop(0, 'rgba(255,255,255,0.08)');
      sweepGrad.addColorStop(0.15, 'rgba(255,255,255,0.02)');
      sweepGrad.addColorStop(0.2, 'rgba(255,255,255,0)');
      sweepGrad.addColorStop(1, 'rgba(255,255,255,0)');

      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(w, h) * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = sweepGrad;
      ctx.fill();

      // Concentric rings
      for (let i = 1; i <= 4; i++) {
        const r = (Math.min(w, h) * 0.1) * i;
        const pulse = Math.sin(frame * 0.02 + i) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,255,255,${0.08 * pulse})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Cross-hairs
      ctx.beginPath();
      ctx.moveTo(cx - 20, cy);
      ctx.lineTo(cx + 20, cy);
      ctx.moveTo(cx, cy - 20);
      ctx.lineTo(cx, cy + 20);
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Floating particles
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < -5) p.x = w + 5;
        if (p.x > w + 5) p.x = -5;
        if (p.y < -5) p.y = h + 5;
        if (p.y > h + 5) p.y = -5;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [canvasRef]);
};

// ── Component ──────────────────────────────────────────────────────────────────

const LoginPage: React.FC = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLoginCanvas(canvasRef);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Small delay for UX
    setTimeout(() => {
      let result;
      if (isSignup) {
        result = signup(name, email, password);
      } else {
        result = login(email, password);
      }

      if (!result.success) {
        setError(result.error || 'Something went wrong.');
      }
      setLoading(false);
    }, 400);
  };

  const toggleMode = () => {
    setIsSignup(prev => !prev);
    setError('');
  };

  const features = [
    { icon: <MapPin size={16} color="white" />, text: 'Real-time evacuation route tracking & logistics' },
    { icon: <Activity size={16} color="white" />, text: 'Live threat level monitoring with impact telemetry' },
    { icon: <Radio size={16} color="white" />, text: 'Infrastructure health & critical system alerts' },
  ];

  return (
    <div className="login-page" id="login-page">
      {/* Hero Left Panel */}
      <div className="login-hero">
        <canvas
          ref={canvasRef}
          className="login-hero__canvas"
          aria-hidden="true"
          style={{ width: '100%', height: '100%' }}
        />
        <div className="login-hero__content">
          <motion.div
            className="login-hero__logo"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
          >
            <Shield size={32} color="white" />
          </motion.div>

          <motion.h1
            className="login-hero__title"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            DisasterIQ
          </motion.h1>

          <motion.p
            className="login-hero__subtitle"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Enterprise-grade disaster intelligence platform for real-time threat assessment, infrastructure monitoring, and emergency response coordination.
          </motion.p>

          <motion.div
            className="login-hero__features"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                className="login-hero__feature"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
              >
                <div className="login-hero__feature-icon">{f.icon}</div>
                <span className="login-hero__feature-text">{f.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Form Right Panel */}
      <div className="login-form-side">
        <motion.div
          className="login-form-card"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isSignup ? 'signup' : 'login'}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="login-form__title" id="login-form-title">
                {isSignup ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="login-form__subtitle">
                {isSignup
                  ? 'Set up your emergency coordinator access.'
                  : 'Sign in to your disaster intelligence dashboard.'}
              </p>

              <form onSubmit={handleSubmit} id="login-form" autoComplete="off">
                {isSignup && (
                  <div className="login-form__group">
                    <label className="login-form__label" htmlFor="signup-name">Full Name</label>
                    <input
                      className="login-form__input"
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      autoComplete="name"
                    />
                  </div>
                )}

                <div className="login-form__group">
                  <label className="login-form__label" htmlFor="login-email">Email Address</label>
                  <input
                    className={`login-form__input${error ? ' login-form__input--error' : ''}`}
                    id="login-email"
                    type="email"
                    placeholder="you@agency.gov"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>

                <div className="login-form__group">
                  <label className="login-form__label" htmlFor="login-password">Password</label>
                  <input
                    className={`login-form__input${error ? ' login-form__input--error' : ''}`}
                    id="login-password"
                    type="password"
                    placeholder={isSignup ? 'Min. 6 characters' : 'Enter your password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete={isSignup ? 'new-password' : 'current-password'}
                  />
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      className="login-form__error"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      role="alert"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <motion.button
                  className="login-form__submit"
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  id="login-submit-btn"
                >
                  {loading ? 'Please wait…' : isSignup ? 'Create Account' : 'Sign In'}
                </motion.button>
              </form>

              <div className="login-form__divider">
                <div className="login-form__divider-line" />
                <span className="login-form__divider-text">or</span>
                <div className="login-form__divider-line" />
              </div>

              <p className="login-form__toggle">
                {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  className="login-form__toggle-link"
                  onClick={toggleMode}
                  id="login-toggle-btn"
                >
                  {isSignup ? 'Sign In' : 'Create Account'}
                </button>
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
