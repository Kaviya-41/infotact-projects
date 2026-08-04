/**
 * VehicleList.tsx – Redesigned Enterprise Vehicle Fleet Telemetry Table
 * Inspired by Amazon Logistics, DHL, Uber Freight, & FedEx command systems.
 * 
 * Features:
 * - 7 Core Table Columns: Vehicle ID, Vehicle Type, Driver Name, Current Speed, Status, Current Location, Last Updated
 * - Premium Glassmorphism styling with dark theme, rounded corners, glowing borders, and soft shadows
 * - Sticky table header for seamless scrolling
 * - Status Indicators: Online (Green glowing), Offline (Gray), Moving (Blue animated wave), Idle (Yellow), Maintenance/Stopped (Red)
 * - Interactive sorting by Speed and Last Updated
 * - Real-time filtering by Status and search by Vehicle ID, Driver Name, or Location
 * - Floating glass Quick Actions popover displaying full vehicle & driver details
 * - Built-in skeleton loading mode and elegant empty state
 * - Smooth desktop enterprise table & responsive mobile cards conversion
 * - Preserves all existing FleetDash data structures, props, and logic 100%
 */

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PremiumSkeleton, PremiumEmptyState, PremiumErrorState } from './StateFeedback';

// ── Types ──────────────────────────────────────────────────────────────────────

export type VehicleStatus = 'Moving' | 'Stopped' | 'Offline' | 'Idle' | 'Online' | 'Maintenance';

export interface Vehicle {
  vehicleId: string;
  driverName: string;
  driverInitials: string;
  driverAvatarColor: string;
  vehicleType: string;
  vehicleTypeIcon: string;
  status: VehicleStatus;
  speedKmh: number | null;
  latitude: number;
  longitude: number;
  lastUpdated: string;
  fuelPct?: number;
  batteryPct?: number;
  gpsSignal?: string;
  engineState?: 'ON' | 'OFF' | 'IDLE';
  locationName?: string;
}

interface VehicleListProps {
  vehicles?: Vehicle[];
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
}

type SortField = 'speedKmh' | 'lastUpdated' | null;
type SortOrder = 'asc' | 'desc';

// ── Fallback Dummy Vehicles Data ──────────────────────────────────────────────

