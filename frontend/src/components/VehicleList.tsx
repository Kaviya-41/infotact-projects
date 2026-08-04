/**
 * VehicleList.tsx – Enterprise Fleet Vehicle Telemetry Table
 */

import React, { useState, useMemo } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Truck, Wifi } from 'lucide-react';
import type { Vehicle } from '../types/fleet';
import '../styles/dashboard.css';

const SAMPLE_VEHICLES: Vehicle[] = [
  {
    id: 'FLT-024',
    name: 'Freightliner Cascadia #24',
    type: 'Heavy Truck',
    driver: 'Arjun Kumar',
    status: 'Moving',
    location: 'I-95 North, Mile Marker 142',
    telemetry: { speed: 68, fuelLevel: 72, engineHealth: 'Healthy', gpsConnected: true, tripDistance: 142, lastUpdate: '2 sec ago', latitude: 38.89, longitude: -77.03 }
  },
  {
    id: 'FLT-012',
    name: 'Mercedes Sprinter #12',
    type: 'Delivery Van',
    driver: 'Sarah Chen',
    status: 'Moving',
    location: 'Downtown Commerce Way',
    telemetry: { speed: 54, fuelLevel: 88, engineHealth: 'Healthy', gpsConnected: true, tripDistance: 88, lastUpdate: '4 sec ago', latitude: 38.90, longitude: -77.04 }
  },
  {
    id: 'FLT-007',
    name: 'Volvo FH16 #07',
    type: 'Heavy Truck',
    driver: 'Marcus Vance',
    status: 'Moving',
    location: 'Highland Logistics Parkway',
    telemetry: { speed: 72, fuelLevel: 45, engineHealth: 'Healthy', gpsConnected: true, tripDistance: 310, lastUpdate: '1 sec ago', latitude: 38.91, longitude: -77.01 }
  },
  {
    id: 'FLT-031',
    name: 'Ford Transit #31',
    type: 'Delivery Van',
    driver: 'Elena Rostova',
    status: 'Stopped',
    location: 'Sector 4 Distribution Depot',
    telemetry: { speed: 0, fuelLevel: 64, engineHealth: 'Healthy', gpsConnected: true, tripDistance: 52, lastUpdate: '12 sec ago', latitude: 38.88, longitude: -77.02 }
  },
  {
    id: 'FLT-018',
    name: 'Kenworth T680 #18',
    type: 'Heavy Truck',
    driver: 'David Miller',
    status: 'Offline',
    location: 'Route 9 Service Terminal',
    telemetry: { speed: 0, fuelLevel: 30, engineHealth: 'Warning', gpsConnected: false, tripDistance: 195, lastUpdate: '2 min ago', latitude: 38.85, longitude: -77.05 }
  },
  {
    id: 'FLT-005',
    name: 'Isuzu NPR #05',
    type: 'Cargo Vessel',
    driver: 'Kenji Sato',
    status: 'Moving',
    location: 'East Coast Corridor B',
    telemetry: { speed: 48, fuelLevel: 92, engineHealth: 'Healthy', gpsConnected: true, tripDistance: 110, lastUpdate: '3 sec ago', latitude: 38.92, longitude: -77.06 }
  },
  {
    id: 'FLT-044',
    name: 'Peterbilt 579 #44',
    type: 'Heavy Truck',
    driver: 'Robert Hayes',
    status: 'Stopped',
    location: 'Rest Stop Area 12',
    telemetry: { speed: 0, fuelLevel: 58, engineHealth: 'Healthy', gpsConnected: true, tripDistance: 275, lastUpdate: '45 sec ago', latitude: 38.87, longitude: -77.07 }
  },
];

interface VehicleListProps {
  onSelectVehicle?: (vehicle: Vehicle) => void;
  selectedVehicleId?: string;
}

