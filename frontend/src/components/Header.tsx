/**
 * Header.tsx
 * Top application bar for FleetDash.
 * Week 1 – Static UI. Search is a controlled input (no API call).
 * Ready for future search integration and notification feed.
 */

import React, { useState } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────────

interface HeaderProps {
  /** Page title displayed in the header */
  title?: string;
  /** Subtitle / breadcrumb shown beneath the title */
  subtitle?: string;
}

// ── Component ──────────────────────────────────────────────────────────────────

const Header: React.FC<HeaderProps> = ({
  title = 'Fleet Dashboard',
  subtitle = 'Real-time fleet monitoring & analytics',
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notificationCount] = useState<number>(4); // TODO: drive from WS events (Week 3)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
    // TODO Week 3: debounce + filter vehicle list via socket/api
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Escape') {
      setSearchQuery('');
    }
  };

  return (
    <header className="header" role="banner">
      {/* Page Title */}
      <div className="header__title-block">
        <h1 className="header__title">{title}</h1>
        <p className="header__subtitle">{subtitle}</p>
      </div>

      {/* Search */}
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
        {/* Refresh – placeholder for future live reload */}
        <button
          id="header-refresh-btn"
          className="header__icon-btn"
          type="button"
          aria-label="Refresh dashboard data"
          title="Refresh"
        >
          🔄
        </button>

        {/* Notifications */}
        <button
          id="header-notifications-btn"
          className="header__icon-btn"
          type="button"
          aria-label={`Notifications – ${notificationCount} unread`}
          title="Notifications"
        >
          🔔
          {notificationCount > 0 && (
            <span className="header__notification-dot" aria-hidden="true" />
          )}
        </button>

        {/* User Avatar */}
        <div
          id="header-user-avatar"
          className="header__avatar"
          role="button"
          tabIndex={0}
          aria-label="Open user profile menu"
          title="John Dispatch – Fleet Manager"
        >
          JD
        </div>
      </div>
    </header>
  );
};

export default Header;
