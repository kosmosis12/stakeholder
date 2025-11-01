
import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import type { Stakeholder } from '../types';
import { ROLE_COLORS } from '../constants';

export const StakeholderNode: React.FC<NodeProps<Stakeholder>> = ({ data, selected }) => {
  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-manjaro-mint border-2 border-manjaro-surface"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-manjaro-mint border-2 border-manjaro-surface"
      />
      <Handle
        type="source"
        position={Position.Left}
        className="w-3 h-3 !bg-manjaro-mint border-2 border-manjaro-surface"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-manjaro-mint border-2 border-manjaro-surface"
      />
      
      <div
        className={`w-56 p-4 rounded-2xl shadow-xl cursor-grab group transition-all duration-200 ${selected ? 'ring-2 ring-manjaro-mint shadow-glow' : ''}`}
        style={{ 
          backgroundColor: '#2E343A',
          backdropFilter: 'blur(8px)',
          border: '1px solid #3E454B'
        }}
      >
        <div className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl ${ROLE_COLORS[data.role]}`}></div>
        <div className="mt-2">
          <p className="font-bold text-manjaro-text truncate">{data.name}</p>
          <p className="text-sm text-manjaro-textAlt truncate">{data.title}</p>
          <div className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-2 text-manjaro-bg ${ROLE_COLORS[data.role]}`}>
            {data.role}
          </div>
        </div>

        <div className="absolute bottom-full mb-2 w-64 p-3 bg-manjaro-surface border border-manjaro-border rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-30 transform -translate-x-1/4 left-1/2">
          {data.responsibilities && (
            <>
              <h4 className="font-bold text-sm text-manjaro-text">Responsibilities:</h4>
              <p className="text-xs text-manjaro-textAlt mb-2">{data.responsibilities}</p>
            </>
          )}
          {data.notes && (
            <>
              <h4 className="font-bold text-sm text-manjaro-text">Notes:</h4>
              <p className="text-xs text-manjaro-textAlt">{data.notes}</p>
            </>
          )}
          {!data.responsibilities && !data.notes && (
            <p className="text-xs text-manjaro-textAlt italic">No additional details.</p>
          )}
          <div className="absolute bottom-[-5px] left-1/4 w-3 h-3 bg-manjaro-surface border-r border-b border-manjaro-border transform rotate-45"></div>
        </div>
      </div>
    </div>
  );
};
