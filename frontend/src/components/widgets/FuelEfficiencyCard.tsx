/**
 * FuelEfficiencyCard.tsx – Fuel & Energy Utilization Card
 */

import React from 'react';
import { Fuel } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

const FuelEfficiencyCard: React.FC = () => {
  return (
    <GlassCard title="Fuel & Fleet Efficiency" titleIcon={<Fuel size={18} color="#D97706" />} id="fuel-efficiency-card">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Metric 1 */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
            <span style={{ color: '#64748B', fontWeight: 600 }}>Fuel Remaining</span>
            <span style={{ fontWeight: 700, color: '#0F172A' }} className="font-mono">72%</span>
          </div>
          <div style={{ height: '6px', backgroundColor: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '72%', backgroundColor: '#D97706', borderRadius: '3px' }}></div>
          </div>
        </div>

        {/* Metric 2 */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
            <span style={{ color: '#64748B', fontWeight: 600 }}>Fleet Efficiency Index</span>
            <span style={{ fontWeight: 700, color: '#16A34A' }} className="font-mono">86%</span>
          </div>
          <div style={{ height: '6px', backgroundColor: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '86%', backgroundColor: '#16A34A', borderRadius: '3px' }}></div>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', paddingTop: '8px', borderTop: '1px solid #F1F5F9' }}>
          <div style={{ backgroundColor: '#F8FAFC', padding: '8px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>Avg Consumption</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }} className="font-mono">12.4 km/L</div>
          </div>

          <div style={{ backgroundColor: '#F8FAFC', padding: '8px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>Distance Today</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }} className="font-mono">142 km</div>
          </div>

          <div style={{ backgroundColor: '#F8FAFC', padding: '8px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>Idle Time</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }} className="font-mono">18 min</div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default FuelEfficiencyCard;
