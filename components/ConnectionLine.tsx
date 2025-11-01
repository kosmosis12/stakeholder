
import React from 'react';
import type { Connection, Stakeholder } from '../types';

interface ConnectionLineProps {
  connection: Connection;
  stakeholders: Stakeholder[];
  onDelete: (id: string) => void;
}

export const ConnectionLine: React.FC<ConnectionLineProps> = ({ connection, stakeholders, onDelete }) => {
  const source = stakeholders.find(s => s.id === connection.sourceId);
  const target = stakeholders.find(s => s.id === connection.targetId);

  if (!source || !target) return null;

  const sourceX = source.x_pos + 224;
  const sourceY = source.y_pos + 80;
  const targetX = target.x_pos;
  const targetY = target.y_pos + 80;

  const midX = (sourceX + targetX) / 2;
  const controlX1 = sourceX + (midX - sourceX) * 0.5;
  const controlX2 = targetX - (targetX - midX) * 0.5;

  const path = `M ${sourceX} ${sourceY} C ${controlX1} ${sourceY}, ${controlX2} ${targetY}, ${targetX} ${targetY}`;

  return (
    <g
      className="connection-line cursor-pointer"
      onContextMenu={(e) => {
        e.preventDefault();
        onDelete(connection.id);
      }}
    >
      <defs>
        <filter id={`glow-${connection.id}`}>
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <path
        d={path}
        stroke="#34BE5B"
        strokeWidth="3"
        fill="none"
        className="transition-all duration-200 hover:stroke-[#00BFA6]"
        filter={`url(#glow-${connection.id})`}
        style={{ filter: 'drop-shadow(0 0 6px rgba(52,190,91,0.8))' }}
      />
    </g>
  );
};

interface TempConnectionLineProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export const TempConnectionLine: React.FC<TempConnectionLineProps> = ({ startX, startY, endX, endY }) => {
  const midX = (startX + endX) / 2;
  const controlX1 = startX + (midX - startX) * 0.5;
  const controlX2 = endX - (endX - midX) * 0.5;

  const path = `M ${startX} ${startY} C ${controlX1} ${startY}, ${controlX2} ${endY}, ${endX} ${endY}`;

  return (
    <path
      d={path}
      stroke="#00BFA6"
      strokeWidth="2"
      strokeDasharray="5,5"
      fill="none"
      opacity="0.7"
      style={{ filter: 'drop-shadow(0 0 8px rgba(0,191,166,0.6))' }}
    />
  );
};
