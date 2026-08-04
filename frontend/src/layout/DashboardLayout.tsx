/**
 * DashboardLayout.tsx – Main Shell Layout Wrapper for FleetDash
 */

import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../styles/dashboard.css';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="dashboard-shell">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
