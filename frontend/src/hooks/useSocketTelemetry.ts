/**
 * useSocketTelemetry.ts – Telemetry hook structural placeholder for future Socket.IO integration
 *
 * Phase 9: Disabled fake random speed interval.
 * The hook structure and initial data shape are preserved for future Socket.IO integration.
 * Real-time telemetry via Socket.IO can be added in a later phase.
 */

import { useState } from 'react';
import type { TelemetrySnapshot } from '../types/telemetry';

const INITIAL_SNAPSHOT: TelemetrySnapshot = {
  speed: { value: 0, rpm: 0, fuelEfficiency: 0, tripDistance: 0, updated: 'Awaiting data' },
  health: {
    overallScore: 0,
    items: [
      { id: 'engine', name: 'Engine State', status: 'Healthy', value: '—', pct: 0, icon: 'Activity' },
      { id: 'fuel', name: 'Fuel Level', status: 'Optimal', value: '—', pct: 0, icon: 'Fuel' },
    ]
  },
  route: {
    routeName: '—',
    origin: '—',
    destination: '—',
    vehicleId: '—',
    driverName: '—',
    nextTurn: '—',
    eta: '—',
    totalDistance: '—',
    steps: []
  },
  alerts: [],
  efficiency: {
    fuelRemainingPct: 0,
    avgConsumptionKmpl: 0,
    distanceTodayKm: 0,
    idleTimeMin: 0,
    fleetEfficiencyPct: 0,
  },
  timestamp: new Date().toISOString(),
};

export const useSocketTelemetry = (_updateIntervalMs: number = 3000) => {
  const [telemetry] = useState<TelemetrySnapshot>(INITIAL_SNAPSHOT);

  // Phase 9: Fake random interval removed.
  // Future Socket.IO integration will replace this with:
  //   socket.on('telemetry', (data) => setTelemetry(data));

  return telemetry;
};
