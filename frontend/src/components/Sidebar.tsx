/**
 * Sidebar.tsx – Vertical navigation dock for DisasterIQ
 * Light-themed with amber active indicators, collapsible layout,
 * and logout button at bottom.
 */

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutGrid, Map, Building2, Bell, BarChart3, Settings,
  ChevronLeft, Shield, LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// ── Types ──────────────────────────────────────────────────────────────────────

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const PRIMARY_NAV: NavItem[] = [
  { id: 'dashboard',      label: 'Dashboard',      icon: <LayoutGrid size={18} />,  path: '/' },
  { id: 'incident-map',   label: 'Incident Map',   icon: <Map size={18} />,         path: '/incident-map' },
  { id: 'infrastructure', label: 'Infrastructure',  icon: <Building2 size={18} />,   path: '/infrastructure' },
  { id: 'alerts',         label: 'Alerts',          icon: <Bell size={18} />,        path: '/alerts', badge: 5 },
];

const SECONDARY_NAV: NavItem[] = [
  { id: 'reports',  label: 'Reports',  icon: <BarChart3 size={18} />, path: '/reports' },
  { id: 'settings', label: 'Settings', icon: <Settings size={18} />,  path: '/settings' },
];

// ── Animation variants ─────────────────────────────────────────────────────────

const sidebarVariants = {
  expanded:  { width: 240, transition: { duration: 0.35, ease: [0.25, 0.8, 0.25, 1] as const } },
  collapsed: { width:  72, transition: { duration: 0.30, ease: [0.25, 0.8, 0.25, 1] as const } },
};

const labelVariants = {
  expanded:  { opacity: 1, x: 0, transition: { duration: 0.22, delay: 0.08 } },
  collapsed: { opacity: 0, x: -8, transition: { duration: 0.15 } },
};

const badgeVariants = {
  expanded:  { opacity: 1, scale: 1,   transition: { delay: 0.1 } },
  collapsed: { opacity: 0, scale: 0.5, transition: { duration: 0.1 } },
};

// ── Component ──────────────────────────────────────────────────────────────────

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();

  const handleToggle = () => setCollapsed(prev => !prev);

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
            aria-label={`${item.badge} active alerts`}
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
      {/* Collapse toggle */}
      <motion.button
        className="sidebar__collapse-btn"
        type="button"
        onClick={handleToggle}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.92 }}
      >
        <motion.div
          className="collapse-arrow"
          animate={{ rotate: collapsed ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          aria-hidden="true"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ChevronLeft size={14} />
        </motion.div>
      </motion.button>

      {/* Logo */}
      <div className="sidebar__logo" aria-label="DisasterIQ home">
        <motion.div
          className="sidebar__logo-icon"
          aria-hidden="true"
          whileHover={{ rotate: -8, scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Shield size={18} color="#FFFFFF" />
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
              Disaster<span>IQ</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Primary Nav */}
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
              Monitor
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

      {/* System status */}
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
              <span className="sys-status-label">Uptime</span>
              <div className="sys-status-bar">
                <div className="sys-status-fill sys-status-fill--high" style={{ width: '99%' }} />
              </div>
              <span className="sys-status-pct">99%</span>
            </div>
            <div className="sys-status-row">
              <span className="sys-status-label">Load</span>
              <div className="sys-status-bar">
                <div className="sys-status-fill sys-status-fill--med" style={{ width: '38%' }} />
              </div>
              <span className="sys-status-pct">38%</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User footer */}
      <div className="sidebar__footer">
        <motion.div
          className="sidebar__user"
          role="button"
          tabIndex={0}
          aria-label="User profile"
          whileHover={{ backgroundColor: 'rgba(255,138,0,0.06)' }}
          transition={{ duration: 0.15 }}
        >
          <div className="sidebar__user-avatar" aria-hidden="true">
            {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                className="sidebar__user-info"
                variants={labelVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
              >
                <p className="sidebar__user-name">{user?.name || 'User'}</p>
                <p className="sidebar__user-role">{user?.role || 'Coordinator'}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Logout */}
        <motion.button
          type="button"
          className="sidebar__nav-item"
          onClick={logout}
          title="Sign out"
          style={{ marginTop: 4, color: '#EF4444' }}
          whileHover={{ backgroundColor: 'rgba(239,68,68,0.06)' }}
        >
          <span className="nav-icon" aria-hidden="true"><LogOut size={18} /></span>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                variants={labelVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
              >
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
