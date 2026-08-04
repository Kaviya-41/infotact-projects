/**
 * useVehicles.ts — Custom React hook for vehicle state.
 */

import { useState } from 'react';
import type { Vehicle } from '../types/fleet';

export function useVehicles() {
  const [vehicles] = useState<Vehicle[]>([]);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  return { vehicles, loading, error };
}
