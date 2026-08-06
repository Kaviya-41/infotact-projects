/**
 * Header.tsx – FleetDash Premium Light Header with Status Indicators
 * Shows greeting, search, GPS/Server/Socket status badges, notifications, and user profile.
 */

import React from 'react';
import { Search, Bell, Wifi, Server, Radio } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/dashboard.css';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle = "Here's what's happening with your fleet today."
}) => {
  const { user } = useAuth();
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  })();

  return (
    <header className="header">
      <div className="header__left">
        <h1 className="header__greeting">
          {user ? `${greeting}, ${user.name.split(' ')[0]}` : title || `${greeting}`}
        </h1>
        <p className="header__subtitle">{subtitle}</p>
      </div>

      <div className="header__right">
        {/* GPS Status */}
        <div className="header__status-badge header__status-badge--online" aria-label="GPS Status: Connected">
          <span className="header__status-dot header__status-dot--green" aria-hidden="true" />
          <Wifi size={13} />
          <span>GPS</span>
        </div>

        {/* Server Status */}
        <div className="header__status-badge header__status-badge--online" aria-label="Server Status: Online">
          <span className="header__status-dot header__status-dot--green" aria-hidden="true" />
          <Server size={13} />
          <span>Server</span>
        </div>

        {/* Socket Status */}
        <div className="header__status-badge header__status-badge--online" aria-label="Socket Status: Connected">
          <span className="header__status-dot header__status-dot--green" aria-hidden="true" />
          <Radio size={13} />
          <span>Socket</span>
        </div>

        {/* Date Display */}
        <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 500, padding: '0 4px', whiteSpace: 'nowrap' }}>
          {currentDate}
        </div>

        {/* Search */}
        <div className="header__search">
          <Search size={15} className="header__search-icon" />
          <input
            type="search"
            className="header__search-input"
            placeholder="Search vehicles, drivers…"
            aria-label="Search vehicles, drivers, and locations"
          />
        </div>

        {/* Notifications */}
        <button className="header__icon-btn" aria-label="View notifications">
          <Bell size={18} />
          <span className="header__notification-dot" aria-hidden="true" />
        </button>

        {/* User Avatar */}
        <div className="sidebar__avatar" style={{ width: '36px', height: '36px', cursor: 'pointer', fontSize: '12px' }} title={user?.name || 'Profile'}>
          {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'FM'}
        </div>
      </div>
    </header>
  );
};

export default Header;
