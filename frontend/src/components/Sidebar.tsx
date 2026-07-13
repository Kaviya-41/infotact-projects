/**
 * Sidebar.tsx
 * Left navigation sidebar for FleetDash.
 * Week 1 – Static UI. Navigation items are non-functional links
 * (no React Router yet). Ready for future route wiring.
 */

import React, { useState } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────────

interface NavItem {
  id: string;
  label: string;
  icon: string;
  badge?: number;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const PRIMARY_NAV: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
  { id: 'live-map',  label: 'Live Map',  icon: '🗺' },
  { id: 'vehicles',  label: 'Vehicles',  icon: '🚚' },
  { id: 'alerts',    label: 'Alerts',    icon: '🔔', badge: 4 },
];

const SECONDARY_NAV: NavItem[] = [
  { id: 'reports',  label: 'Reports',  icon: '📊' },
  { id: 'settings', label: 'Settings', icon: '⚙' },
];

// ── Component ──────────────────────────────────────────────────────────────────

const Sidebar: React.FC = () => {
  const [activeId, setActiveId] = useState<string>('dashboard');

  const handleNavClick = (id: string): void => {
    setActiveId(id);
    // TODO Week 2: wire up React Router navigation here
  };

  return (
    <aside className="sidebar" role="navigation" aria-label="Main navigation">
      {/* Logo */}
      <div className="sidebar__logo" aria-label="FleetDash home">
        <div className="sidebar__logo-icon" aria-hidden="true">🚛</div>
        <span className="sidebar__logo-text">
          Fleet<span>Dash</span>
        </span>
      </div>

      {/* Primary Navigation */}
      <nav className="sidebar__nav">
        <span className="sidebar__section-label">Main</span>

        {PRIMARY_NAV.map((item) => (
          <button
            key={item.id}
            id={`sidebar-nav-${item.id}`}
            className={`sidebar__nav-item${activeId === item.id ? ' active' : ''}`}
            onClick={() => handleNavClick(item.id)}
            aria-current={activeId === item.id ? 'page' : undefined}
            type="button"
          >
            <span className="nav-icon" aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
            {item.badge !== undefined && (
              <span className="sidebar__badge" aria-label={`${item.badge} unread alerts`}>
                {item.badge}
              </span>
            )}
          </button>
        ))}

        <span className="sidebar__section-label">Manage</span>

        {SECONDARY_NAV.map((item) => (
          <button
            key={item.id}
            id={`sidebar-nav-${item.id}`}
            className={`sidebar__nav-item${activeId === item.id ? ' active' : ''}`}
            onClick={() => handleNavClick(item.id)}
            aria-current={activeId === item.id ? 'page' : undefined}
            type="button"
          >
            <span className="nav-icon" aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User Footer */}
      <div className="sidebar__footer">
        <div className="sidebar__user" role="button" tabIndex={0} aria-label="User profile">
          <div className="sidebar__user-avatar" aria-hidden="true">JD</div>
          <div className="sidebar__user-info">
            <p className="sidebar__user-name">John Dispatch</p>
            <p className="sidebar__user-role">Fleet Manager</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
