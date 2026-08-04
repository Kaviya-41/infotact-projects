/**
 * Signup.tsx – Split-screen Automotive Telematics Light Sign Up Page
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

    if (!fullName.trim()) errs.fullName = 'Full Name is required';
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Invalid email address';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Min 6 characters required';
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
      setErrors({ form: res.error || 'Registration failed' });
    }
  };

  return (
    <div className="auth-split-layout">
      {/* Left Branding & Info Panel */}
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
            Get Started with Enterprise Fleet Telemetry
          </h1>
          <p style={{ fontSize: '16px', color: '#64748B', lineHeight: 1.6, maxWidth: '480px', marginBottom: '32px' }}>
            Set up your organization account to access sub-millisecond vehicle tracking and automated alert streams.
          </p>

          <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 4px 16px rgba(15,23,42,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', fontWeight: 700, color: '#0F172A' }}>
              <ShieldCheck size={20} color="#2563EB" /> Enterprise Telemetry Suite
            </div>
            <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5 }}>
              Includes 24/7 vehicle health monitoring, driver behavior scores, live route navigation, and instant safety alert pushes.
            </p>
          </div>
        </div>

        <div style={{ fontSize: '12px', color: '#94A3B8' }}>
          © 2026 FleetDash Telemetry Systems. All rights reserved.
        </div>
      </div>

      {/* Right Sign Up Form Side */}
      <div className="auth-form-side">
        <div style={{ maxWidth: '400px', width: '100%', margin: '0 auto' }}>
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px', marginBottom: '6px' }}>
              Create Account
            </h2>
            <p style={{ fontSize: '14px', color: '#64748B' }}>
              Start monitoring your fleet in real time
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {errors.form && (
              <div style={{ padding: '10px 14px', borderRadius: '10px', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', fontSize: '13px', fontWeight: 600 }}>
                {errors.form}
              </div>
            )}

            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', display: 'block', marginBottom: '4px' }} htmlFor="signup-name">
                Full Name
              </label>
              <input
                id="signup-name"
                type="text"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: errors.fullName ? '1px solid #DC2626' : '1px solid #E2E8F0', fontSize: '14px', outline: 'none' }}
                placeholder="Alex Morgan"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              {errors.fullName && <span style={{ fontSize: '11px', color: '#DC2626', marginTop: '2px', display: 'block' }}>{errors.fullName}</span>}
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', display: 'block', marginBottom: '4px' }} htmlFor="signup-email">
                Work Email
              </label>
              <input
                id="signup-email"
                type="email"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: errors.email ? '1px solid #DC2626' : '1px solid #E2E8F0', fontSize: '14px', outline: 'none' }}
                placeholder="alex@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <span style={{ fontSize: '11px', color: '#DC2626', marginTop: '2px', display: 'block' }}>{errors.email}</span>}
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', display: 'block', marginBottom: '4px' }} htmlFor="signup-company">
                Company / Organization
              </label>
              <input
                id="signup-company"
                type="text"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none' }}
                placeholder="LogiTech Logistics"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', display: 'block', marginBottom: '4px' }} htmlFor="signup-password">
                  Password
                </label>
                <input
                  id="signup-password"
                  type="password"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: errors.password ? '1px solid #DC2626' : '1px solid #E2E8F0', fontSize: '14px', outline: 'none' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <span style={{ fontSize: '11px', color: '#DC2626', marginTop: '2px', display: 'block' }}>{errors.password}</span>}
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', display: 'block', marginBottom: '4px' }} htmlFor="signup-confirm">
                  Confirm Password
                </label>
                <input
                  id="signup-confirm"
                  type="password"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: errors.confirmPassword ? '1px solid #DC2626' : '1px solid #E2E8F0', fontSize: '14px', outline: 'none' }}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {errors.confirmPassword && <span style={{ fontSize: '11px', color: '#DC2626', marginTop: '2px', display: 'block' }}>{errors.confirmPassword}</span>}
              </div>
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
                marginTop: '8px',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)'
              }}
            >
              Create Account <ArrowRight size={16} />
            </button>
          </form>

          <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: '#64748B' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#2563EB', fontWeight: 700, textDecoration: 'none' }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