const DUMMY_VEHICLES: Vehicle[] = [
  {
    vehicleId:         'FLT-001',
    driverName:        'Rahul Kumar',
    driverInitials:    'RK',
    driverAvatarColor: '#4F8CFF',
    vehicleType:       'Heavy Truck',
    vehicleTypeIcon:   '🚛',
    status:            'Moving',
    speedKmh:          65,
    latitude:          12.9716,
    longitude:         77.5946,
    lastUpdated:       '2 sec ago',
    fuelPct:           84,
    batteryPct:        96,
    gpsSignal:         '📶 4/4',
    engineState:       'ON',
    locationName:      'Bengaluru East',
  },
  {
    vehicleId:         'FLT-002',
    driverName:        'Arjun Singh',
    driverInitials:    'AS',
    driverAvatarColor: '#A78BFA',
    vehicleType:       'Cargo Van',
    vehicleTypeIcon:   '🚐',
    status:            'Moving',
    speedKmh:          48,
    latitude:          13.0827,
    longitude:         80.2707,
    lastUpdated:       '5 sec ago',
    fuelPct:           72,
    batteryPct:        91,
    gpsSignal:         '📶 4/4',
    engineState:       'ON',
    locationName:      'Outer Ring Road',
  },
  {
    vehicleId:         'FLT-003',
    driverName:        'Kiran Patel',
    driverInitials:    'KP',
    driverAvatarColor: '#FF5C5C',
    vehicleType:       'Heavy Truck',
    vehicleTypeIcon:   '🚛',
    status:            'Stopped',
    speedKmh:          0,
    latitude:          11.0168,
    longitude:         76.9558,
    lastUpdated:       '12 sec ago',
    fuelPct:           18,
    batteryPct:        88,
    gpsSignal:         '📶 3/4',
    engineState:       'IDLE',
    locationName:      'Whitefield Depot',
  },
  {
    vehicleId:         'FLT-004',
    driverName:        'Naveen Reddy',
    driverInitials:    'NR',
    driverAvatarColor: '#31D67B',
    vehicleType:       'Trailer Hauler',
    vehicleTypeIcon:   '🚜',
    status:            'Online',
    speedKmh:          72,
    latitude:          17.3850,
    longitude:         78.4867,
    lastUpdated:       '1 sec ago',
    fuelPct:           90,
    batteryPct:        98,
    gpsSignal:         '📶 4/4',
    engineState:       'ON',
    locationName:      'Airport Expressway',
  },
  {
    vehicleId:         'FLT-005',
    driverName:        'Priya Sharma',
    driverInitials:    'PS',
    driverAvatarColor: '#FFB547',
    vehicleType:       'Mini Truck',
    vehicleTypeIcon:   '🚚',
    status:            'Offline',
    speedKmh:          null,
    latitude:          15.3173,
    longitude:         75.7139,
    lastUpdated:       '4 min ago',
    fuelPct:           64,
    batteryPct:        45,
    gpsSignal:         '⚠️ 0/4',
    engineState:       'OFF',
    locationName:      'Electronic City Hub',
  },
  {
    vehicleId:         'FLT-006',
    driverName:        'Vignesh Rajan',
    driverInitials:    'VR',
    driverAvatarColor: '#8b5cf6',
    vehicleType:       'Container Carrier',
    vehicleTypeIcon:   '🏗️',
    status:            'Idle',
    speedKmh:          0,
    latitude:          13.6288,
    longitude:         79.4192,
    lastUpdated:       '10 sec ago',
    fuelPct:           58,
    batteryPct:        82,
    gpsSignal:         '📶 3/4',
    engineState:       'IDLE',
    locationName:      'Hosur Terminal',
  },
  {
    vehicleId:         'FLT-007',
    driverName:        'Suresh Babu',
    driverInitials:    'SB',
    driverAvatarColor: '#00D4FF',
    vehicleType:       'Heavy Truck',
    vehicleTypeIcon:   '🚛',
    status:            'Moving',
    speedKmh:          68,
    latitude:          12.2958,
    longitude:         76.6394,
    lastUpdated:       '3 sec ago',
    fuelPct:           79,
    batteryPct:        94,
    gpsSignal:         '📶 4/4',
    engineState:       'ON',
    locationName:      'Tech Park Bypass',
  },
  {
    vehicleId:         'FLT-008',
    driverName:        'Deepak Menon',
    driverInitials:    'DM',
    driverAvatarColor: '#06b6d4',
    vehicleType:       'Cargo Van',
    vehicleTypeIcon:   '🚐',
    status:            'Maintenance',
    speedKmh:          0,
    latitude:          10.8505,
    longitude:         76.2711,
    lastUpdated:       '8 sec ago',
    fuelPct:           55,
    batteryPct:        82,
    gpsSignal:         '📶 4/4',
    engineState:       'OFF',
    locationName:      'Central Logistics Hub',
  },
  {
    vehicleId:         'FLT-009',
    driverName:        'Akash Verma',
    driverInitials:    'AV',
    driverAvatarColor: '#f97316',
    vehicleType:       'Trailer Hauler',
    vehicleTypeIcon:   '🚜',
    status:            'Moving',
    speedKmh:          61,
    latitude:          9.9252,
    longitude:         78.1198,
    lastUpdated:       '4 sec ago',
    fuelPct:           87,
    batteryPct:        95,
    gpsSignal:         '📶 4/4',
    engineState:       'ON',
    locationName:      'Industrial Corridor',
  },
  {
    vehicleId:         'FLT-010',
    driverName:        'Mohan Das',
    driverInitials:    'MD',
    driverAvatarColor: '#a855f7',
    vehicleType:       'Heavy Truck',
    vehicleTypeIcon:   '🚛',
    status:            'Offline',
    speedKmh:          null,
    latitude:          11.1271,
    longitude:         78.6569,
    lastUpdated:       '18 min ago',
    fuelPct:           32,
    batteryPct:        30,
    gpsSignal:         '⚠️ 0/4',
    engineState:       'OFF',
    locationName:      'North Cargo Terminal',
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function getStatusBadgeStyle(status: VehicleStatus) {
  switch (status) {
    case 'Online':
      return {
        className: 'v-status-badge v-status-badge--online',
        label: 'Online',
        dotClass: 'v-status-dot v-status-dot--online',
      };
    case 'Moving':
      return {
        className: 'v-status-badge v-status-badge--moving',
        label: 'Moving',
        dotClass: 'v-status-dot v-status-dot--moving',
      };
    case 'Idle':
      return {
        className: 'v-status-badge v-status-badge--idle',
        label: 'Idle',
        dotClass: 'v-status-dot v-status-dot--idle',
      };
    case 'Stopped':
    case 'Maintenance':
      return {
        className: 'v-status-badge v-status-badge--maintenance',
        label: status,
        dotClass: 'v-status-dot v-status-dot--maintenance',
      };
    case 'Offline':
    default:
      return {
        className: 'v-status-badge v-status-badge--offline',
        label: 'Offline',
        dotClass: 'v-status-dot v-status-dot--offline',
      };
  }
}

/** Parses relative time string into comparative seconds for sorting */
function parseRelativeSeconds(str: string): number {
  if (!str) return 999999;
  const lower = str.toLowerCase().trim();
  const num = parseInt(lower, 10) || 0;
  if (lower.includes('sec')) return num;
  if (lower.includes('min')) return num * 60;
  if (lower.includes('hr') || lower.includes('hour')) return num * 3600;
  if (lower.includes('day')) return num * 86400;
  return 999999;
}

// ── Component ──────────────────────────────────────────────────────────────────

const VehicleList: React.FC<VehicleListProps> = ({
  vehicles,
  isLoading: externalLoading,
  isError = false,
  errorMessage,
}) => {
  const [filterStatus, setFilterStatus] = useState<VehicleStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [internalLoading, setInternalLoading] = useState<boolean>(false);

  // Use external loading state if provided, otherwise use internal toggle
  const isLoading = externalLoading ?? internalLoading;

  const itemsPerPage = 6;

  const sourceVehicles: Vehicle[] = useMemo(
    () => vehicles ?? DUMMY_VEHICLES,
    [vehicles],
  );

  // Filtered & Sorted Dataset
  const processedVehicles = useMemo(() => {
    let result = sourceVehicles.filter((v) => {
      const matchesStatus =
        filterStatus === 'All' ||
        v.status === filterStatus ||
        (filterStatus === 'Maintenance' && v.status === 'Stopped');

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        v.vehicleId.toLowerCase().includes(q) ||
        v.driverName.toLowerCase().includes(q) ||
        v.vehicleType.toLowerCase().includes(q) ||
        (v.locationName && v.locationName.toLowerCase().includes(q));

      return matchesStatus && matchesSearch;
    });

    if (sortField) {
      result = [...result].sort((a, b) => {
        if (sortField === 'speedKmh') {
          const valA = a.speedKmh ?? -1;
          const valB = b.speedKmh ?? -1;
          return sortOrder === 'asc' ? valA - valB : valB - valA;
        } else if (sortField === 'lastUpdated') {
          const valA = parseRelativeSeconds(a.lastUpdated);
          const valB = parseRelativeSeconds(b.lastUpdated);
          return sortOrder === 'asc' ? valA - valB : valB - valA;
        }
        return 0;
      });
    }

    return result;
  }, [sourceVehicles, filterStatus, searchQuery, sortField, sortOrder]);

  const totalPages = Math.ceil(processedVehicles.length / itemsPerPage) || 1;

  const paginatedVehicles = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return processedVehicles.slice(start, start + itemsPerPage);
  }, [processedVehicles, currentPage]);

  const handleSortToggle = (field: SortField) => {
    if (sortField === field) {
      if (sortOrder === 'desc') setSortOrder('asc');
      else {
        setSortField(null);
        setSortOrder('desc');
      }
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const filterOptions: Array<VehicleStatus | 'All'> = [
    'All',
    'Online',
    'Moving',
    'Idle',
    'Offline',
    'Maintenance',
  ];

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Vehicle ID,Driver,Type,Status,Speed,Location,Last Updated'].join(',') +
      '\n' +
      sourceVehicles
        .map(
          (v) =>
            `${v.vehicleId},"${v.driverName}","${v.vehicleType}",${v.status},${
              v.speedKmh ?? 0
            },"${v.locationName ?? 'N/A'}",${v.lastUpdated}`,
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `fleet_telemetry_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section
      aria-label="Enterprise Fleet Telemetry"
      className="v-glass-card"
      id="vehicle-telemetry-section"
    >
      {/* ── Card Header & Toolbar ─────────────────────────────────────── */}
      <div className="v-glass-card__header">
        <div className="v-glass-card__title-wrap">
          <div className="v-glass-card__icon-badge">
            <span aria-hidden="true">🚚</span>
          </div>
          <div>
            <h3 className="v-glass-card__title">Enterprise Vehicle List</h3>
            <p className="v-glass-card__subtitle">
              Real-time telemetry, driver status, and speed tracking
            </p>
          </div>
          <span className="v-glass-card__count-pill">
            {processedVehicles.length} of {sourceVehicles.length} Vehicles
          </span>
        </div>

        {/* Action Controls */}
        <div className="v-glass-card__actions">
          {/* Skeleton Shimmer Toggle Button */}
          <button
            type="button"
            className={`v-btn-secondary ${internalLoading ? 'active' : ''}`}
            onClick={() => setInternalLoading(!internalLoading)}
            title="Toggle Skeleton Shimmer Loading Effect"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
            {internalLoading ? 'Live View' : 'Simulate Loading'}
          </button>

          {/* Export CSV Button */}
          <button
            className="v-btn-primary"
            type="button"
            onClick={handleExportCSV}
            title="Export CSV Telemetry Feed"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* ── Toolbar: Search & Filter Tabs ─────────────────────────────── */}
      <div className="v-toolbar">
        {/* Animated Search Input */}
        <div className="v-search-box">
          <svg className="v-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="v-search-input"
            placeholder="Search by Vehicle ID, Driver Name, or Location..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
          {searchQuery && (
            <button
              type="button"
              className="v-search-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="v-filter-group" role="group" aria-label="Filter vehicles by status">
          {filterOptions.map((opt) => {
            const isActive = filterStatus === opt;
            const count =
              opt === 'All'
                ? sourceVehicles.length
                : sourceVehicles.filter(
                    (v) =>
                      v.status === opt ||
                      (opt === 'Maintenance' && v.status === 'Stopped'),
                  ).length;

            return (
              <button
                key={opt}
                id={`v-filter-${opt.toLowerCase()}`}
                type="button"
                className={`v-filter-pill ${isActive ? 'v-filter-pill--active' : ''}`}
                onClick={() => {
                  setFilterStatus(opt);
                  setCurrentPage(1);
                }}
              >
                <span>{opt}</span>
                <span className="v-filter-count">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Desktop & Tablet Enterprise Table ────────────────────────── */}
      <div className="v-table-container">
        <table className="v-table" aria-label="Vehicle Telemetry Fleet Table">
          <thead>
            <tr>
              <th scope="col" className="col-id">Vehicle ID</th>
              <th scope="col" className="col-type">Vehicle Type</th>
              <th scope="col" className="col-driver">Driver Name</th>
              <th
                scope="col"
                className="col-speed sortable"
                onClick={() => handleSortToggle('speedKmh')}
                title="Click to sort by Current Speed"
              >
                <div className="th-sort-content">
                  <span>Current Speed</span>
                  <span className={`sort-icon ${sortField === 'speedKmh' ? 'active' : ''}`}>
                    {sortField === 'speedKmh' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕'}
                  </span>
                </div>
              </th>
              <th scope="col" className="col-status">Status</th>
              <th scope="col" className="col-location">Current Location</th>
              <th
                scope="col"
                className="col-updated sortable"
                onClick={() => handleSortToggle('lastUpdated')}
                title="Click to sort by Last Updated"
              >
                <div className="th-sort-content">
                  <span>Last Updated</span>
                  <span className={`sort-icon ${sortField === 'lastUpdated' ? 'active' : ''}`}>
                    {sortField === 'lastUpdated' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕'}
                  </span>
                </div>
              </th>
              <th scope="col" className="col-action">Quick Action</th>
            </tr>
          </thead>

          <tbody>
            {isError ? (
              <tr>
                <td colSpan={8}>
                  <PremiumErrorState 
                    title="Network Error" 
                    description={errorMessage ?? 'Failed to load telemetry data. The server might be offline.'} 
                    onRetry={() => window.location.reload()} 
                  />
                </td>
              </tr>
            ) : isLoading ? (
              // ── Loading Skeleton Shimmer ─────────────────────────────
              Array.from({ length: itemsPerPage }).map((_, idx) => (
                <tr key={`skel-${idx}`} className="v-row-skeleton">
                  <td><PremiumSkeleton className="v-skel-box v-skel-id" /></td>
                  <td><PremiumSkeleton className="v-skel-box v-skel-type" /></td>
                  <td><PremiumSkeleton className="v-skel-box v-skel-driver" /></td>
                  <td><PremiumSkeleton className="v-skel-box v-skel-speed" /></td>
                  <td><PremiumSkeleton className="v-skel-box v-skel-status" /></td>
                  <td><PremiumSkeleton className="v-skel-box v-skel-location" /></td>
                  <td><PremiumSkeleton className="v-skel-box v-skel-updated" /></td>
                  <td><PremiumSkeleton className="v-skel-box v-skel-btn" /></td>
                </tr>
              ))
            ) : paginatedVehicles.length > 0 ? (
              paginatedVehicles.map((vehicle, idx) => {
                const badgeInfo = getStatusBadgeStyle(vehicle.status);
                const isMoving = vehicle.status === 'Moving';

                return (
                  <motion.tr
                    key={vehicle.vehicleId}
                    className="v-row"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.04 }}
                    whileHover={{ backgroundColor: 'rgba(79, 140, 255, 0.05)' }}
                  >
                    {/* Vehicle ID with Type Icon */}
                    <td className="col-id">
                      <div className="v-cell-vehicle">
                        <div className="v-type-icon-box">
                          <span className="v-type-emoji">{vehicle.vehicleTypeIcon}</span>
                        </div>
                        <div className="v-id-info">
                          <span className="v-id-text">{vehicle.vehicleId}</span>
                          <span className="v-gps-tag">{vehicle.gpsSignal ?? '📶 4/4'}</span>
                        </div>
                      </div>
                    </td>

                    {/* Vehicle Type */}
                    <td className="col-type">
                      <span className="v-type-badge">{vehicle.vehicleType}</span>
                    </td>

                    {/* Driver Name with Avatar Placeholder */}
                    <td className="col-driver">
                      <div className="v-driver-cell">
                        <div
                          className="v-driver-avatar"
                          style={{ backgroundColor: vehicle.driverAvatarColor }}
                        >
                          {vehicle.driverInitials}
                          <span className="v-driver-online-dot" />
                        </div>
                        <div className="v-driver-text">
                          <span className="v-driver-name">{vehicle.driverName}</span>
                          <span className="v-driver-role">Licensed Driver</span>
                        </div>
                      </div>
                    </td>

                    {/* Current Speed Indicator */}
                    <td className="col-speed">
                      <div className="v-speed-cell">
                        <div className={`v-speed-pill ${isMoving ? 'v-speed-pill--active' : ''}`}>
                          <span className="v-speed-val">
                            {vehicle.speedKmh !== null ? vehicle.speedKmh : '0'}
                          </span>
                          <span className="v-speed-unit">km/h</span>
                        </div>
                        {isMoving && (
                          <div className="v-speed-bar-track">
                            <div
                              className="v-speed-bar-fill"
                              style={{ width: `${Math.min(100, ((vehicle.speedKmh ?? 0) / 100) * 100)}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Status Chip */}
                    <td className="col-status">
                      <div className={badgeInfo.className}>
                        <span className={badgeInfo.dotClass} />
                        <span>{badgeInfo.label}</span>
                      </div>
                    </td>

                    {/* Current Location */}
                    <td className="col-location">
                      <div className="v-location-cell">
                        <svg className="v-loc-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span className="v-location-text">
                          {vehicle.locationName ?? `${vehicle.latitude.toFixed(2)}, ${vehicle.longitude.toFixed(2)}`}
                        </span>
                      </div>
                    </td>

                    {/* Last Updated */}
                    <td className="col-updated">
                      <div className="v-updated-cell">
                        <svg className="v-time-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span className="v-updated-text">{vehicle.lastUpdated}</span>
                      </div>
                    </td>

                    {/* Quick Action Button */}
                    <td className="col-action">
                      <button
                        type="button"
                        className="v-action-btn"
                        onClick={() => setSelectedVehicle(vehicle)}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="16" x2="12" y2="12" />
                          <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                        Quick Action
                      </button>
                    </td>
                  </motion.tr>
                );
              })
            ) : (
              // ── Beautiful Glass Empty State ──────────────────────────
              <tr>
                <td colSpan={8}>
                  <PremiumEmptyState 
                    title="No Vehicles Available" 
                    description={`No fleet vehicles match your current search "${searchQuery}" or selected filter "${filterStatus}".`}
                    icon="🚛"
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Mobile Responsive Card View (< 768px) ──────────────────────── */}
      <div className="v-mobile-cards">
        {isError ? (
          <div className="v-mobile-card">
            <PremiumErrorState 
              title="Network Error" 
              description="Failed to load telemetry data." 
              onRetry={() => window.location.reload()} 
            />
          </div>
        ) : isLoading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <div key={`mob-skel-${idx}`} className="v-mobile-card v-row-skeleton">
              <PremiumSkeleton height="24px" width="60%" />
              <PremiumSkeleton height="16px" width="80%" className="v-skel-box" />
              <PremiumSkeleton height="36px" width="100%" />
            </div>
          ))
        ) : paginatedVehicles.length > 0 ? (
          paginatedVehicles.map((vehicle, idx) => {
            const badgeInfo = getStatusBadgeStyle(vehicle.status);
            return (
              <motion.div
                key={`mob-${vehicle.vehicleId}`}
                className="v-mobile-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.05 }}
              >
                <div className="v-mobile-card__header">
                  <div className="v-cell-vehicle">
                    <span className="v-type-emoji">{vehicle.vehicleTypeIcon}</span>
                    <div>
                      <span className="v-id-text">{vehicle.vehicleId}</span>
                      <span className="v-type-badge">{vehicle.vehicleType}</span>
                    </div>
                  </div>
                  <div className={badgeInfo.className}>
                    <span className={badgeInfo.dotClass} />
                    <span>{badgeInfo.label}</span>
                  </div>
                </div>

                <div className="v-mobile-card__body">
                  <div className="v-driver-cell">
                    <div
                      className="v-driver-avatar"
                      style={{ backgroundColor: vehicle.driverAvatarColor }}
                    >
                      {vehicle.driverInitials}
                    </div>
                    <div>
                      <div className="v-driver-name">{vehicle.driverName}</div>
                      <div className="v-location-text">
                        📍 {vehicle.locationName ?? 'In Transit'}
                      </div>
                    </div>
                  </div>

                  <div className="v-mobile-card__metrics">
                    <div className="v-m-pill">
                      <span className="v-m-lbl">Speed</span>
                      <span className="v-m-val">{vehicle.speedKmh ?? 0} km/h</span>
                    </div>
                    <div className="v-m-pill">
                      <span className="v-m-lbl">Updated</span>
                      <span className="v-m-val">{vehicle.lastUpdated}</span>
                    </div>
                  </div>
                </div>

                <div className="v-mobile-card__footer">
                  <button
                    type="button"
                    className="v-action-btn full-width"
                    onClick={() => setSelectedVehicle(vehicle)}
                  >
                    Quick Action & Details
                  </button>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="v-mobile-card">
            <PremiumEmptyState 
              title="No Vehicles" 
              description="No match found for current filters." 
              icon="🚛"
            />
          </div>
        )}
      </div>

      {/* ── Footer & Pagination Controls ────────────────────────────── */}
      <div className="v-glass-card__footer">
        <span className="v-footer-info">
          Showing {paginatedVehicles.length} of {processedVehicles.length} matching vehicles
        </span>

        <div className="v-pagination">
          <button
            type="button"
            className="v-pag-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          >
            ‹ Prev
          </button>
          <span className="v-pag-text">
            Page <strong>{currentPage}</strong> of {totalPages}
          </span>
          <button
            type="button"
            className="v-pag-btn"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          >
            Next ›
          </button>
        </div>
      </div>

      {/* ── Quick Actions Floating Glass Popover Modal ──────────────── */}
      <AnimatePresence>
        {selectedVehicle && (
          <div className="v-popover-backdrop" onClick={() => setSelectedVehicle(null)}>
            <motion.div
              className="v-popover-card"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="v-popover-header">
                <div className="v-popover-title-wrap">
                  <div className="v-popover-icon-box">
                    <span>{selectedVehicle.vehicleTypeIcon}</span>
                  </div>
                  <div>
                    <h3 className="v-popover-title">{selectedVehicle.vehicleId}</h3>
                    <p className="v-popover-subtitle">{selectedVehicle.vehicleType}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="v-popover-close"
                  onClick={() => setSelectedVehicle(null)}
                  aria-label="Close Popover"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body Grid */}
              <div className="v-popover-body">
                {/* Driver Info Section */}
                <div className="v-pop-section">
                  <h4 className="v-pop-section-title">Driver Information</h4>
                  <div className="v-pop-driver-card">
                    <div
                      className="v-driver-avatar lg"
                      style={{ backgroundColor: selectedVehicle.driverAvatarColor }}
                    >
                      {selectedVehicle.driverInitials}
                      <span className="v-driver-online-dot" />
                    </div>
                    <div>
                      <div className="v-pop-driver-name">{selectedVehicle.driverName}</div>
                      <div className="v-pop-driver-id">ID: DRV-{selectedVehicle.vehicleId.split('-')[1]} · Active Duty</div>
                    </div>
                  </div>
                </div>

                {/* Status & Speed Grid */}
                <div className="v-pop-grid-2">
                  <div className="v-pop-stat-box">
                    <span className="v-pop-stat-lbl">Current Status</span>
                    <div className="v-pop-stat-val">
                      <span className={getStatusBadgeStyle(selectedVehicle.status).className}>
                        <span className={getStatusBadgeStyle(selectedVehicle.status).dotClass} />
                        {selectedVehicle.status}
                      </span>
                    </div>
                  </div>
                  <div className="v-pop-stat-box">
                    <span className="v-pop-stat-lbl">Current Speed</span>
                    <div className="v-pop-stat-val font-mono">
                      <span className="text-cyan">{selectedVehicle.speedKmh ?? 0}</span>
                      <span className="text-sm"> km/h</span>
                    </div>
                  </div>
                </div>

                {/* Additional Telemetry Details */}
                <div className="v-pop-telemetry-grid">
                  <div className="v-pop-t-item">
                    <span className="v-pop-t-label">Location Area</span>
                    <span className="v-pop-t-val">{selectedVehicle.locationName ?? 'N/A'}</span>
                  </div>
                  <div className="v-pop-t-item">
                    <span className="v-pop-t-label">Coordinates</span>
                    <span className="v-pop-t-val font-mono">
                      {selectedVehicle.latitude.toFixed(4)}, {selectedVehicle.longitude.toFixed(4)}
                    </span>
                  </div>
                  <div className="v-pop-t-item">
                    <span className="v-pop-t-label">Last Updated</span>
                    <span className="v-pop-t-val">{selectedVehicle.lastUpdated}</span>
                  </div>
                  <div className="v-pop-t-item">
                    <span className="v-pop-t-label">Engine State</span>
                    <span className="v-pop-t-val highlight">
                      {selectedVehicle.engineState ?? 'ON'}
                    </span>
                  </div>
                </div>

                {/* Fuel & Battery Indicators if available */}
                {(selectedVehicle.fuelPct !== undefined || selectedVehicle.batteryPct !== undefined) && (
                  <div className="v-pop-progress-row">
                    {selectedVehicle.fuelPct !== undefined && (
                      <div className="v-pop-prog-item">
                        <div className="v-pop-prog-head">
                          <span>Fuel Tank</span>
                          <span>{selectedVehicle.fuelPct}%</span>
                        </div>
                        <div className="v-prog-track">
                          <div
                            className="v-prog-fill green"
                            style={{ width: `${selectedVehicle.fuelPct}%` }}
                          />
                        </div>
                      </div>
                    )}
                    {selectedVehicle.batteryPct !== undefined && (
                      <div className="v-pop-prog-item">
                        <div className="v-pop-prog-head">
                          <span>Battery Health</span>
                          <span>{selectedVehicle.batteryPct}%</span>
                        </div>
                        <div className="v-prog-track">
                          <div
                            className="v-prog-fill purple"
                            style={{ width: `${selectedVehicle.batteryPct}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="v-popover-footer">
                <button
                  type="button"
                  className="v-btn-secondary full-width"
                  onClick={() => setSelectedVehicle(null)}
                >
                  Close Window
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default VehicleList;
