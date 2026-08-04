/**
 * Login.tsx – FleetDash Enterprise Light Theme Login Page
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Truck, ArrowRight, CheckCircle2 } from 'lucide-react';
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

    if (!email) {
      setError('Email address is required.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    const res = login(email, password);
    if (res.success) {
      navigate('/dashboard', { replace: true });
    } else {
      setError(res.error || 'Invalid credentials');
    }
  };

  return (
    <div className="auth-page">
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 440px',
        maxWidth: '1040px',
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 10px 25px -3px rgba(15, 23, 42, 0.08)',
        overflow: 'hidden'
      }}>
        {/* Left Hero Visualization Panel */}
        <div style={{
          padding: '48px',
          backgroundColor: '#F8FAFC',
          borderRight: '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
              <div className="sidebar__logo-icon">
                <Truck size={20} />
              </div>
              <span className="sidebar__logo-text">Fleet<span>Dash</span></span>
            </div>

            <h2 style={{ fontSize: '30px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px', marginBottom: '12px', lineHeight: 1.2 }}>
              High-Throughput Real-Time Fleet Intelligence
            </h2>
            <p style={{ color: '#64748B', fontSize: '15px', lineHeight: 1.6 }}>
              Monitor vehicle telemetry, track driver performance, optimize delivery routes, and manage alerts across your entire fleet in real-time.
            </p>

            <div style={{ marginTop: '36px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle2 size={18} color="#16A34A" />
                <span style={{ fontSize: '14px', fontWeight: 500, color: '#334155' }}>Sub-millisecond event telemetry processing</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle2 size={18} color="#16A34A" />
                <span style={{ fontSize: '14px', fontWeight: 500, color: '#334155' }}>Live vehicle location & geofence monitoring</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle2 size={18} color="#16A34A" />
                <span style={{ fontSize: '14px', fontWeight: 500, color: '#334155' }}>Automated engine health & alert diagnostics</span>
              </div>
            </div>
          </div>

          <div style={{ paddingTop: '32px', borderTop: '1px solid #E2E8F0', fontSize: '12px', color: '#94A3B8' }}>
            © 2026 FleetDash Telemetry Inc. Enterprise Operations v2.4
          </div>
        </div>

        {/* Right Login Form */}
        <div style={{ padding: '48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="auth-header" style={{ textAlign: 'left', marginBottom: '28px' }}>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to your Fleet Operations dashboard</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && (
              <div style={{
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: '#FEF2F2',
                border: '1px solid #FCA5A5',
                color: '#DC2626',
                fontSize: '13px',
                fontWeight: 500
              }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                type="email"
                className="form-input"
                placeholder="dispatcher@fleetdash.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" htmlFor="login-password">Password</label>
                <a href="#forgot" onClick={(e) => e.preventDefault()} style={{ fontSize: '12px', color: '#2563EB', textDecoration: 'none', fontWeight: 600 }}>
                  Forgot password?
                </a>
              </div>
              <input
                id="login-password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0 12px' }}>
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ cursor: 'pointer', accentColor: '#2563EB' }}
              />
              <label htmlFor="remember" style={{ fontSize: '13px', color: '#475569', cursor: 'pointer' }}>
                Remember me on this browser
              </label>
            </div>

            <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              Sign In to FleetDash <ArrowRight size={16} />
            </button>
          </form>

          <p className="auth-footer-text">
            Don't have an account?{' '}
            <Link to="/signup" className="auth-link">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
