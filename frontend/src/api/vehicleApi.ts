/**
 * vehicleApi.ts — Vehicle API Service
 *
 * Provides functions that call vehicle-related backend endpoints
 * using the shared Axios instance. All response types are imported
 * from the centralized types directory.
 */

import api from './axios';
import type { BackendVehicle } from '../types/vehicle';

/**
 * Fetches the full list of vehicles from the backend.
 * Endpoint: GET /vehicles
 */
export async function fetchVehicles(): Promise<BackendVehicle[]> {
  const response = await api.get<BackendVehicle[]>('/vehicles');
  return response.data;
}
