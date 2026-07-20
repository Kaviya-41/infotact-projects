/**
 * VehicleList.tsx
 * Responsive vehicle telemetry table – 8-column enterprise view.
 * Week 1 – Static dummy data only. Ready for Socket.io live updates in Week 3.
 *
 * Columns: Vehicle ID | Driver Name | Vehicle Type | Status |
 *           Speed | Latitude | Longitude | Last Updated
 */

import React, { useMemo, useState } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────────

export type VehicleStatus = 'Moving' | 'Stopped' | 'Offline' | 'Idle';

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
}

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
    status:            'Moving',
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
    status:            'Stopped',
    speedKmh:          0,
    latitude:          10.8505,
    longitude:         76.2711,
    lastUpdated:       '8 sec ago',
    fuelPct:           55,
    batteryPct:        82,
    gpsSignal:         '📶 4/4',
    engineState:       'IDLE',
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

function getStatusClass(status: VehicleStatus): string {
  const map: Record<VehicleStatus, string> = {
    Moving:  'status-badge--moving',
    Stopped: 'status-badge--stopped',
    Offline: 'status-badge--offline',
    Idle:    'status-badge--idle',
  };
  return map[status];
}

function getStatusEmoji(status: VehicleStatus): string {
  const map: Record<VehicleStatus, string> = {
    Moving:  '🟢',
    Stopped: '🟡',
    Offline: '🔴',
    Idle:    '⚪',
  };
  return map[status];
}