const VehicleList: React.FC<VehicleListProps> = ({ onSelectVehicle, selectedVehicleId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredVehicles = useMemo(() => {
    return SAMPLE_VEHICLES.filter((v) => {
      const matchesSearch =
        v.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || v.status.toUpperCase() === statusFilter.toUpperCase();

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  return (
    <div className="table-card" id="vehicle-fleet-table">
      {/* Table Toolbar */}
      <div className="table-toolbar">
        <div>
          <h3 className="fleet-card__title">Vehicle Fleet Telemetry</h3>
          <p style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
            Live status metrics across all connected satellite nodes
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={14} color="#64748B" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                fontSize: '13px',
                color: '#0F172A',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">All Statuses ({SAMPLE_VEHICLES.length})</option>
              <option value="MOVING">Moving</option>
              <option value="STOPPED">Stopped</option>
              <option value="OFFLINE">Offline</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="table-toolbar__search">
            <Search size={14} className="header__search-icon" />
            <input
              type="search"
              className="table-toolbar__search-input"
              placeholder="Filter by vehicle, driver..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="fleet-table-wrapper">
        <table className="fleet-table">
          <thead>
            <tr>
              <th>Vehicle ID</th>
              <th>Driver Name</th>
              <th>Status</th>
              <th>Velocity</th>
              <th>Fuel Level</th>
              <th>GPS Signal</th>
              <th>Current Location</th>
              <th>Last Update</th>
            </tr>
          </thead>
          <tbody>
            {filteredVehicles.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: '#64748B' }}>
                  No vehicles matched your search filter criteria.
                </td>
              </tr>
            ) : (
              filteredVehicles.map((v) => {
                const isSelected = selectedVehicleId === v.id;
                return (
                  <tr
                    key={v.id}
                    onClick={() => onSelectVehicle && onSelectVehicle(v)}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: isSelected ? '#EFF6FF' : undefined
                    }}
                  >
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Truck size={16} color="#2563EB" />
                        <div>
                          <div style={{ fontWeight: 700, color: '#0F172A' }}>{v.id}</div>
                          <div style={{ fontSize: '11px', color: '#64748B' }}>{v.name}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, color: '#334155' }}>{v.driver}</td>
                    <td>
                      <span className={`status-badge status-badge--${v.status.toLowerCase()}`}>
                        <span className="status-badge__dot" />
                        {v.status}
                      </span>
                    </td>
                    <td className="tabular-nums" style={{ fontWeight: 700 }}>
                      {v.telemetry.speed > 0 ? `${v.telemetry.speed} km/h` : '0 km/h'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '60px', height: '6px', backgroundColor: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                          <div
                            style={{
                              height: '100%',
                              width: `${v.telemetry.fuelLevel}%`,
                              backgroundColor: v.telemetry.fuelLevel > 25 ? '#16A34A' : '#DC2626'
                            }}
                          />
                        </div>
                        <span className="tabular-nums" style={{ fontSize: '12px', fontWeight: 600 }}>{v.telemetry.fuelLevel}%</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: v.telemetry.gpsConnected ? '#16A34A' : '#DC2626' }}>
                        <Wifi size={14} /> {v.telemetry.gpsConnected ? 'Online' : 'Lost'}
                      </div>
                    </td>
                    <td style={{ color: '#475569', fontSize: '12px' }}>{v.location}</td>
                    <td className="tabular-nums" style={{ color: '#94A3B8', fontSize: '12px' }}>{v.telemetry.lastUpdate}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        backgroundColor: '#F8FAFC',
        borderTop: '1px solid #E2E8F0',
        fontSize: '12px',
        color: '#64748B'
      }}>
        <div>Showing 1-{filteredVehicles.length} of {SAMPLE_VEHICLES.length} vehicles</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button style={{ padding: '4px 8px', border: '1px solid #E2E8F0', borderRadius: '6px', background: '#FFFFFF', cursor: 'pointer' }} disabled>
            <ChevronLeft size={14} />
          </button>
          <span style={{ fontWeight: 600, color: '#0F172A' }}>Page 1 of 1</span>
          <button style={{ padding: '4px 8px', border: '1px solid #E2E8F0', borderRadius: '6px', background: '#FFFFFF', cursor: 'pointer' }} disabled>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleList;
