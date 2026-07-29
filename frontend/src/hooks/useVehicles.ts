/**
 * useVehicles.ts — Custom React hook for fetching vehicle data.
 *
 * Calls fetchVehicles() and maps the backend response into the UI-enriched
 * Vehicle shape expected by VehicleList.tsx (adds initials, avatar color,
 * vehicle type icon, etc.).
 *
 * Returns { vehicles, loading, error, refetch }.
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchVehicles } from '../api/vehicleApi';
import type { BackendVehicle } from '../types/vehicle';
import type { Vehicle, VehicleStatus } from '../components/VehicleList';

// ── Helpers for mapping backend → UI ────────────────────────────────────────

/** Extract two-character initials from a full name */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

/** Deterministic avatar color based on the vehicle ID string */
const AVATAR_COLORS = [
  '#4F8CFF', '#A78BFA', '#FF5C5C', '#31D67B', '#FFB547',
  '#8b5cf6', '#00D4FF', '#06b6d4', '#f97316', '#a855f7',
];

function getAvatarColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

/** Map backend status string to the VehicleStatus union type */
function normalizeStatus(status: string): VehicleStatus {
  const mapped: Record<string, VehicleStatus> = {
    moving:      'Moving',
    stopped:     'Stopped',
    offline:     'Offline',
    idle:        'Idle',
    online:      'Online',
    maintenance: 'Maintenance',
  };
  return mapped[status.toLowerCase()] ?? 'Offline';
}

/** Derive a vehicle type & icon from the vehicle ID prefix or fallback */
function getVehicleTypeInfo(vehicleId: string): { vehicleType: string; vehicleTypeIcon: string } {
  // Simple deterministic assignment based on ID hash
  const types: Array<{ vehicleType: string; vehicleTypeIcon: string }> = [
    { vehicleType: 'Heavy Truck',       vehicleTypeIcon: '🚛' },
    { vehicleType: 'Cargo Van',         vehicleTypeIcon: '🚐' },
    { vehicleType: 'Trailer Hauler',    vehicleTypeIcon: '🚜' },
    { vehicleType: 'Mini Truck',        vehicleTypeIcon: '🚚' },
    { vehicleType: 'Container Carrier', vehicleTypeIcon: '🏗️' },
  ];

  let hash = 0;
  for (let i = 0; i < vehicleId.length; i++) {
    hash = vehicleId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return types[Math.abs(hash) % types.length];
}

/** Format an ISO date string into a human-readable relative time */
function formatRelativeTime(isoString: string): string {
  const now = Date.now();
  const then = new Date(isoString).getTime();
  if (isNaN(then)) return isoString; // Already a relative string or unparseable

  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return `${diffSec} sec ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hr ago`;
  return `${Math.floor(diffHr / 24)} day ago`;
}

// ── Map a single backend vehicle to the UI Vehicle shape ────────────────────

function mapBackendToUI(bv: BackendVehicle): Vehicle {
  const typeInfo = getVehicleTypeInfo(bv.vehicleId);
  const status = normalizeStatus(bv.status);

  return {
    vehicleId:        bv.vehicleId,
    driverName:       bv.driverName,
    driverInitials:   getInitials(bv.driverName),
    driverAvatarColor: getAvatarColor(bv.vehicleId),
    vehicleType:      typeInfo.vehicleType,
    vehicleTypeIcon:  typeInfo.vehicleTypeIcon,
    status,
    speedKmh:         status === 'Offline' ? null : bv.speed,
    latitude:         bv.latitude,
    longitude:        bv.longitude,
    lastUpdated:      formatRelativeTime(bv.lastUpdated),
  };
}

// ── Hook ────────────────────────────────────────────────────────────────────

export interface UseVehiclesResult {
  vehicles: Vehicle[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useVehicles(): UseVehiclesResult {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading]   = useState<boolean>(true);
  const [error, setError]       = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchVehicles();
      setVehicles(data.map(mapBackendToUI));
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to fetch vehicles';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { vehicles, loading, error, refetch };
}
