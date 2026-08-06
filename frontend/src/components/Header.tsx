/**
 * Header.tsx – FleetDash Premium Light Header Component
 * Contains Fleet Operations greeting, search bar, + Add Vehicle and Create Trip action buttons,
 * and GPS / Server / Socket live telemetry status pills.
 */

import React from 'react';
import { Search, Bell, Plus, Route as RouteIcon, Wifi, Server, Radio, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/dashboard.css';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onAddVehicle?: () => void;
  onCreateTrip?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title = "Good Morning, Admin",
  subtitle = "Here's what's happening with your fleet today.",
  onAddVehicle,
  onCreateTrip,
}) => {
  const { user } = useAuth();

  return (
    <header className="header" style={{ height: 'auto', padding: '16px 32px', flexDirection: 'column', gap: '16px' }}>
      {/* Top Bar: Title & Status Badges */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div>
          <h1 className="header__greeting">
            {user ? `Good Morning, ${user.name.split(' ')[0]}` : title}
          </h1>
          <p className="header__subtitle">{subtitle}</p>
        </div>

        <div className="header__right" style={{ gap: '12px' }}>
          {/* Status Badges */}
          <div className="header__status-badge header__status-badge--online" aria-label="GPS Status: Online">
            <span className="header__status-dot header__status-dot--green" aria-hidden="true" />
            <Wifi size={13} />
            <span>GPS Online</span>
          </div>

          <div className="header__status-badge header__status-badge--online" aria-label="Server Status: Healthy">
            <span className="header__status-dot header__status-dot--green" aria-hidden="true" />
            <Server size={13} />
            <span>Server Healthy</span>
          </div>

          <div className="header__status-badge header__status-badge--online" aria-label="Socket Status: Live Connected">
            <span className="header__status-dot header__status-dot--green" aria-hidden="true" />
            <Radio size={13} />
            <span>Live Connected</span>
          </div>

          {/* Notifications */}
          <button className="header__icon-btn" aria-label="View notifications">
            <Bell size={18} />
            <span className="header__notification-dot" aria-hidden="true" />
          </button>

          {/* Help button */}
          <button className="header__icon-btn" aria-label="Help & Documentation" title="Help">
            <HelpCircle size={18} />
          </button>

          {/* User Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} title={user?.name || 'Admin Profile'}>
            <div className="sidebar__avatar" style={{ width: '36px', height: '36px', fontSize: '13px' }}>
              {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'AD'}
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>
              {user?.name || 'Admin'}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Search & Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '16px' }}>
        {/* Search */}
        <div className="header__search" style={{ flex: 1, maxWidth: '480px' }}>
          <Search size={16} className="header__search-icon" />
          <input
            type="search"
            className="header__search-input"
            placeholder="Search vehicles, drivers, routes or trips..."
            aria-label="Search vehicles, drivers, routes or trips"
          />
        </div>

        {/* Primary & Secondary Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onCreateTrip}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', borderRadius: '10px',
              backgroundColor: '#FFFFFF', color: '#0F172A',
              border: '1px solid #E2E8F0', fontSize: '13px', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.15s ease',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F8FAFC'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
          >
            <RouteIcon size={15} color="#2563EB" />
            <span>Create Trip</span>
          </button>

          <button
            onClick={onAddVehicle}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 18px', borderRadius: '10px',
              backgroundColor: '#2563EB', color: '#FFFFFF',
              border: 'none', fontSize: '13px', fontWeight: 700,
              cursor: 'pointer', transition: 'all 0.15s ease',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1D4ED8'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#2563EB'; }}
          >
            <Plus size={16} />
            <span>Add Vehicle</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
