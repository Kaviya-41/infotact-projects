/**
 * vehicle.ts — TypeScript type definitions for vehicle data.
 *
 * BackendVehicle matches the MongoDB / Express backend model shape.
 * The UI component's Vehicle interface (in VehicleList.tsx) extends this
 * with presentation-only fields (driverInitials, avatarColor, icons, etc.).
 */

/** Shape returned by GET /vehicles from the backend */
export interface BackendVehicle {
  _id: string;
  vehicleId: string;
  driverName: string;
  latitude: number;
  longitude: number;
  speed: number;
  status: string;
  lastUpdated: string;
}
