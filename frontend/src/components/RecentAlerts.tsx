/**
 * RecentAlerts.tsx – Enterprise Fleet Operations Live Alerts Panel
 * Inspired by Amazon Logistics, DHL, FedEx, & Uber Freight command centers.
 * 
 * Features:
 * - Floating glassmorphic panel with dark theme, rounded corners (20px), thin glowing borders & soft shadows
 * - Header: Live Indicator, Notification Bell animation, Active Alerts Counter, Search Box & Priority Filter Tabs
 * - Priority Color System:
 *     Critical → Red (pulsing glow)
 *     High → Orange
 *     Medium → Yellow
 *     Low → Blue
 *     Resolved / Completed → Green
 * - Interactive Expandable Cards (Driver Name, Vehicle Type, Current Speed, Coordinates & Action triggers)
 * - Alert Types: Vehicle Offline, Geofence Entry/Exit, Overspeed Alert, Route Deviation, Emergency Alert, Maintenance Warning
 * - Loading Skeleton Shimmer toggle & floating glass Empty State
 * - Responsive: Desktop right-side panel, Tablet collapsible panel, Mobile slide-up bottom sheet
 * - 100% Backward Compatible with existing FleetAlert data & props
 */

import React, { memo, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PremiumSkeleton, PremiumEmptyState, PremiumErrorState } from './StateFeedback';

// ── Types ──────────────────────────────────────────────────────────────────────

export type AlertPriority = 'Critical' | 'High' | 'Medium' | 'Low' | 'Resolved' | 'Warning' | 'Information';

export interface FleetAlert {
  id: string;
  severity: 'Critical' | 'Warning' | 'Information' | 'High' | 'Medium' | 'Low' | 'Resolved';
  title: string;
  description: string;
  vehicleId: string;
  timestamp: string;
  // Extended telemetry properties for enterprise display
  vehicleName?: string;
  vehicleType?: string;
  driverName?: string;
  currentSpeed?: number;
  locationName?: string;
  latitude?: number;
  longitude?: number;
  alertIcon?: string;
  vehicleIcon?: string;
  priority?: AlertPriority;
}

interface RecentAlertsProps {
  alerts?: FleetAlert[];
  isError?: boolean;
}

// ── Dummy Alerts Dataset ───────────────────────────────────────────────────────

