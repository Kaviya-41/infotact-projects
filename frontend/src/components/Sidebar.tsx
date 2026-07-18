/**
 * Sidebar.tsx
 * Left navigation sidebar for FleetDash.
 * Uses React Router NavLink for real navigation.
 *
 * UI Enhancement v2: Framer Motion AnimatePresence for collapse,
 * motion.button whileHover glow, system status bar at bottom.
 * All existing nav IDs, aria attributes preserved.
 */

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// ── Types ──────────────────────────────────────────────────────────────────────

interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: number;
  color?: string;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const PRIMARY_NAV: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '⊞', path: '/',         color: '#4F8CFF' },
  { id: 'live-map',  label: 'Live Map',  icon: '🗺', path: '/live-map', color: '#00D4FF' },
  { id: 'vehicles',  label: 'Vehicles',  icon: '🚚', path: '/vehicles', color: '#31D67B' },
  { id: 'alerts',    label: 'Alerts',    icon: '🔔', path: '/alerts',   badge: 4, color: '#FF5C5C' },
];

const SECONDARY_NAV: NavItem[] = [
  { id: 'reports',  label: 'Reports',  icon: '📊', path: '/reports',  color: '#A78BFA' },
  { id: 'settings', label: 'Settings', icon: '⚙', path: '/settings', color: '#8DA2C0' },
];

// ── Animation variants ─────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sidebarVariants: Record<string, any> = {
  expanded:  { width: 248, transition: { duration: 0.35, ease: 'easeOut' } },
  collapsed: { width:  68, transition: { duration: 0.30, ease: 'easeOut' } },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const labelVariants: Record<string, any> = {
  expanded:  { opacity: 1, x: 0, transition: { duration: 0.22, delay: 0.08 } },
  collapsed: { opacity: 0, x: -8, transition: { duration: 0.15 } },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const badgeVariants: Record<string, any> = {
  expanded:  { opacity: 1, scale: 1,   transition: { delay: 0.1 } },
  collapsed: { opacity: 0, scale: 0.5, transition: { duration: 0.1 } },
};

// ── Component ──────────────────────────────────────────────────────────────────

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const handleToggle = (): void => setCollapsed(prev => !prev);

  // Render a single nav item using NavLink
  const renderNavItem = (item: NavItem) => (
    <NavLink
      key={item.id}
      to={item.path}
      end={item.path === '/'}
      id={`sidebar-nav-${item.id}`}
      className={({ isActive }) =>
        `sidebar__nav-item${isActive ? ' active' : ''}`
      }
      title={collapsed ? item.label : undefined}
    >
      <span className="nav-icon" aria-hidden="true">
        {item.icon}
      </span>

      <AnimatePresence>
        {!collapsed && (
          <motion.span
            variants={labelVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {item.badge !== undefined && !collapsed && (
          <motion.span
            className="sidebar__badge"
            aria-label={`${item.badge} unread alerts`}
            variants={badgeVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
          >
            {item.badge}
          </motion.span>
        )}
      </AnimatePresence>
    </NavLink>
  );

  return (
    <motion.aside
      className={`sidebar${collapsed ? ' sidebar--collapsed' : ''}`}
      role="navigation"
      aria-label="Main navigation"
      variants={sidebarVariants}
      animate={collapsed ? 'collapsed' : 'expanded'}
      initial="expanded"
    >
      {/* Collapse/Expand toggle button */}
      <motion.button
        className="sidebar__collapse-btn"
        type="button"
        onClick={handleToggle}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        whileHover={{ scale: 1.15, boxShadow: '0 0 20px rgba(79,140,255,0.5)' }}
        whileTap={{ scale: 0.92 }}
      >
        <motion.span
          className="collapse-arrow"
          animate={{ rotate: collapsed ? 0 : 180 }}
          transition={{ duration: 0.3 }}
          aria-hidden="true"
        >
          ›
        </motion.span>
      </motion.button>

      {/* Logo */}
      <div className="sidebar__logo" aria-label="FleetDash home">
        <motion.div
          className="sidebar__logo-icon"
          aria-hidden="true"
          whileHover={{ rotate: -8, scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          🚛
        </motion.div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              className="sidebar__logo-text"
              variants={labelVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
            >
              Fleet<span>Dash</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Primary Navigation */}
      <nav className="sidebar__nav">
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              className="sidebar__section-label"
              variants={labelVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
            >
              Main
            </motion.span>
          )}
        </AnimatePresence>

        {PRIMARY_NAV.map(renderNavItem)}

        <AnimatePresence>
          {!collapsed && (
            <motion.span
              className="sidebar__section-label"
              variants={labelVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
            >
              Manage
            </motion.span>
          )}
        </AnimatePresence>

        {SECONDARY_NAV.map(renderNavItem)}
      </nav>

      {/* System Status Bar */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            className="sidebar__system-status"
            variants={labelVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            aria-label="System status"
          >
            <div className="sys-status-row">
              <span className="sys-status-label">Network</span>
              <div className="sys-status-bar">
                <div className="sys-status-fill sys-status-fill--high" style={{ width: '82%' }} />
              </div>
              <span className="sys-status-pct">82%</span>
            </div>
            <div className="sys-status-row">
              <span className="sys-status-label">CPU</span>
              <div className="sys-status-bar">
                <div className="sys-status-fill sys-status-fill--med" style={{ width: '45%' }} />
              </div>
              <span className="sys-status-pct">45%</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Footer */}
      <div className="sidebar__footer">
        <motion.div
          className="sidebar__user"
          role="button"
          tabIndex={0}
          aria-label="User profile"
          whileHover={{ backgroundColor: 'rgba(79,140,255,0.07)' }}
          transition={{ duration: 0.15 }}
        >
          <div className="sidebar__user-avatar" aria-hidden="true">JD</div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                className="sidebar__user-info"
                variants={labelVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
              >
                <p className="sidebar__user-name">John Dispatch</p>
                <p className="sidebar__user-role">Fleet Manager</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
