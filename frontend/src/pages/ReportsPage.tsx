/**
 * ReportsPage.tsx – Dedicated Fleet Analytics Page
 */

import React from 'react';
import SidebarNav from '../components/layout/SidebarNav';
import FleetAnalytics from '../components/FleetAnalytics';
import '../styles/dashboard.css';

const ReportsPage: React.FC = () => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '76px 1fr', gap: '24px', padding: '24px', minHeight: '100vh', backgroundColor: '#F6F8FB' }}>
      <SidebarNav />
      <div>
        <FleetAnalytics />
      </div>
    </div>
  );
};

export default ReportsPage;
