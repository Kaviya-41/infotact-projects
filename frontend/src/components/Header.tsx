/**
 * Header.tsx
 * Top application bar for FleetDash.
 * Week 1 – Static UI. Search is a controlled input (no API call).
 * Ready for future search integration and notification feed.
 *
 * UI Enhancement v2: Framer Motion entrance, live clock, fleet status,
 * weather placeholder. All existing element IDs, search, notification
 * logic preserved exactly.
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// ── Types ──────────────────────────────────────────────────────────────────────

interface HeaderProps {
  /** Page title displayed in the header */
  title?: string;
  /** Subtitle / breadcrumb shown beneath the title */
  subtitle?: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour:   '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month:   'short',
    day:     'numeric',
  });
}

// ── Component ──────────────────────────────────────────────────────────────────

const Header: React.FC<HeaderProps> = ({
  title    = 'Fleet Dashboard',
  subtitle = 'Real-time fleet monitoring & analytics',
}) => {
  const [searchQuery, setSearchQuery]   = useState<string>('');
  const [notificationCount]             = useState<number>(4); // TODO: drive from WS events (Week 3)
  const [currentTime, setCurrentTime]   = useState<Date>(new Date());

  // Live clock — updates every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
    // TODO Week 3: debounce + filter vehicle list via socket/api
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Escape') setSearchQuery('');
  };

  return (
    <motion.header
      className="header"
      role="banner"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Page Title */}
      <div className="header__title-block">
        <h1 className="header__title">{title}</h1>
        <p className="header__subtitle">{subtitle}</p>
      </div>

      {/* Top Navigation Enterprise Status Badges */}
      <div className="header__status-strip" role="region" aria-label="Enterprise operational status">
        {/* Weather Widget */}
        <div className="header__status-pill header__weather" title="Live Weather Center">
          <span className="header__pill-icon" aria-hidden="true">☀</span>
          <span className="header__pill-text">29°C Bengaluru</span>
        </div>

        {/* GPS Status */}
        <div className="header__status-pill header__gps" title="GPS Satellite Network Active">
          <span className="header__pill-icon" aria-hidden="true">🛰</span>
          <span className="header__pill-text">GPS Online</span>
        </div>

        {/* Server Status */}
        <div className="header__status-pill header__server" title="Server Operations Normal">
          <span className="header__pill-dot green" aria-hidden="true" />
          <span className="header__pill-text">Server Healthy</span>
        </div>

        {/* Connection Status */}
        <div className="header__status-pill header__socket" title="Real-time Telemetry Stream Active">
          <span className="header__pill-dot green" aria-hidden="true" />
          <span className="header__pill-text">Socket Ready</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="header__search" role="search">
        <span className="header__search-icon" aria-hidden="true">🔍</span>
        <input
          id="fleet-search-input"
          type="search"
          className="header__search-input"
          placeholder="Search vehicles, drivers…"
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleSearchKeyDown}
          aria-label="Search vehicles and drivers"
          autoComplete="off"
        />
      </div>

      {/* Action Icons */}
      <div className="header__actions">
        {/* Refresh */}
        <motion.button
          id="header-refresh-btn"
          className="header__icon-btn"
          type="button"
          aria-label="Refresh dashboard data"
          title="Refresh"
          whileHover={{ scale: 1.08, backgroundColor: 'rgba(79,140,255,0.15)' }}
          whileTap={{ scale: 0.92, rotate: 180 }}
          transition={{ duration: 0.15 }}
        >
          🔄
        </motion.button>

        {/* Notifications */}
        <motion.button
          id="header-notifications-btn"
          className="header__icon-btn"
          type="button"
          aria-label={`Notifications – ${notificationCount} unread`}
          title="Notifications"
          whileHover={{ scale: 1.08, backgroundColor: 'rgba(79,140,255,0.15)' }}
          whileTap={{ scale: 0.92 }}
          transition={{ duration: 0.15 }}
        >
          🔔
          {notificationCount > 0 && (
            <span className="header__notification-dot" aria-hidden="true" />
          )}
        </motion.button>

        {/* User Avatar */}
        <motion.div
          id="header-user-avatar"
          className="header__avatar"
          role="button"
          tabIndex={0}
          aria-label="Open user profile menu"
          title="John Dispatch – Fleet Manager"
          whileHover={{ scale: 1.12, boxShadow: '0 0 28px rgba(0,212,255,0.55)' }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 350 }}
        >
          JD
        </motion.div>
      </div>

      {/* Live Clock */}
      <div className="header__clock" aria-label="Current time" aria-live="polite">
        <span className="header__clock-time">{formatTime(currentTime)}</span>
        <span className="header__clock-date">{formatDate(currentTime)}</span>
      </div>
    </motion.header>
  );
};

export default Header;