const VehicleList: React.FC<VehicleListProps> = ({ vehicles }) => {
  const [filterStatus, setFilterStatus] = useState<VehicleStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  const sourceVehicles: Vehicle[] = useMemo(
    () => vehicles ?? DUMMY_VEHICLES,
    [vehicles],
  );

  const filteredVehicles: Vehicle[] = useMemo(() => {
    return sourceVehicles.filter((v) => {
      const matchesStatus = filterStatus === 'All' || v.status === filterStatus;
      const matchesSearch =
        v.vehicleId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.locationName && v.locationName.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesStatus && matchesSearch;
    });
  }, [sourceVehicles, filterStatus, searchQuery]);

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage) || 1;
  const paginatedVehicles = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredVehicles.slice(start, start + itemsPerPage);
  }, [filteredVehicles, currentPage]);

  const filterOptions: Array<VehicleStatus | 'All'> = ['All', 'Moving', 'Stopped', 'Offline', 'Idle'];

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Vehicle ID,Driver,Type,Status,Speed,Fuel,Battery,Location'].join(',') +
      '\n' +
      sourceVehicles.map(v => `${v.vehicleId},${v.driverName},${v.vehicleType},${v.status},${v.speedKmh ?? 0},${v.fuelPct ?? 0}%,${v.batteryPct ?? 0}%,${v.locationName ?? 'N/A'}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `fleet_vehicles_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section aria-label="Enterprise vehicle fleet" className="vehicle-list-card">
      {/* ── Card Header ──────────────────────────────────────────── */}
      <div className="vehicle-list-card__header">
        <div className="vehicle-list-card__title">
          <span aria-hidden="true">🚚</span>
          Enterprise Vehicle Telemetry
          <span className="vehicle-list-card__count">
            {filteredVehicles.length} of {sourceVehicles.length} Vehicles
          </span>
        </div>

        {/* Toolbar: Search, Filters, Export */}
        <div className="vehicle-table-toolbar">
          {/* Table Search */}
          <div className="vehicle-table-search">
            <span aria-hidden="true">🔍</span>
            <input
              type="text"
              placeholder="Filter by ID, driver, location..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Status Filter Pills */}
          <div className="map-card__controls" role="group" aria-label="Filter by vehicle status">
            {filterOptions.map((opt) => (
              <button
                key={opt}
                id={`vehicle-filter-${opt.toLowerCase()}`}
                className={`map-btn${filterStatus === opt ? ' active' : ''}`}
                type="button"
                onClick={() => {
                  setFilterStatus(opt);
                  setCurrentPage(1);
                }}
                aria-pressed={filterStatus === opt}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Export Button */}
          <button
            className="vehicle-export-btn"
            type="button"
            onClick={handleExportCSV}
            title="Export CSV Telemetry"
          >
            📥 Export CSV
          </button>
        </div>
      </div>

      {/* ── Enterprise Table ─────────────────────────────────────── */}
      <div className="vehicle-table-wrap">
        <table className="vehicle-table enterprise" aria-label="Fleet telemetry table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Vehicle</th>
              <th scope="col">Driver</th>
              <th scope="col">Status</th>
              <th scope="col">Speed</th>
              <th scope="col">Fuel Tank</th>
              <th scope="col">Battery</th>
              <th scope="col">GPS Signal</th>
              <th scope="col">Engine</th>
              <th scope="col">Location Area</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedVehicles.map((vehicle, index) => {
              const globalIndex = (currentPage - 1) * itemsPerPage + index + 1;
              return (
                <tr key={vehicle.vehicleId} className={index % 2 === 0 ? 'row-even' : 'row-odd'}>
                  {/* # */}
                  <td><span className="row-index">{globalIndex}</span></td>

                  {/* Vehicle Icon + ID */}
                  <td>
                    <div className="vehicle-id">
                      <div className="vehicle-id__icon-wrap">{vehicle.vehicleTypeIcon}</div>
                      <div>
                        <span className="vehicle-id__text">{vehicle.vehicleId}</span>
                        <span className="vehicle-id__sub">{vehicle.vehicleType}</span>
                      </div>
                    </div>
                  </td>

                  {/* Driver Photo/Avatar + Name */}
                  <td>
                    <div className="driver-info">
                      <div
                        className="driver-avatar-badge"
                        style={{ background: vehicle.driverAvatarColor }}
                      >
                        {vehicle.driverInitials}
                        <span className="online-dot" />
                      </div>
                      <span className="driver-name-text">{vehicle.driverName}</span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td>
                    <span className={`status-badge ${getStatusClass(vehicle.status)}`}>
                      <span className="status-dot-pulse" aria-hidden="true">{getStatusEmoji(vehicle.status)}</span>
                      {vehicle.status}
                    </span>
                  </td>

                  {/* Speed */}
                  <td>
                    <div className="speed-cell">
                      <span className="speed-val">{vehicle.speedKmh ?? 0}</span>
                      <span className="speed-unit">km/h</span>
                    </div>
                  </td>

                  {/* Fuel % Progress Bar */}
                  <td>
                    <div className="table-bar-cell">
                      <div className="bar-val-text">{vehicle.fuelPct ?? 75}%</div>
                      <div className="table-progress-track">
                        <div
                          className="table-progress-fill green"
                          style={{ width: `${vehicle.fuelPct ?? 75}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Battery % Progress Bar */}
                  <td>
                    <div className="table-bar-cell">
                      <div className="bar-val-text">{vehicle.batteryPct ?? 90}%</div>
                      <div className="table-progress-track">
                        <div
                          className="table-progress-fill purple"
                          style={{ width: `${vehicle.batteryPct ?? 90}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* GPS Signal */}
                  <td>
                    <span className="gps-signal-cell">{vehicle.gpsSignal ?? '📶 4/4'}</span>
                  </td>

                  {/* Engine State */}
                  <td>
                    <span className={`engine-badge engine-${(vehicle.engineState ?? 'ON').toLowerCase()}`}>
                      {vehicle.engineState ?? 'ON'}
                    </span>
                  </td>

                  {/* Location Area */}
                  <td>
                    <span className="location-cell">{vehicle.locationName ?? 'Bengaluru Central'}</span>
                  </td>

                  {/* Action Button */}
                  <td>
                    <button
                      className="table-action-btn"
                      type="button"
                      onClick={() => alert(`Opening telemetry feed for ${vehicle.vehicleId}`)}
                    >
                      📡 Track
                    </button>
                  </td>
                </tr>
              );
            })}

            {paginatedVehicles.length === 0 && (
              <tr>
                <td colSpan={11} style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
                  No vehicles match the selected search/filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Card Footer & Pagination ────────────────────────────── */}
      <div className="vehicle-list-card__footer">
        <span className="footer-info">
          Showing {paginatedVehicles.length} of {filteredVehicles.length} matching vehicles
        </span>

        {/* Pagination Controls */}
        <div className="table-pagination">
          <button
            type="button"
            className="pag-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
          >
            ‹ Prev
          </button>
          <span className="pag-page-text">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            className="pag-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
          >
            Next ›
          </button>
        </div>
      </div>
    </section>
  );
};

export default VehicleList;
