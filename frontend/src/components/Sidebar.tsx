/**
 * Sidebar.tsx – FleetDash Enterprise Light Navigation Sidebar
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutGrid, Map, Truck, Bell, BarChart3, Settings, LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
}

const PRIMARY_NAV: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutGrid size={18} />, path: '/dashboard' },
  { id: 'live-map',  label: 'Live Map',  icon: <Map size={18} />, path: '/live-map' },
  { id: 'vehicles',  label: 'Vehicles',  icon: <Truck size={18} />, path: '/vehicles' },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={18} />, path: '/analytics' },
  { id: 'alerts',    label: 'Alerts',    icon: <Bell size={18} />, path: '/alerts', badge: 3 },
];

const SECONDARY_NAV: NavItem[] = [
  { id: 'settings', label: 'Settings', icon: <Settings size={18} />, path: '/settings' },
];

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();

  const renderNavItem = (item: NavItem) => (
    <NavLink
      key={item.id}
      to={item.path}
      end={item.path === '/dashboard'}
      id={`sidebar-nav-${item.id}`}
      className={({ isActive }) => `sidebar__nav-item${isActive ? ' active' : ''}`}
    >
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {item.icon}
      </span>
      <span>{item.label}</span>
      {item.badge !== undefined && (
        <span className="sidebar__badge">{item.badge}</span>
      )}
    </NavLink>
  );

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar__header">
        <div className="sidebar__logo-icon">
          <Truck size={20} />
        </div>
        <span className="sidebar__logo-text">Fleet<span>Dash</span></span>
      </div>

      {/* Primary Nav */}
      <nav className="sidebar__nav">
        <span className="sidebar__section-title">Navigation</span>
        {PRIMARY_NAV.map(renderNavItem)}

        <span className="sidebar__section-title" style={{ marginTop: '12px' }}>System</span>
        {SECONDARY_NAV.map(renderNavItem)}
      </nav>

      {/* User Footer & Logout */}
      <div className="sidebar__footer">
        <div className="sidebar__user">
          <div className="sidebar__avatar">
            {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'FM'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div className="sidebar__user-name">{user?.name || 'Fleet Manager'}</div>
            <div className="sidebar__user-role">{user?.company || 'LogiTech Operations'}</div>
          </div>
        </div>

        <button
          onClick={logout}
          className="sidebar__nav-item"
          style={{ width: '100%', marginTop: '6px', border: 'none', background: 'transparent', color: '#DC2626' }}
          title="Sign Out"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
