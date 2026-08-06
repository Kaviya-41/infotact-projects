/**
 * Sidebar.tsx – FleetDash Premium Light Navigation Sidebar
 * Structured into NAVIGATION, MANAGEMENT, and SYSTEM sections.
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutGrid, Map, Truck, Navigation as RouteIcon, BarChart3, Bell,
  Users, FileText, Settings, LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/dashboard.css';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
}

const NAVIGATION_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutGrid size={18} />, path: '/dashboard' },
  { id: 'live-map',  label: 'Live Map',  icon: <Map size={18} />, path: '/live-map' },
  { id: 'vehicles',  label: 'Vehicles',  icon: <Truck size={18} />, path: '/vehicles' },
  { id: 'trips',     label: 'Trips',     icon: <RouteIcon size={18} />, path: '/vehicles' },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={18} />, path: '/analytics' },
  { id: 'alerts',    label: 'Alerts',    icon: <Bell size={18} />, path: '/alerts', badge: 3 },
];

const MANAGEMENT_ITEMS: NavItem[] = [
  { id: 'drivers', label: 'Drivers', icon: <Users size={18} />, path: '/vehicles' },
  { id: 'reports', label: 'Reports', icon: <FileText size={18} />, path: '/analytics' },
];

const SYSTEM_ITEMS: NavItem[] = [
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
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {item.icon}
      </span>
      <span>{item.label}</span>
      {item.badge !== undefined && (
        <span className="sidebar__badge">{item.badge}</span>
      )}
    </NavLink>
  );

  return (
    <aside className="sidebar" aria-label="Main navigation">
      {/* Brand Header */}
      <div className="sidebar__header">
        <div className="sidebar__logo-icon">
          <Truck size={20} />
        </div>
        <span className="sidebar__logo-text">Fleet<span>Dash</span></span>
      </div>

      {/* Nav Sections */}
      <nav className="sidebar__nav">
        <span className="sidebar__section-title">NAVIGATION</span>
        {NAVIGATION_ITEMS.map(renderNavItem)}

        <span className="sidebar__section-title" style={{ marginTop: '16px' }}>MANAGEMENT</span>
        {MANAGEMENT_ITEMS.map(renderNavItem)}

        <span className="sidebar__section-title" style={{ marginTop: '16px' }}>SYSTEM</span>
        {SYSTEM_ITEMS.map(renderNavItem)}
      </nav>

      {/* User Footer */}
      <div className="sidebar__footer">
        <div className="sidebar__user">
          <div className="sidebar__avatar">
            {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'AD'}
          </div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div className="sidebar__user-name">{user?.name || 'Admin'}</div>
            <div className="sidebar__user-role">{user?.company || 'LogiTech Logistics'}</div>
          </div>
        </div>

        <button
          onClick={logout}
          className="sidebar__nav-item"
          style={{ width: '100%', marginTop: '6px', color: '#EF4444', fontFamily: 'inherit', fontSize: '13px', fontWeight: 600 }}
          title="Sign Out"
          aria-label="Sign out of FleetDash"
        >
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LogOut size={16} />
          </span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
