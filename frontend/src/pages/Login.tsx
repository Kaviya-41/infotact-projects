/**
 * Login.tsx – Split-screen Automotive Telematics Light Login Page
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Truck, ArrowRight, Navigation } from 'lucide-react';
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
      <div className="auth-hero-panel">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
            <div className="sidebar-dock__logo">
              <Truck size={24} />
            </div>
            <span style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
              Fleet<span style={{ color: '#2563EB' }}>Dash</span>
            </span>
          </div>

          <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#0F172A', letterSpacing: '-1px', lineHeight: 1.2, marginBottom: '16px' }}>
            Real-Time Fleet Intelligence Platform
          </h1>
          <p style={{ fontSize: '16px', color: '#64748B', lineHeight: 1.6, maxWidth: '480px' }}>
            Monitor vehicle telemetry, delivery routes, and engine diagnostics from an enterprise automotive telematics dashboard.
          </p>

          {/* Graphic Mock Map Visualization */}
          <div style={{
            marginTop: '40px',
            height: '240px',
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid rgba(15, 23, 42, 0.08)',
            boxShadow: '0 8px 32px rgba(15, 23, 42, 0.06)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="100%" height="100%" viewBox="0 0 400 200" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
              <path d="M -20 100 Q 150 140 420 80" stroke="#CBD5E1" strokeWidth="6" fill="none" />
              <path d="M 120 -20 Q 160 120 280 220" stroke="#CBD5E1" strokeWidth="6" fill="none" />
              <path d="M 60 180 Q 200 80 360 40" stroke="#2563EB" strokeWidth="3" strokeDasharray="6 4" fill="none" />
            </svg>
            <div style={{
              zIndex: 10,
              backgroundColor: '#FFFFFF',
              padding: '10px 16px',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 700,
              fontSize: '12px'
            }}>
              <Navigation size={16} color="#2563EB" />
              <span>FLT-024 En Route (68 km/h)</span>
            </div>
          </div>
        </div>

        <div style={{ fontSize: '12px', color: '#94A3B8' }}>
          © 2026 FleetDash Telemetry Systems. Enterprise Operations Mode.
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="auth-form-side">
        <div style={{ maxWidth: '360px', width: '100%', margin: '0 auto' }}>
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px', marginBottom: '6px' }}>
              Welcome Back
            </h2>
            <p style={{ fontSize: '14px', color: '#64748B' }}>
              Sign in to access your telemetry dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {error && (
              <div style={{ padding: '10px 14px', borderRadius: '10px', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', fontSize: '13px', fontWeight: 600 }}>
                {error}
              </div>
            )}

            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', display: 'block', marginBottom: '6px' }} htmlFor="login-email">
                Work Email
              </label>
              <input
                id="login-email"
                type="email"
                style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none' }}
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
                style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none' }}
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
                style={{ cursor: 'pointer', accentColor: '#2563EB' }}
              />
              <label htmlFor="remember" style={{ fontSize: '13px', color: '#64748B', cursor: 'pointer' }}>
                Remember me
              </label>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px 20px',
                borderRadius: '10px',
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)'
              }}
            >
              Sign In <ArrowRight size={16} />
            </button>
          </form>

          <p style={{ marginTop: '28px', textAlign: 'center', fontSize: '13px', color: '#64748B' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#2563EB', fontWeight: 700, textDecoration: 'none' }}>
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
