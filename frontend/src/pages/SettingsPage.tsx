/**
 * SettingsPage.tsx – Fleet Management Settings Page
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Sliders, Bell, Shield, Database } from 'lucide-react';
import Footer from '../components/Footer';

const SettingsPage: React.FC = () => {
  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="fleet-card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div className="stat-card__icon-box stat-card__icon-box--blue">
            <SettingsIcon size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A' }}>Fleet Management Settings</h2>
            <p style={{ fontSize: '13px', color: '#64748B' }}>Configure telemetry polling thresholds, alerts, and system integration parameters</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '15px', color: '#0F172A', marginBottom: '8px' }}>
              <Sliders size={16} color="#2563EB" /> Telemetry Polling Rate
            </div>
            <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5 }}>
              Set high-frequency satellite telemetry update intervals (Default: 2000 ms). Sub-second processing mode active.
            </p>
          </div>

          <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '15px', color: '#0F172A', marginBottom: '8px' }}>
              <Bell size={16} color="#2563EB" /> Alert Threshold Triggers
            </div>
            <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5 }}>
              Configure automatic notification triggers for speed violations, geofence breaches, and low fuel thresholds.
            </p>
          </div>

          <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '15px', color: '#0F172A', marginBottom: '8px' }}>
              <Shield size={16} color="#2563EB" /> Security & Access Controls
            </div>
            <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5 }}>
              Manage dispatcher roles, single sign-on (SSO), and API token authorizations.
            </p>
          </div>

          <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '15px', color: '#0F172A', marginBottom: '8px' }}>
              <Database size={16} color="#2563EB" /> Event Storage & Retention
            </div>
            <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5 }}>
              Configure historical telemetry log retention policies and database sync options.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </motion.div>
  );
};

export default SettingsPage;
