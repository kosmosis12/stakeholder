import React from 'react';
import type { Stakeholder } from '../types';
import { StakeholderCard } from './StakeholderCard';

interface CanvasProps {
  stakeholders: Stakeholder[];
  onUpdateStakeholderPosition: (id: string, x: number, y: number) => void;
  onEditStakeholder: (stakeholder: Stakeholder) => void;
}

export const Canvas: React.FC<CanvasProps> = ({ stakeholders, onUpdateStakeholderPosition, onEditStakeholder }) => {
  return (
    <div className="w-full h-full relative overflow-hidden bg-grid">
      {stakeholders.map(stakeholder => (
        <StakeholderCard
          key={stakeholder.id}
          stakeholder={stakeholder}
          onMove={onUpdateStakeholderPosition}
          onEdit={onEditStakeholder}
        />
      ))}
      <style>{`
        .bg-grid {
          background-image:
            linear-gradient(rgba(62, 69, 75, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(62, 69, 75, 0.4) 1px, transparent 1px);
          background-size: 20px 20px;
          background-position: -1px -1px;
        }
      `}</style>
    </div>
  );
};