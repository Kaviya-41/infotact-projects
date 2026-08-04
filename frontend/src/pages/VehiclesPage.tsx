/**
 * VehiclesPage.tsx – Dedicated Fleet Vehicles Page
 */

import React from 'react';
import SidebarNav from '../components/layout/SidebarNav';
import VehicleList from '../components/VehicleList';
import '../styles/dashboard.css';

const VehiclesPage: React.FC = () => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '76px 1fr', gap: '24px', padding: '24px', minHeight: '100vh', backgroundColor: '#F6F8FB' }}>
      <SidebarNav />
      <div>
        <VehicleList />
      </div>
    </div>
  );
};

export default VehiclesPage;
