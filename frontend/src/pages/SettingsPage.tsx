/**
 * SettingsPage.tsx – Dedicated System Settings Page
 * Manage FleetDash preferences, notification thresholds, map modes, and system sync.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bell, Sliders, Map, Save, Check, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/dashboard.css';

const SettingsPage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Profile Form States
  const [fullName, setFullName] = useState(user?.name || 'Soundarya Lakshmi');
  const [email, setEmail] = useState(user?.email || 'dispatcher@fleetdash.io');

  // Preferences States
  const [speedLimit, setSpeedLimit] = useState('80');
  const [idleThreshold, setIdleThreshold] = useState('15');
  const [fuelWarning, setFuelWarning] = useState('20');
  const [mapTheme, setMapTheme] = useState('Light');
  const [refreshRate, setRefreshRate] = useState('60');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);

  // Synchronize with AuthContext user when user loads/changes
  useEffect(() => {
    if (user?.name) setFullName(user.name);
    if (user?.email) setEmail(user.email);
  }, [user?.name, user?.email]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanName = fullName.trim();
    if (!cleanName) {
      setErrorMessage('Full Name cannot be empty.');
      return;
    }

    setIsSaving(true);
    try {
      const res = await updateProfile({
        name: cleanName,
        email: email.trim() || user?.email || 'dispatcher@fleetdash.io',
      });

      if (res.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3500);
      } else {
        setErrorMessage(res.error || 'Unable to update profile. Please try again.');
      }
    } catch {
      setErrorMessage('Unable to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="dashboard" id="settings-page">
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 className="dashboard__hero-title">Settings</h2>
          <p className="dashboard__hero-subtitle">
            Manage FleetDash preferences and system configuration.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          id="btn-save-settings"
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '10px 20px', borderRadius: '10px',
            backgroundColor: saved ? '#10B981' : '#2563EB', color: '#FFFFFF',
            border: 'none', fontSize: '13px', fontWeight: 700,
            cursor: isSaving ? 'not-allowed' : 'pointer',
            opacity: isSaving ? 0.75 : 1,
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
          }}
        >
          {isSaving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Saving...</span>
            </>
          ) : saved ? (
            <>
              <Check size={16} />
              <span>Profile Updated Successfully!</span>
            </>
          ) : (
            <>
              <Save size={16} />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      {/* Toast / Error Feedback Banners */}
      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            style={{
              padding: '12px 16px', borderRadius: '10px',
              backgroundColor: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              color: '#065F46', display: 'flex', alignItems: 'center', gap: '8px',
              fontSize: '13px', fontWeight: 600
            }}
          >
            <Check size={16} color="#10B981" />
            <span>✓ Profile updated successfully. Your new name is saved and active across FleetDash.</span>
          </motion.div>
        )}

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            style={{
              padding: '12px 16px', borderRadius: '10px',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#991B1B', display: 'flex', alignItems: 'center', gap: '8px',
              fontSize: '13px', fontWeight: 600
            }}
          >
            <AlertCircle size={16} color="#EF4444" />
            <span>{errorMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Sections Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Section 1: Profile Preferences */}
        <motion.div
          className="fd-card fd-card--no-hover"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="fd-card__header">
            <h3 className="fd-card__title">
              <span style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(37, 99, 235, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}>
                <User size={14} />
              </span>
              Profile & Account
            </h3>
          </div>

          <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label htmlFor="settings-full-name" style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                Full Name
              </label>
              <input
                id="settings-full-name"
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Your full name"
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <div>
              <label htmlFor="settings-work-email" style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                Work Email
              </label>
              <input
                id="settings-work-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="your.email@fleetdash.io"
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                Operational Role
              </label>
              <input
                type="text"
                value={user?.role || 'Fleet Dispatcher'}
                readOnly
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', fontSize: '14px', color: '#64748B' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                Organization
              </label>
              <input
                type="text"
                value={user?.company || 'LogiTech Logistics'}
                readOnly
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', fontSize: '14px', color: '#64748B' }}
              />
            </div>
          </form>
        </motion.div>

        {/* Section 2: Fleet Telemetry Thresholds */}
        <motion.div
          className="fd-card fd-card--no-hover"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="fd-card__header">
            <h3 className="fd-card__title">
              <span style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B' }}>
                <Sliders size={14} />
              </span>
              Fleet Thresholds & Parameters
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                Speed Limit Warning (km/h)
              </label>
              <input
                type="number"
                value={speedLimit}
                onChange={(e) => setSpeedLimit(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                Idle Time Threshold (mins)
              </label>
              <input
                type="number"
                value={idleThreshold}
                onChange={(e) => setIdleThreshold(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                Fuel Warning Threshold (%)
              </label>
              <input
                type="number"
                value={fuelWarning}
                onChange={(e) => setFuelWarning(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none' }}
              />
            </div>
          </div>
        </motion.div>

        {/* Section 3: Notification & Map Preferences */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Notifications */}
          <motion.div
            className="fd-card fd-card--no-hover"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="fd-card__header">
              <h3 className="fd-card__title">
                <span style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(14, 165, 233, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0EA5E9' }}>
                  <Bell size={14} />
                </span>
                Notification Channels
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>Email Alert Digest</span>
                <input type="checkbox" checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#2563EB' }} />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>Push Notifications (Browser)</span>
                <input type="checkbox" checked={pushAlerts} onChange={(e) => setPushAlerts(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#2563EB' }} />
              </label>
            </div>
          </motion.div>

          {/* Map Preferences */}
          <motion.div
            className="fd-card fd-card--no-hover"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
          >
            <div className="fd-card__header">
              <h3 className="fd-card__title">
                <span style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(139, 92, 246, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5CF6' }}>
                  <Map size={14} />
                </span>
                Map & Display Preferences
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                  Default Map Mode
                </label>
                <select
                  value={mapTheme}
                  onChange={(e) => setMapTheme(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none', backgroundColor: '#FFFFFF' }}
                >
                  <option value="Light">Enterprise Light</option>
                  <option value="Satellite">Satellite View</option>
                  <option value="Traffic">Traffic Overlay</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                  Canvas FPS Rate
                </label>
                <select
                  value={refreshRate}
                  onChange={(e) => setRefreshRate(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none', backgroundColor: '#FFFFFF' }}
                >
                  <option value="60">60 FPS (Smooth)</option>
                  <option value="30">30 FPS (Power Saver)</option>
                </select>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
