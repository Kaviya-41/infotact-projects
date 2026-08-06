/**
 * Login.tsx – FleetDash Premium Light Split-Screen Login Page
 * Left: Brand panel with animated world map visualization
 * Right: Clean white form with email/password authentication
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Truck, ArrowRight, Navigation, MapPin, Radio } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import '../styles/dashboard.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    const res = login(email, password);
    if (res.success) {
      navigate('/dashboard', { replace: true });
    } else {
      setError(res.error || 'Authentication failed');
    }
  };

  return (
    <div className="auth-split-layout">
      {/* Left Branding & Map Visualization Panel */}
      <motion.div
        className="auth-hero-panel"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          {/* Logo */}
          <motion.div
            style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563EB, #0EA5E9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#FFFFFF', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
            }}>
              <Truck size={22} />
            </div>
            <span style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
              Fleet<span style={{ color: '#2563EB' }}>Dash</span>
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            style={{
              fontSize: '36px', fontWeight: 800, color: '#0F172A',
              letterSpacing: '-1px', lineHeight: 1.15, marginBottom: '16px',
            }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Real-Time Fleet<br />Intelligence Platform
          </motion.h1>

          <motion.p
            style={{ fontSize: '16px', color: '#64748B', lineHeight: 1.6, maxWidth: '440px' }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Monitor vehicle telemetry, delivery routes, and engine diagnostics from an enterprise automotive telematics dashboard.
          </motion.p>

          {/* Map Visualization Card */}
          <motion.div
            style={{
              marginTop: '40px', height: '260px',
              backgroundColor: '#FFFFFF', borderRadius: '20px',
              border: '1px solid rgba(226, 232, 240, 0.7)',
              boxShadow: '0 8px 32px rgba(15, 23, 42, 0.06)',
              position: 'relative', overflow: 'hidden',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {/* SVG World Map Background */}
            <svg width="100%" height="100%" viewBox="0 0 500 260" style={{ position: 'absolute', top: 0, left: 0 }}>
              {/* Grid */}
              <defs>
                <pattern id="login-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#F1F5F9" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#login-grid)" />

              {/* Route Lines */}
              <path d="M 30 180 Q 150 120 280 140 T 480 80" fill="none" stroke="#CBD5E1" strokeWidth="5" strokeLinecap="round" opacity="0.6" />
              <path d="M 120 30 Q 160 130 300 220" fill="none" stroke="#CBD5E1" strokeWidth="5" strokeLinecap="round" opacity="0.6" />
              <path d="M 60 220 Q 200 160 380 100" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeDasharray="6 4" opacity="0.5">
                <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="2s" repeatCount="indefinite" />
              </path>
              <path d="M 180 50 Q 250 150 420 180" fill="none" stroke="#0EA5E9" strokeWidth="2" strokeDasharray="4 3" opacity="0.4">
                <animate attributeName="stroke-dashoffset" from="0" to="-14" dur="3s" repeatCount="indefinite" />
              </path>

              {/* Animated Vehicle Dots */}
              <circle r="4" fill="#2563EB" opacity="0.8">
                <animateMotion dur="4s" repeatCount="indefinite" path="M 60 220 Q 200 160 380 100" />
              </circle>
              <circle r="3" fill="#10B981" opacity="0.7">
                <animateMotion dur="5s" repeatCount="indefinite" path="M 30 180 Q 150 120 280 140 T 480 80" />
              </circle>
              <circle r="3" fill="#0EA5E9" opacity="0.6">
                <animateMotion dur="6s" repeatCount="indefinite" path="M 180 50 Q 250 150 420 180" />
              </circle>

              {/* Static Location Markers */}
              <circle cx="80" cy="180" r="6" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2" />
              <circle cx="380" cy="100" r="6" fill="#FFFFFF" stroke="#10B981" strokeWidth="2" />
              <circle cx="280" cy="140" r="5" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="2" />
            </svg>

            {/* Floating Status Badges */}
            <div style={{
              position: 'absolute', top: '16px', right: '16px', zIndex: 10,
              display: 'flex', flexDirection: 'column', gap: '6px',
            }}>
              <div style={{
                backgroundColor: '#FFFFFF', padding: '6px 12px', borderRadius: '20px',
                border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                display: 'flex', alignItems: 'center', gap: '6px',
                fontSize: '11px', fontWeight: 600, color: '#0F172A',
              }}>
                <Navigation size={12} color="#2563EB" />
                42 Vehicles Tracked
              </div>
              <div style={{
                backgroundColor: '#FFFFFF', padding: '6px 12px', borderRadius: '20px',
                border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                display: 'flex', alignItems: 'center', gap: '6px',
                fontSize: '11px', fontWeight: 600, color: '#10B981',
              }}>
                <Radio size={12} />
                Live Telemetry Active
              </div>
            </div>

            {/* Center Moving Vehicle Badge */}
            <motion.div
              style={{
                position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
                zIndex: 10, backgroundColor: '#FFFFFF', padding: '8px 16px',
                borderRadius: '20px', border: '1px solid #E2E8F0',
                boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
                display: 'flex', alignItems: 'center', gap: '8px',
                fontWeight: 700, fontSize: '12px', color: '#0F172A',
              }}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 0 3px rgba(16,185,129,0.2)' }} />
              <MapPin size={14} color="#2563EB" />
              <span>FLT-004 En Route</span>
              <span style={{ color: '#2563EB', fontFamily: 'var(--fd-font-mono)' }}>68 km/h</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          style={{ fontSize: '12px', color: '#94A3B8' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          © 2026 FleetDash Telemetry Systems. Enterprise Operations Mode.
        </motion.div>
      </motion.div>

      {/* Right Form Panel */}
      <motion.div
        className="auth-form-side"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div style={{ maxWidth: '360px', width: '100%', margin: '0 auto' }}>
          <div style={{ marginBottom: '32px' }}>
            {/* Mobile Logo (hidden on desktop) */}
            <div style={{ display: 'none', alignItems: 'center', gap: '8px', marginBottom: '24px' }} className="mobile-logo">
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #2563EB, #0EA5E9)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF',
              }}>
                <Truck size={18} />
              </div>
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>
                Fleet<span style={{ color: '#2563EB' }}>Dash</span>
              </span>
            </div>

            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px', marginBottom: '6px' }}>
              Welcome Back
            </h2>
            <p style={{ fontSize: '14px', color: '#64748B' }}>
              Sign in to access your fleet operations dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  padding: '10px 14px', borderRadius: '10px',
                  backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5',
                  color: '#DC2626', fontSize: '13px', fontWeight: 600,
                }}
              >
                {error}
              </motion.div>
            )}

            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', display: 'block', marginBottom: '6px' }} htmlFor="login-email">
                Work Email
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                style={{
                  width: '100%', padding: '11px 14px', borderRadius: '10px',
                  border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none',
                  fontFamily: 'inherit', transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                  backgroundColor: '#FFFFFF',
                }}
                onFocus={(e) => { e.target.style.borderColor = '#2563EB'; e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }}
                placeholder="dispatcher@fleetdash.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }} htmlFor="login-password">
                  Password
                </label>
                <a href="#forgot" onClick={(e) => e.preventDefault()} style={{ fontSize: '12px', color: '#2563EB', textDecoration: 'none', fontWeight: 600 }}>
                  Forgot Password?
                </a>
              </div>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                style={{
                  width: '100%', padding: '11px 14px', borderRadius: '10px',
                  border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none',
                  fontFamily: 'inherit', transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                  backgroundColor: '#FFFFFF',
                }}
                onFocus={(e) => { e.target.style.borderColor = '#2563EB'; e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ cursor: 'pointer', accentColor: '#2563EB', width: '16px', height: '16px' }}
              />
              <label htmlFor="remember" style={{ fontSize: '13px', color: '#64748B', cursor: 'pointer' }}>
                Remember me
              </label>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: '100%', padding: '12px 20px', borderRadius: '10px',
                backgroundColor: '#2563EB', color: '#FFFFFF',
                fontSize: '14px', fontWeight: 700, border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
                fontFamily: 'inherit', transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#1D4ED8'; }}
              onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#2563EB'; }}
            >
              Sign In <ArrowRight size={16} />
            </motion.button>
          </form>

          <p style={{ marginTop: '28px', textAlign: 'center', fontSize: '13px', color: '#64748B' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#2563EB', fontWeight: 700, textDecoration: 'none' }}>
              Create Account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
