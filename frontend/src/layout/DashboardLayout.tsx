/**
 * DashboardLayout.tsx – FleetDash AppShell Layout Wrapper
 * Fixed sidebar + sticky header + scrollable content area.
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
    <div className="app-shell">
      <Sidebar />
      <div className="app-shell__main">
        <Header />
        <div className="app-shell__content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
