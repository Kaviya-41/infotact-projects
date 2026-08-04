/**
 * Signup.tsx – FleetDash Enterprise Light Theme Sign Up Page
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Truck, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/dashboard.css';

const Signup: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { signup } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs: { [key: string]: string } = {};

    if (!fullName.trim()) {
      errs.fullName = 'Full Name is required';
    }

    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email address';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const res = signup(fullName, email, password, company);
    if (res.success) {
      navigate('/dashboard', { replace: true });
    } else {
      setErrors({ form: res.error || 'Failed to create account' });
    }
  };

  return (
    <div className="auth-page">
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 480px',
        maxWidth: '1080px',
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 10px 25px -3px rgba(15, 23, 42, 0.08)',
        overflow: 'hidden'
      }}>
        {/* Left Info Panel */}
        <div style={{
          padding: '48px',
          backgroundColor: '#F8FAFC',
          borderRight: '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
              <div className="sidebar__logo-icon">
                <Truck size={20} />
              </div>
              <span className="sidebar__logo-text">Fleet<span>Dash</span></span>
            </div>

            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px', marginBottom: '12px', lineHeight: 1.2 }}>
              Get Started with Enterprise Fleet Management
            </h2>
            <p style={{ color: '#64748B', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px' }}>
              Join thousands of logistics managers and dispatchers using FleetDash to gain real-time visibility into vehicle health and performance.
            </p>

            <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <ShieldCheck size={20} color="#2563EB" />
                <span style={{ fontWeight: 600, fontSize: '14px', color: '#0F172A' }}>Enterprise Tier Access</span>
              </div>
              <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5 }}>
                Includes unlimited vehicle telemetry streams, driver safety scores, custom alert triggers, and high-frequency live map monitoring.
              </p>
            </div>
          </div>

          <div style={{ paddingTop: '32px', borderTop: '1px solid #E2E8F0', fontSize: '12px', color: '#94A3B8' }}>
            © 2026 FleetDash Telemetry Inc. All rights reserved.
          </div>
        </div>

        {/* Right Sign Up Form */}
        <div style={{ padding: '48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="auth-header" style={{ textAlign: 'left', marginBottom: '24px' }}>
            <h1 className="auth-title">Create your Account</h1>
            <p className="auth-subtitle">Start monitoring your fleet telemetry in seconds</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {errors.form && (
              <div style={{
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: '#FEF2F2',
                border: '1px solid #FCA5A5',
                color: '#DC2626',
                fontSize: '13px',
                fontWeight: 500
              }}>
                {errors.form}
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="signup-name">Full Name</label>
              <input
                id="signup-name"
                type="text"
                className={`form-input ${errors.fullName ? 'form-input--error' : ''}`}
                placeholder="Alex Morgan"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              {errors.fullName && <span className="form-error">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-email">Work Email</label>
              <input
                id="signup-email"
                type="email"
                className={`form-input ${errors.email ? 'form-input--error' : ''}`}
                placeholder="alex@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-company">Company / Organization (Optional)</label>
              <input
                id="signup-company"
                type="text"
                className="form-input"
                placeholder="Swift Fleet Logistics"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="signup-password">Password</label>
                <input
                  id="signup-password"
                  type="password"
                  className={`form-input ${errors.password ? 'form-input--error' : ''}`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <span className="form-error">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="signup-confirm">Confirm Password</label>
                <input
                  id="signup-confirm"
                  type="password"
                  className={`form-input ${errors.confirmPassword ? 'form-input--error' : ''}`}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '8px' }}>
              Create Account <ArrowRight size={16} />
            </button>
          </form>

          <p className="auth-footer-text">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
