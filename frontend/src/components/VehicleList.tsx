/**
 * VehicleList.tsx
 * Responsive vehicle telemetry table with dummy data.
 * Week 1 – Static data only. Ready for Socket.io live updates in Week 3.
 */

import React, { useMemo, useState } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────────

export type VehicleStatus = 'Moving' | 'Stopped' | 'Offline' | 'Idle';

export interface Vehicle {
  vehicleId: string;
  driverName: string;
  driverInitials: string;
  driverAvatarColor: string;
  status: VehicleStatus;
  speedKmh: number;
  lastUpdated: string;
}

interface VehicleListProps {
  /** Vehicle records – defaults to dummy data when undefined (Week 1) */
  vehicles?: Vehicle[];
}

// ── Dummy Data (Week 1) ────────────────────────────────────────────────────────

const DUMMY_VEHICLES: Vehicle[] = [
  {
    vehicleId:         'FLT-001',
    driverName:        'Carlos Mendez',
    driverInitials:    'CM',
    driverAvatarColor: '#6366f1',
    status:            'Moving',
    speedKmh:          87,
    lastUpdated:       '2 min ago',
  },
  {
    vehicleId:         'FLT-002',
    driverName:        'Sara Thompson',
    driverInitials:    'ST',
    driverAvatarColor: '#ec4899',
    status:            'Moving',
    speedKmh:          64,
    lastUpdated:       '1 min ago',
  },
  {
    vehicleId:         'FLT-003',
    driverName:        'Liam Okafor',
    driverInitials:    'LO',
    driverAvatarColor: '#f59e0b',
    status:            'Stopped',
    speedKmh:          0,
    lastUpdated:       '5 min ago',
  },
  {
    vehicleId:         'FLT-004',
    driverName:        'Priya Nair',
    driverInitials:    'PN',
    driverAvatarColor: '#10b981',
    status:            'Moving',
    speedKmh:          102,
    lastUpdated:       'Just now',
  },
  {
    vehicleId:         'FLT-005',
    driverName:        'Marcus Webb',
    driverInitials:    'MW',
    driverAvatarColor: '#3b82f6',
    status:            'Offline',
    speedKmh:          0,
    lastUpdated:       '1 hr ago',
  },
  {
    vehicleId:         'FLT-006',
    driverName:        'Hana Kowalski',
    driverInitials:    'HK',
    driverAvatarColor: '#8b5cf6',
    status:            'Idle',
    speedKmh:          0,
    lastUpdated:       '12 min ago',
  },
  {
    vehicleId:         'FLT-007',
    driverName:        'Diego Reyes',
    driverInitials:    'DR',
    driverAvatarColor: '#ef4444',
    status:            'Moving',
    speedKmh:          75,
    lastUpdated:       '3 min ago',
  },
  {
    vehicleId:         'FLT-008',
    driverName:        'Amara Diallo',
    driverInitials:    'AD',
    driverAvatarColor: '#06b6d4',
    status:            'Stopped',
    speedKmh:          0,
    lastUpdated:       '8 min ago',
  },
  {
    vehicleId:         'FLT-009',
    driverName:        'Tom Brennan',
    driverInitials:    'TB',
    driverAvatarColor: '#f97316',
    status:            'Moving',
    speedKmh:          91,
    lastUpdated:       'Just now',
  },
  {
    vehicleId:         'FLT-010',
    driverName:        'Yuki Tanaka',
    driverInitials:    'YT',
    driverAvatarColor: '#a855f7',
    status:            'Offline',
    speedKmh:          0,
    lastUpdated:       '2 hr ago',
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function getStatusClass(status: VehicleStatus): string {
  const map: Record<VehicleStatus, string> = {
    Moving:  'status-badge--moving',
    Stopped: 'status-badge--stopped',
    Offline: 'status-badge--offline',
    Idle:    'status-badge--idle',
  };
  return map[status];
}

// ── Component ──────────────────────────────────────────────────────────────────

const VehicleList: React.FC<VehicleListProps> = ({ vehicles }) => {
  const [filterStatus, setFilterStatus] = useState<VehicleStatus | 'All'>('All');

  // Week 1: fall back to static dummy data when no live feed yet
  const sourceVehicles: Vehicle[] = useMemo(
    () => vehicles ?? DUMMY_VEHICLES,
    [vehicles],
  );

  const filteredVehicles: Vehicle[] = useMemo(() => {
    if (filterStatus === 'All') return sourceVehicles;
    return sourceVehicles.filter((v) => v.status === filterStatus);
  }, [sourceVehicles, filterStatus]);

  const filterOptions: Array<VehicleStatus | 'All'> = ['All', 'Moving', 'Stopped', 'Offline', 'Idle'];

  return (
    <section aria-label="Vehicle list" className="vehicle-list-card">
      {/* Card Header */}
      <div className="vehicle-list-card__header">
        <div className="vehicle-list-card__title">
          <span aria-hidden="true">🚚</span>
          Vehicle Fleet
          <span className="vehicle-list-card__count">
            {filteredVehicles.length} / {sourceVehicles.length}
          </span>
        </div>

        {/* Status Filter Pills */}
        <div className="map-card__controls" role="group" aria-label="Filter by vehicle status">
          {filterOptions.map((opt) => (
            <button
              key={opt}
              id={`vehicle-filter-${opt.toLowerCase()}`}
              className={`map-btn${filterStatus === opt ? ' active' : ''}`}
              type="button"
              onClick={() => setFilterStatus(opt)}
              aria-pressed={filterStatus === opt}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="vehicle-table-wrap">
        <table
          className="vehicle-table"
          aria-label="Fleet vehicles"
          aria-rowcount={filteredVehicles.length}
        >
          <thead>
            <tr>
              <th scope="col">Vehicle ID</th>
              <th scope="col">Driver Name</th>
              <th scope="col">Status</th>
              <th scope="col">Speed</th>
              <th scope="col">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {filteredVehicles.map((vehicle, index) => (
              <tr key={vehicle.vehicleId} aria-rowindex={index + 1}>
                {/* Vehicle ID */}
                <td>
                  <div className="vehicle-id">
                    <div className="vehicle-id__icon" aria-hidden="true">🚛</div>
                    <span className="vehicle-id__text">{vehicle.vehicleId}</span>
                  </div>
                </td>

                {/* Driver Name */}
                <td>
                  <div className="driver-info">
                    <div
                      className="driver-avatar"
                      style={{ background: vehicle.driverAvatarColor }}
                      aria-hidden="true"
                    >
                      {vehicle.driverInitials}
                    </div>
                    <span>{vehicle.driverName}</span>
                  </div>
                </td>

                {/* Status Badge */}
                <td>
                  <span
                    className={`status-badge ${getStatusClass(vehicle.status)}`}
                    aria-label={`Status: ${vehicle.status}`}
                  >
                    <span className="status-badge__dot" aria-hidden="true" />
                    {vehicle.status}
                  </span>
                </td>

                {/* Speed */}
                <td>
                  <div className="speed-cell">
                    <span className="speed-value">{vehicle.speedKmh}</span>
                    <span className="speed-unit">km/h</span>
                  </div>
                </td>

                {/* Last Updated */}
                <td>
                  <span className="last-updated">{vehicle.lastUpdated}</span>
                </td>
              </tr>
            ))}

            {filteredVehicles.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: 'var(--color-text-muted)' }}>
                  No vehicles match the selected filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="vehicle-list-card__footer">
        <span className="footer-info">
          Showing {filteredVehicles.length} of {sourceVehicles.length} vehicles
          {/* TODO Week 3: replace with live count from Socket.io */}
        </span>
        <button id="vehicle-view-all-btn" className="footer-link" type="button">
          View all vehicles →
        </button>
      </div>
    </section>
  );
};

export default VehicleList;
