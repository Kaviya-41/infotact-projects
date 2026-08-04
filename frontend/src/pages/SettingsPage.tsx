/**
 * SettingsPage.tsx – Dedicated System Settings Page
 */

import React from 'react';
import SidebarNav from '../components/layout/SidebarNav';
import SettingsView from '../components/FleetAnalytics';
import '../styles/dashboard.css';

const SettingsPage: React.FC = () => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '76px 1fr', gap: '24px', padding: '24px', minHeight: '100vh', backgroundColor: '#F6F8FB' }}>
      <SidebarNav />
      <div>
        <SettingsView />
      </div>
    </div>
  );
};

export default SettingsPage;