const DUMMY_ALERTS: FleetAlert[] = [
  {
    id: 'alert-001',
    severity: 'Critical',
    priority: 'Critical',
    title: 'Emergency Alert: Engine Overheat',
    description: 'Engine coolant temperature exceeded safe threshold (112°C). Immediate inspection required.',
    vehicleId: 'FLT-007',
    vehicleName: 'Heavy Truck #007',
    vehicleType: 'Heavy Truck',
    driverName: 'Suresh Babu',
    currentSpeed: 68,
    locationName: 'Tech Park Bypass',
    latitude: 12.2958,
    longitude: 76.6394,
    timestamp: '2 min ago',
    alertIcon: '🚨',
    vehicleIcon: '🚛',
  },
  {
    id: 'alert-002',
    severity: 'Critical',
    priority: 'Critical',
    title: 'Vehicle Offline: GPS Signal Lost',
    description: 'Telemetry connection lost for more than 15 minutes in dead zone corridor.',
    vehicleId: 'FLT-010',
    vehicleName: 'Heavy Truck #010',
    vehicleType: 'Heavy Truck',
    driverName: 'Mohan Das',
    currentSpeed: 0,
    locationName: 'North Cargo Terminal',
    latitude: 11.1271,
    longitude: 78.6569,
    timestamp: '18 min ago',
    alertIcon: '📡',
    vehicleIcon: '🚛',
  },
  {
    id: 'alert-003',
    severity: 'High',
    priority: 'High',
    title: 'Overspeed Alert: Speed Threshold Exceeded',
    description: 'Vehicle traveling at 112 km/h in a 80 km/h restricted highway zone.',
    vehicleId: 'FLT-004',
    vehicleName: 'Trailer Hauler #004',
    vehicleType: 'Trailer Hauler',
    driverName: 'Naveen Reddy',
    currentSpeed: 112,
    locationName: 'Airport Expressway',
    latitude: 17.3850,
    longitude: 78.4867,
    timestamp: '25 min ago',
    alertIcon: '⚡',
    vehicleIcon: '🚜',
  },
  {
    id: 'alert-004',
    severity: 'Medium',
    priority: 'Medium',
    title: 'Route Deviation Detected',
    description: 'Vehicle diverted 4.2 km away from assigned logistics delivery path.',
    vehicleId: 'FLT-002',
    vehicleName: 'Cargo Van #002',
    vehicleType: 'Cargo Van',
    driverName: 'Arjun Singh',
    currentSpeed: 48,
    locationName: 'Outer Ring Road',
    latitude: 13.0827,
    longitude: 80.2707,
    timestamp: '34 min ago',
    alertIcon: '🧭',
    vehicleIcon: '🚐',
  },
  {
    id: 'alert-005',
    severity: 'Low',
    priority: 'Low',
    title: 'Geofence Exit Notification',
    description: 'Vehicle cleared customs perimeter and entered Outer Ring Sector 4.',
    vehicleId: 'FLT-001',
    vehicleName: 'Heavy Truck #001',
    vehicleType: 'Heavy Truck',
    driverName: 'Rahul Kumar',
    currentSpeed: 65,
    locationName: 'Bengaluru East',
    latitude: 12.9716,
    longitude: 77.5946,
    timestamp: '45 min ago',
    alertIcon: '📍',
    vehicleIcon: '🚛',
  },
  {
    id: 'alert-006',
    severity: 'Resolved',
    priority: 'Resolved',
    title: 'Maintenance Warning Resolved',
    description: 'Scheduled oil change and brake pad check completed successfully at depot.',
    vehicleId: 'FLT-008',
    vehicleName: 'Cargo Van #008',
    vehicleType: 'Cargo Van',
    driverName: 'Deepak Menon',
    currentSpeed: 0,
    locationName: 'Central Logistics Hub',
    latitude: 10.8505,
    longitude: 76.2711,
    timestamp: '1 hr ago',
    alertIcon: '✅',
    vehicleIcon: '🚐',
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function getPriorityBadgeInfo(priority?: AlertPriority | string) {
  const p = (priority ?? 'Medium').toLowerCase();
  if (p === 'critical') {
    return {
      label: 'Critical',
      badgeClass: 'a-badge a-badge--critical',
      dotClass: 'a-dot a-dot--critical',
      color: '#FF5C5C',
    };
  }
  if (p === 'high' || p === 'warning') {
    return {
      label: 'High',
      badgeClass: 'a-badge a-badge--high',
      dotClass: 'a-dot a-dot--high',
      color: '#F97316',
    };
  }
  if (p === 'medium') {
    return {
      label: 'Medium',
      badgeClass: 'a-badge a-badge--medium',
      dotClass: 'a-dot a-dot--medium',
      color: '#FFB547',
    };
  }
  if (p === 'low' || p === 'information') {
    return {
      label: 'Low',
      badgeClass: 'a-badge a-badge--low',
      dotClass: 'a-dot a-dot--low',
      color: '#4F8CFF',
    };
  }
  if (p === 'resolved' || p === 'completed') {
    return {
      label: 'Resolved',
      badgeClass: 'a-badge a-badge--resolved',
      dotClass: 'a-dot a-dot--resolved',
      color: '#31D67B',
    };
  }
  return {
    label: 'Medium',
    badgeClass: 'a-badge a-badge--medium',
    dotClass: 'a-dot a-dot--medium',
    color: '#FFB547',
  };
}

// ── Sub-component: Single Alert Card ───────────────────────────────────────────

interface AlertCardProps {
  alert: FleetAlert;
  index: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const AlertCardItem: React.FC<AlertCardProps> = memo(
  ({ alert, index, isExpanded, onToggleExpand }) => {
    const badgeInfo = getPriorityBadgeInfo(alert.priority ?? alert.severity);
    const isCritical = (alert.priority ?? alert.severity).toLowerCase() === 'critical';

    return (
      <motion.li
        id={alert.id}
        className={`a-card ${isCritical ? 'a-card--critical-glow' : ''}`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
        whileHover={{ y: -2, backgroundColor: 'rgba(25, 38, 64, 0.7)' }}
        layout
      >
        {/* Card Main Bar */}
        <div className="a-card__main" onClick={onToggleExpand}>
          {/* Alert Icon & Priority Indicator */}
          <div className="a-card__left">
            <div className="a-icon-box">
              <span className="a-icon-emoji">{alert.alertIcon ?? '🚨'}</span>
              <span className={badgeInfo.dotClass} />
            </div>
          </div>

          {/* Central Alert Text */}
          <div className="a-card__center">
            <div className="a-card__header-row">
              <span className="a-card__title">{alert.title}</span>
              <span className={badgeInfo.badgeClass}>{badgeInfo.label}</span>
            </div>
            <p className="a-card__desc">{alert.description}</p>
            <div className="a-card__meta">
              <span className="a-tag-vehicle">
                <span className="a-v-icon">{alert.vehicleIcon ?? '🚚'}</span>
                {alert.vehicleId}
              </span>
              <span className="a-meta-item">📍 {alert.locationName ?? 'In Transit'}</span>
              <span className="a-meta-item a-time">⏱ {alert.timestamp}</span>
            </div>
          </div>

          <div className="a-card__right">
            <button className={`a-expand-btn ${isExpanded ? 'active' : ''}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </button>
          </div>
        </div>

        {/* Expandable Drawer */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="a-card__drawer"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <div className="a-drawer-content">
                <div className="a-drawer-grid">
                  <div><span className="a-label">Driver:</span> {alert.driverName}</div>
                  <div><span className="a-label">Speed:</span> {alert.currentSpeed} km/h</div>
                </div>
                <div className="a-drawer-btns">
                  <button className="a-btn-secondary">View Telemetry</button>
                  <button className="a-btn-primary">Resolve Incident</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.li>
    );
  }
);

const RecentAlerts: React.FC<RecentAlertsProps> = ({ alerts, isError = false }) => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sourceAlerts: FleetAlert[] = useMemo(
    () => alerts ?? DUMMY_ALERTS,
    [alerts]
  );

  // Filter & Search calculation
  const filteredAlerts = useMemo(() => {
    return sourceAlerts.filter((item) => {
      const priority = (item.priority ?? item.severity).toLowerCase();
      const matchesFilter =
        activeFilter === 'All' ||
        priority === activeFilter.toLowerCase() ||
        (activeFilter === 'High' && priority === 'warning') ||
        (activeFilter === 'Low' && priority === 'information');

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.vehicleId.toLowerCase().includes(q) ||
        (item.driverName && item.driverName.toLowerCase().includes(q)) ||
        (item.locationName && item.locationName.toLowerCase().includes(q));

      return matchesFilter && matchesSearch;
    });
  }, [sourceAlerts, activeFilter, searchQuery]);

  const criticalCount = sourceAlerts.filter(
    (a) => (a.priority ?? a.severity).toLowerCase() === 'critical'
  ).length;

  const filterOptions = ['All', 'Critical', 'High', 'Medium', 'Low', 'Resolved'];

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <motion.section
      aria-label="Enterprise Live Fleet Alerts Notification Panel"
      className="a-glass-panel"
      id="live-alerts-panel"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* ── Header Bar ────────────────────────────────────────────── */}
      <div className="a-panel-header">
        <div className="a-header-title-wrap">
          {/* Notification Bell with micro-animation */}
          <div className="a-bell-box">
            <svg className="a-bell-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="a-bell-badge">{criticalCount}</span>
          </div>

          <div>
            <div className="a-title-row">
              <h3 className="a-panel-title">Live Operation Alerts</h3>
              <span className="a-live-pill">
                <span className="a-live-dot" />
                LIVE 60Hz
              </span>
            </div>
            <p className="a-panel-subtitle">Real-time fleet incidents &amp; telemetry warnings</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="a-header-actions">
          <button
            type="button"
            className={`a-sim-btn ${isLoading ? 'active' : ''}`}
            onClick={() => setIsLoading(!isLoading)}
            title="Toggle Glass Skeleton Shimmer Loading State"
          >
            {isLoading ? 'Show Feed' : 'Simulate Loading'}
          </button>
        </div>
      </div>

      {/* ── Search & Priority Filter Controls ───────────────────────── */}
      <div className="a-toolbar">
        {/* Animated Search Input */}
        <div className="a-search-box">
          <svg className="a-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="a-search-input"
            placeholder="Filter alerts by vehicle, title, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="a-search-clear"
              onClick={() => setSearchQuery('')}
            >
              ✕
            </button>
          )}
        </div>

        {/* Priority Filter Tabs */}
        <div className="a-filter-tabs" role="group" aria-label="Filter alerts by priority">
          {filterOptions.map((opt) => {
            const isActive = activeFilter === opt;
            const count =
              opt === 'All'
                ? sourceAlerts.length
                : sourceAlerts.filter((a) => {
                    const p = (a.priority ?? a.severity).toLowerCase();
                    if (opt === 'High') return p === 'high' || p === 'warning';
                    if (opt === 'Low') return p === 'low' || p === 'information';
                    return p === opt.toLowerCase();
                  }).length;

            return (
              <button
                key={opt}
                type="button"
                className={`a-tab-btn ${isActive ? 'a-tab-btn--active' : ''}`}
                onClick={() => setActiveFilter(opt)}
              >
                <span>{opt}</span>
                <span className="a-tab-count">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Alert List Feed ────────────────────────────────────────── */}
      <ul className="a-list-feed" aria-label="Live alerts feed list">
        {isError ? (
          <li className="a-card">
            <PremiumErrorState 
              title="Connection Lost" 
              description="Failed to load live alerts from the server." 
              onRetry={() => window.location.reload()} 
            />
          </li>
        ) : isLoading ? (
          // Glass Skeleton Cards
          Array.from({ length: 4 }).map((_, idx) => (
            <li key={`skel-a-${idx}`} className="a-card a-row-skeleton">
              <PremiumSkeleton width="40px" height="40px" borderRadius="10px" className="a-skel-box" />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <PremiumSkeleton width="60%" height="18px" className="a-skel-box" />
                <PremiumSkeleton width="90%" height="14px" className="a-skel-box" />
                <PremiumSkeleton width="40%" height="12px" className="a-skel-box" />
              </div>
            </li>
          ))
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert, i) => (
                <AlertCardItem
                  key={alert.id}
                  alert={alert}
                  index={i}
                  isExpanded={expandedId === alert.id}
                  onToggleExpand={() => toggleExpand(alert.id)}
                />
              ))
            ) : (
              // Floating Glass Empty State
              <motion.li
                key="empty-state"
                className="a-empty-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                style={{ background: 'transparent', boxShadow: 'none', border: 'none' }}
              >
                <PremiumEmptyState 
                  title="No Active Alerts" 
                  description={`All vehicle systems operational. No fleet incidents match filter "${activeFilter}".`}
                  icon="🛡️"
                />
              </motion.li>
            )}
          </AnimatePresence>
        )}
      </ul>
    </motion.section>
  );
};

export default memo(RecentAlerts);
