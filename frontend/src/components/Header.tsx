/**
 * Header.tsx – FleetDash Enterprise Light Header Component
 */

import React from 'react';
import { Search, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({
  title = "Good Morning, Fleet Manager",
  subtitle = "Here's what's happening with your fleet today."
}) => {
  const { user } = useAuth();
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="header">
      <div className="header__left">
        <h1 className="header__greeting">
          {user ? `Good Morning, ${user.name.split(' ')[0]}` : title}
        </h1>
        <p className="header__subtitle">{subtitle}</p>
      </div>

      <div className="header__right">
        {/* GPS Live Status */}
        <div className="header__gps-badge">
          <span className="header__gps-dot" />
          <span>GPS Connected</span>
        </div>

        {/* Date Display */}
        <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 500, padding: '0 8px' }}>
          {currentDate}
        </div>

        {/* Search */}
        <div className="header__search">
          <Search size={15} className="header__search-icon" />
          <input
            type="search"
            className="header__search-input"
            placeholder="Search vehicles, drivers, locations…"
          />
        </div>

        {/* Notifications */}
        <button className="header__icon-btn" aria-label="Notifications">
          <Bell size={18} />
          <span className="header__notification-dot" />
        </button>

        {/* User Avatar */}
        <div className="sidebar__avatar" style={{ width: '36px', height: '36px', cursor: 'pointer' }}>
          {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'FM'}
        </div>
      </div>
    </header>
  );
};

export default Header;
