/**
 * useSocketTelemetry.ts – Telemetry hook structural placeholder for Week 2 Socket.IO integration
 */

import { useState, useEffect } from 'react';
import type { TelemetrySnapshot } from '../types/telemetry';

const INITIAL_SNAPSHOT: TelemetrySnapshot = {
  speed: { value: 68, rpm: 2100, fuelEfficiency: 12.4, tripDistance: 142, updated: '2 sec ago' },
  health: {
    overallScore: 98,
    items: [
      { id: 'engine', name: 'Engine State', status: 'Healthy', value: '100%', pct: 100, icon: 'Activity' },
      { id: 'fuel', name: 'Fuel Level', status: 'Optimal', value: '72%', pct: 72, icon: 'Fuel' },
    ]
  },
  route: {
    routeName: 'Route #14',
    origin: 'Bengaluru Logistics Hub',
    destination: 'Hosur Distribution Center',
    vehicleId: 'FLT-024',
    driverName: 'Arjun Kumar',
    nextTurn: 'Turn right in 450 m onto Hosur Main Rd',
    eta: '28 min',
    totalDistance: '32.4 km',
    steps: []
  },
  alerts: [
    { id: 'a1', severity: 'Critical', vehicleId: 'FLT-018', title: 'Vehicle Offline', message: 'Last signal 4 min ago', timestamp: '4m ago' },
    { id: 'a2', severity: 'Warning', vehicleId: 'FLT-031', title: 'Speed Limit Exceeded', message: 'Current speed 92 km/h', timestamp: '2m ago' },
  ],
  efficiency: {
    fuelRemainingPct: 72,
    avgConsumptionKmpl: 12.4,
    distanceTodayKm: 142,
    idleTimeMin: 18,
    fleetEfficiencyPct: 86,
  },
  timestamp: new Date().toISOString(),
};

export const useSocketTelemetry = (updateIntervalMs: number = 3000) => {
  const [telemetry, setTelemetry] = useState<TelemetrySnapshot>(INITIAL_SNAPSHOT);

  useEffect(() => {
    // Week 1: Mock interval. Week 2 will replace with socket.on('telemetry', ...)
    const interval = setInterval(() => {
      setTelemetry((prev) => ({
        ...prev,
        speed: {
          ...prev.speed,
          value: Math.floor(65 + Math.random() * 8),
          updated: 'Just now',
        },
        timestamp: new Date().toISOString(),
      }));
    }, updateIntervalMs);

    return () => clearInterval(interval);
  }, [updateIntervalMs]);

  return telemetry;
};
