/**
 * SidebarNav.tsx – Vertical Navigation Capsule Control Dock
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutGrid, Map, Truck, BarChart3, Bell, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutGrid size={20} />, path: '/dashboard' },
  { id: 'live-map',  label: 'Live Map',  icon: <Map size={20} />, path: '/live-map' },
  { id: 'vehicles',  label: 'Vehicles',  icon: <Truck size={20} />, path: '/vehicles' },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} />, path: '/analytics' },
  { id: 'alerts',    label: 'Alerts',    icon: <Bell size={20} />, path: '/alerts', badge: true },
  { id: 'settings',  label: 'Settings',  icon: <Settings size={20} />, path: '/settings' },
];

const SidebarNav: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar-dock" aria-label="Automotive Telemetry Navigation">
      {/* Brand Icon Header */}
      <div className="sidebar-dock__logo" title="FleetDash Telemetry Platform">
        <Truck size={22} />
      </div>

      {/* Main Nav Capsule Items */}
      <nav className="sidebar-dock__nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) => `sidebar-dock__item${isActive ? ' active' : ''}`}
            title={item.label}
          >
            {item.icon}
            {item.badge && <span className="sidebar-dock__badge" />}
          </NavLink>
        ))}
      </nav>

      {/* Footer Profile & Logout */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: '#EFF6FF',
            color: '#2563EB',
            fontWeight: 700,
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #BFDBFE',
            cursor: 'pointer'
          }}
          title={user?.name || 'Fleet Manager'}
        >
          {user?.name ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2) : 'FM'}
        </div>

        <button
          onClick={logout}
          className="sidebar-dock__item"
          style={{ color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer' }}
          title="Sign Out"
        >
          <LogOut size={20} />
        </button>
      </div>
    </aside>
  );
};

export default SidebarNav;
