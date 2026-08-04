/**
 * AlertsPage.tsx – Dedicated Vehicle Alerts Page
 */

import React from 'react';
import SidebarNav from '../components/layout/SidebarNav';
import RecentAlerts from '../components/RecentAlerts';
import '../styles/dashboard.css';

const AlertsPage: React.FC = () => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '76px 1fr', gap: '24px', padding: '24px', minHeight: '100vh', backgroundColor: '#F6F8FB' }}>
      <SidebarNav />
      <div>
        <RecentAlerts />
      </div>
    </div>
  );
};

export default AlertsPage;
