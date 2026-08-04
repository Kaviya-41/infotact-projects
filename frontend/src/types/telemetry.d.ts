/**
 * telemetry.d.ts – TypeScript interfaces for Disaster Intelligence telemetry data
 */

/** Threat severity levels */
export type ThreatSeverity = 'critical' | 'high' | 'moderate' | 'low' | 'minimal';

/** Infrastructure operational status */
export type InfraStatus = 'operational' | 'degraded' | 'offline';

/** Alert severity for banner display */
export type AlertSeverity = 'critical' | 'warning' | 'info' | 'success';

/** Real-time threat level telemetry */
export interface ThreatLevel {
  value: number;        // 0–100 scale
  severity: ThreatSeverity;
  label: string;        // e.g., "Category 3 Hurricane"
  windSpeed: number;    // km/h
  impactForce: number;  // kN
  updated: string;      // ISO timestamp
}

/** Infrastructure health for a single system */
export interface InfrastructureHealthItem {
  id: string;
  name: string;
  status: InfraStatus;
  healthPercent: number;   // 0–100
  icon: string;            // Lucide icon name or emoji
}

/** Full infrastructure health report */
export interface InfrastructureHealth {
  items: InfrastructureHealthItem[];
  overallScore: number;    // 0–100
  lastUpdated: string;     // ISO timestamp
}

/** A single step in an evacuation route */
export interface EvacuationStep {
  id: string;
  instruction: string;     // e.g., "Turn Right onto Highway 101"
  distance: string;        // e.g., "3.2 km"
  status: 'completed' | 'active' | 'pending';
}

/** Full evacuation route data */
export interface EvacuationRoute {
  routeName: string;
  destination: string;
  eta: string;             // e.g., "23 min"
  totalDistance: string;    // e.g., "52 km"
  steps: EvacuationStep[];
}

/** A single alert event */
export interface AlertEvent {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  timestamp: string;       // ISO timestamp
  source: string;          // e.g., "Seismic Sensor Grid"
}

/** Resource allocation for a category */
export interface ResourceAllocation {
  id: string;
  name: string;
  allocated: number;
  total: number;
  unit: string;           // e.g., "units", "personnel", "vehicles"
  color: string;          // CSS color for the bar
}

/** Full telemetry snapshot pushed via Socket */
export interface TelemetrySnapshot {
  threatLevel: ThreatLevel;
  infrastructureHealth: InfrastructureHealth;
  evacuationRoute: EvacuationRoute;
  alerts: AlertEvent[];
  resources: ResourceAllocation[];
  timestamp: string;
}
