/**
 * useSocketTelemetry.ts – Mock real-time telemetry data generator
 *
 * Simulates disaster telemetry updates via setInterval.
 * Architecture is drop-in ready for real Socket.IO integration:
 * just replace the interval logic with socket.on('telemetry', ...).
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import type {
  ThreatLevel,
  InfrastructureHealthItem,
  EvacuationRoute,
  AlertEvent,
  ResourceAllocation,
  ThreatSeverity,
} from '../types/telemetry';

// ── Helpers ────────────────────────────────────────────────────────────────────

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const randDrift = (current: number, maxDelta: number, min: number, max: number) =>
  clamp(current + (Math.random() - 0.5) * maxDelta * 2, min, max);

const getSeverity = (value: number): ThreatSeverity => {
  if (value >= 80) return 'critical';
  if (value >= 60) return 'high';
  if (value >= 40) return 'moderate';
  if (value >= 20) return 'low';
  return 'minimal';
};

const getSeverityLabel = (value: number): string => {
  if (value >= 80) return 'Category 4+ Hurricane';
  if (value >= 60) return 'Category 3 Hurricane';
  if (value >= 40) return 'Severe Tropical Storm';
  if (value >= 20) return 'Tropical Depression';
  return 'Low Pressure System';
};

// ── Initial Data ───────────────────────────────────────────────────────────────

const INITIAL_THREAT: ThreatLevel = {
  value: 68,
  severity: 'high',
  label: 'Category 3 Hurricane',
  windSpeed: 178,
  impactForce: 52,
  updated: new Date().toISOString(),
};

const INITIAL_INFRA: InfrastructureHealthItem[] = [
  { id: 'power',   name: 'Power Grid',      status: 'degraded',    healthPercent: 62, icon: '⚡' },
  { id: 'water',   name: 'Water System',     status: 'operational', healthPercent: 89, icon: '💧' },
  { id: 'comms',   name: 'Communications',   status: 'operational', healthPercent: 94, icon: '📡' },
  { id: 'trans',   name: 'Transport Network',status: 'degraded',    healthPercent: 45, icon: '🛤️' },
  { id: 'medical', name: 'Medical Facilities',status: 'operational', healthPercent: 78, icon: '🏥' },
];

const INITIAL_EVAC: EvacuationRoute = {
  routeName: 'Route Alpha-7',
  destination: 'Safe Zone – Highlands Center',
  eta: '23 min',
  totalDistance: '52 km',
  steps: [
    { id: 's1', instruction: 'Proceed North on Main St',     distance: '1.2 km', status: 'completed' },
    { id: 's2', instruction: 'Turn right onto Highway 101',  distance: '18.4 km', status: 'completed' },
    { id: 's3', instruction: 'Take Exit 42 – Highland Ave',  distance: '3.1 km',  status: 'active' },
    { id: 's4', instruction: 'Continue to Safe Zone facility',distance: '29.3 km', status: 'pending' },
  ],
};

const INITIAL_ALERTS: AlertEvent[] = [
  {
    id: 'a1',
    severity: 'critical',
    title: 'Flash Flood Warning',
    description: 'Sector 7 – Water levels rising rapidly',
    timestamp: new Date(Date.now() - 120000).toISOString(),
    source: 'Hydrology Sensor Grid',
  },
  {
    id: 'a2',
    severity: 'warning',
    title: 'Power Grid Instability',
    description: 'Substations B4, B7 experiencing overload',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    source: 'Energy Infrastructure Monitor',
  },
  {
    id: 'a3',
    severity: 'info',
    title: 'Shelter Capacity Update',
    description: 'Highland Center at 68% capacity',
    timestamp: new Date(Date.now() - 600000).toISOString(),
    source: 'Logistics Command',
  },
];

const INITIAL_RESOURCES: ResourceAllocation[] = [
  { id: 'r1', name: 'Personnel',       allocated: 342,  total: 500,  unit: 'responders', color: '#FF8A00' },
  { id: 'r2', name: 'Vehicles',        allocated: 87,   total: 120,  unit: 'units',      color: '#3B82F6' },
  { id: 'r3', name: 'Medical Supplies', allocated: 2800, total: 5000, unit: 'kits',       color: '#10B981' },
  { id: 'r4', name: 'Shelter Capacity', allocated: 1240, total: 2000, unit: 'beds',       color: '#8B5CF6' },
  { id: 'r5', name: 'Drones',          allocated: 18,   total: 24,   unit: 'active',     color: '#EC4899' },
];

// ── Hook ───────────────────────────────────────────────────────────────────────

export interface TelemetryState {
  threat: ThreatLevel;
  infrastructure: InfrastructureHealthItem[];
  evacuation: EvacuationRoute;
  alerts: AlertEvent[];
  resources: ResourceAllocation[];
}

export const useSocketTelemetry = (updateIntervalMs: number = 2500): TelemetryState => {
  const [threat, setThreat] = useState<ThreatLevel>(INITIAL_THREAT);
  const [infrastructure, setInfrastructure] = useState<InfrastructureHealthItem[]>(INITIAL_INFRA);
  const [evacuation] = useState<EvacuationRoute>(INITIAL_EVAC);
  const [alerts, setAlerts] = useState<AlertEvent[]>(INITIAL_ALERTS);
  const [resources, setResources] = useState<ResourceAllocation[]>(INITIAL_RESOURCES);

  const frameRef = useRef(0);

  const tick = useCallback(() => {
    frameRef.current++;

    // Drift threat value
    setThreat(prev => {
      const newVal = Math.round(randDrift(prev.value, 3, 20, 95));
      return {
        ...prev,
        value: newVal,
        severity: getSeverity(newVal),
        label: getSeverityLabel(newVal),
        windSpeed: Math.round(randDrift(prev.windSpeed, 8, 80, 260)),
        impactForce: Math.round(randDrift(prev.impactForce, 4, 10, 90)),
        updated: new Date().toISOString(),
      };
    });

    // Drift infrastructure health
    setInfrastructure(prev =>
      prev.map(item => {
        const newPct = Math.round(randDrift(item.healthPercent, 3, 10, 100));
        const newStatus = newPct >= 75 ? 'operational' : newPct >= 40 ? 'degraded' : 'offline';
        return { ...item, healthPercent: newPct, status: newStatus };
      })
    );

    // Drift resources
    setResources(prev =>
      prev.map(r => ({
        ...r,
        allocated: Math.round(randDrift(r.allocated, r.total * 0.02, 0, r.total)),
      }))
    );

    // Occasionally add a new alert
    if (frameRef.current % 5 === 0) {
      const newAlertPool: Omit<AlertEvent, 'id' | 'timestamp'>[] = [
        { severity: 'critical', title: 'Seismic Activity Detected', description: 'Magnitude 4.2 – 12km NE of sector 3', source: 'Seismic Array' },
        { severity: 'warning', title: 'Road Blockage Reported', description: 'Highway 101 at mile marker 38', source: 'Transport Monitoring' },
        { severity: 'info', title: 'Drone Surveillance Complete', description: 'Sector 5 sweep finished – no anomalies', source: 'Aerial Recon' },
        { severity: 'success', title: 'Shelter Resupply Confirmed', description: 'Highland Center received medical kits', source: 'Logistics Command' },
        { severity: 'critical', title: 'Dam Pressure Warning', description: 'Reservoir B pressure exceeding threshold', source: 'Hydrology Sensor Grid' },
        { severity: 'warning', title: 'Comm Tower Degraded', description: 'Tower 14 signal strength below 40%', source: 'Communications Grid' },
      ];

      const pick = newAlertPool[Math.floor(Math.random() * newAlertPool.length)];
      const newAlert: AlertEvent = {
        ...pick,
        id: `a-${Date.now()}`,
        timestamp: new Date().toISOString(),
      };

      setAlerts(prev => [newAlert, ...prev].slice(0, 8));
    }
  }, []);

  useEffect(() => {
    const id = setInterval(tick, updateIntervalMs);
    return () => clearInterval(id);
  }, [tick, updateIntervalMs]);

  return { threat, infrastructure, evacuation, alerts, resources };
};
