/**
 * SettingsPage.tsx – Settings placeholder (coming soon).
 * Styled to match the FleetDash premium aesthetic.
 */

import React from 'react';
import { motion } from 'framer-motion';

const SettingsPage: React.FC = () => (
  <motion.div
    className="dashboard-page"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.4 }}
  >
    <div className="dashboard-section-label">
      <span className="section-label-icon" aria-hidden="true">⚙</span>
      <div>
        <h2 className="section-label-title">Settings</h2>
        <p className="section-label-subtitle">Configure your fleet management preferences</p>
      </div>
    </div>

    <motion.div
      className="placeholder-card"
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: 'rgba(20, 28, 45, 0.72)',
        border: '1px solid rgba(79,140,255,0.12)',
        borderRadius: '18px',
        padding: '64px 40px',
        textAlign: 'center',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(79,140,255,0.06)',
      }}
    >
      <div style={{ fontSize: '52px', marginBottom: '16px' }}>⚙</div>
      <h3 style={{
        fontFamily: "'Space Grotesk', 'Inter', sans-serif",
        fontSize: '22px',
        fontWeight: 700,
        marginBottom: '10px',
        background: 'linear-gradient(135deg, #FFFFFF 60%, rgba(141,162,192,0.8) 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>
        Settings — Coming Soon
      </h3>
      <p style={{ color: '#8DA2C0', fontSize: '14px', maxWidth: '420px', margin: '0 auto', lineHeight: 1.7 }}>
        User preferences, notification rules, map themes, fleet grouping,
        and integration configurations are coming in a future update.
      </p>
      <div style={{
        marginTop: '28px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 20px',
        borderRadius: '99px',
        background: 'rgba(141,162,192,0.12)',
        border: '1px solid rgba(141,162,192,0.25)',
        color: '#8DA2C0',
        fontSize: '12px',
        fontWeight: 600,
      }}>
        <span style={{ animation: 'spin 2s linear infinite', display: 'inline-block' }}>⚙</span>
        Under Development
      </div>
    </motion.div>
  </motion.div>
);

export default SettingsPage;
