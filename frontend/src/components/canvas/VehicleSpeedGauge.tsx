/**
 * VehicleSpeedGauge.tsx – Vehicle Speed Gauge component wrapper
 */

import React from 'react';
import VehicleGauge from './VehicleGauge';
import type { VehicleSpeed } from '../../types/telemetry';

interface VehicleSpeedGaugeProps {
  data?: VehicleSpeed;
}

const VehicleSpeedGauge: React.FC<VehicleSpeedGaugeProps> = (props) => {
  return <VehicleGauge {...props} />;
};

export default VehicleSpeedGauge;
