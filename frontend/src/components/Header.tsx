/**
 * Header.tsx – Top header bar for DisasterIQ
 * Light-themed with search, notifications, and live status indicator.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, Maximize2 } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="header" id="dashboard-header" role="banner">
      <div className="header__left">
        <h1 className="header__title">{title}</h1>
        <p className="header__subtitle">{subtitle}</p>
      </div>

      <div className="header__right">
        {/* Live badge */}
        <div className="header__live-badge" aria-label="System online">
          <span className="live-dot" aria-hidden="true" />
          LIVE
        </div>

        {/* Search */}
        <div className="header__search">
          <Search size={14} className="header__search-icon" />
          <input
            className="header__search-input"
            type="search"
            placeholder="Search incidents, locations…"
            id="header-search-input"
            aria-label="Search incidents"
          />
        </div>

        {/* Notification bell */}
        <motion.button
          className="header__icon-btn"
          type="button"
          aria-label="Notifications"
          id="header-notification-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Bell size={16} />
          <span className="notification-dot" aria-hidden="true" />
        </motion.button>

        {/* Fullscreen toggle */}
        <motion.button
          className="header__icon-btn"
          type="button"
          aria-label="Toggle fullscreen"
          id="header-fullscreen-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen?.();
            } else {
              document.exitFullscreen?.();
            }
          }}
        >
          <Maximize2 size={16} />
        </motion.button>
      </div>
    </header>
  );
};

export default Header;
