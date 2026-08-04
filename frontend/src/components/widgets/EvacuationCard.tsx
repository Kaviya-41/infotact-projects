/**
 * EvacuationCard.tsx – Floating evacuation route overlay card
 * Shows turn-by-turn evacuation steps with ETA and distance.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Navigation } from 'lucide-react';
import type { EvacuationRoute } from '../../types/telemetry';

interface EvacuationCardProps {
  data: EvacuationRoute;
}

const EvacuationCard: React.FC<EvacuationCardProps> = ({ data }) => {
  return (
    <motion.div
      className="evac-card"
      id="evacuation-card"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
    >
      {/* Header */}
      <div className="evac-card__header">
        <div className="evac-card__icon">
          <Navigation size={16} />
        </div>
        <div>
          <h3 className="evac-card__title">{data.routeName}</h3>
          <p className="evac-card__subtitle">{data.destination}</p>
        </div>
      </div>

      {/* Steps */}
      <div className="evac-card__steps">
        {data.steps.map((step, i) => (
          <div className="evac-step" key={step.id}>
            <div className="evac-step__line">
              <div
                className={`evac-step__dot${
                  step.status === 'active' ? ' evac-step__dot--active' :
                  step.status === 'completed' ? ' evac-step__dot--done' : ''
                }`}
              />
              {i < data.steps.length - 1 && <div className="evac-step__connector" />}
            </div>
            <div className="evac-step__content">
              <p className="evac-step__name">{step.instruction}</p>
              <p className="evac-step__meta">{step.distance}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer stats */}
      <div className="evac-card__footer">
        <div className="evac-card__stat">
          <span className="evac-card__stat-value">{data.eta}</span>
          <span className="evac-card__stat-label">ETA</span>
        </div>
        <div className="evac-card__stat">
          <span className="evac-card__stat-value">{data.totalDistance}</span>
          <span className="evac-card__stat-label">Distance</span>
        </div>
      </div>
    </motion.div>
  );
};

export default EvacuationCard;
