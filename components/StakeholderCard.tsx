
import React, { useState, useEffect, useRef } from 'react';
import type { Stakeholder } from '../types';
import { ROLE_COLORS } from '../constants';
import { CrownIcon } from './icons';

interface StakeholderCardProps {
  stakeholder: Stakeholder;
  onMove: (id: string, x: number, y: number) => void;
  onEdit: (stakeholder: Stakeholder) => void;
  onConnectionStart?: (stakeholderId: string, x: number, y: number) => void;
  onConnectionEnd?: (stakeholderId: string) => void;
  isConnecting?: boolean;
}

export const StakeholderCard: React.FC<StakeholderCardProps> = ({ 
  stakeholder, 
  onMove, 
  onEdit,
  onConnectionStart,
  onConnectionEnd,
  isConnecting = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    if ((e.target as HTMLElement).classList.contains('connection-dot')) return;
    
    setIsDragging(true);
    const rect = cardRef.current.getBoundingClientRect();
    offsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    e.stopPropagation();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !cardRef.current?.parentElement) return;
      const parentRect = cardRef.current.parentElement.getBoundingClientRect();
      const x = e.clientX - parentRect.left - offsetRef.current.x;
      const y = e.clientY - parentRect.top - offsetRef.current.y;
      
      const boundedX = Math.max(0, Math.min(x, parentRect.width - cardRef.current.offsetWidth));
      const boundedY = Math.max(0, Math.min(y, parentRect.height - cardRef.current.offsetHeight));

      onMove(stakeholder.id, boundedX, boundedY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onMove, stakeholder.id]);

  const handleDoubleClick = () => {
    onEdit(stakeholder);
  }

  const handleConnectionDotMouseDown = (e: React.MouseEvent, side: 'left' | 'right') => {
    e.stopPropagation();
    if (!cardRef.current?.parentElement || !onConnectionStart) return;
    
    const parentRect = cardRef.current.parentElement.getBoundingClientRect();
    const cardRect = cardRef.current.getBoundingClientRect();
    
    const x = side === 'left' 
      ? cardRect.left - parentRect.left
      : cardRect.right - parentRect.left;
    const y = cardRect.top - parentRect.top + cardRect.height / 2;
    
    onConnectionStart(stakeholder.id, x, y);
  };

  const handleConnectionDotMouseUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isConnecting && onConnectionEnd) {
      onConnectionEnd(stakeholder.id);
    }
  };

  return (
    <div
      ref={cardRef}
      className={`absolute w-56 p-4 rounded-2xl shadow-xl cursor-grab group transition-all duration-200 ${isDragging ? 'shadow-glow scale-105 z-20 cursor-grabbing' : 'z-10'}`}
      style={{ 
        left: `${stakeholder.x_pos}px`, 
        top: `${stakeholder.y_pos}px`,
        backgroundColor: '#2E343A',
        backdropFilter: 'blur(8px)',
        border: '1px solid #3E454B'
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      {/* Connection Dots */}
      <div
        className="connection-dot absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-manjaro-mint border-2 border-manjaro-surface cursor-pointer hover:ring-4 hover:ring-manjaro-cyan/50 transition-all z-30"
        onMouseDown={(e) => handleConnectionDotMouseDown(e, 'left')}
        onMouseUp={handleConnectionDotMouseUp}
        title="Input connection"
      />
      <div
        className="connection-dot absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full bg-manjaro-mint border-2 border-manjaro-surface cursor-pointer hover:ring-4 hover:ring-manjaro-cyan/50 transition-all z-30"
        onMouseDown={(e) => handleConnectionDotMouseDown(e, 'right')}
        onMouseUp={handleConnectionDotMouseUp}
        title="Output connection"
      />

      <div className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl ${ROLE_COLORS[stakeholder.role]}`}></div>
      <div className="mt-2">
        <div className="flex items-center gap-1">
          <p className="font-bold text-manjaro-text truncate">{stakeholder.name}</p>
          {stakeholder.is_department_head && (
            <span title="Department Head" className="inline-flex items-center text-manjaro-bg bg-manjaro-dept rounded-full px-1.5 py-0.5 text-[10px] font-bold">
              <CrownIcon className="w-3 h-3 mr-1" /> Head
            </span>
          )}
        </div>
        <p className="text-sm text-manjaro-textAlt truncate">{stakeholder.title}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {stakeholder.department && (
            <div className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full text-manjaro-bg bg-manjaro-dept`}>
              Dept: {stakeholder.department}
            </div>
          )}
          <div className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full text-manjaro-bg ${ROLE_COLORS[stakeholder.role]}`}>
            {stakeholder.role}
          </div>
        </div>
      </div>

      <div className="absolute bottom-full mb-2 w-64 p-3 bg-manjaro-surface border border-manjaro-border rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-30 transform -translate-x-1/4 left-1/2">
        {stakeholder.department && (
          <>
            <h4 className="font-bold text-sm text-manjaro-text">Department:</h4>
            <p className="text-xs text-manjaro-textAlt mb-2">{stakeholder.department}{stakeholder.is_department_head ? ' (Head)' : ''}</p>
          </>
        )}
        {stakeholder.responsibilities && (
          <>
            <h4 className="font-bold text-sm text-manjaro-text">Responsibilities:</h4>
            <p className="text-xs text-manjaro-textAlt mb-2">{stakeholder.responsibilities}</p>
          </>
        )}
        {stakeholder.notes && (
          <>
            <h4 className="font-bold text-sm text-manjaro-text">Notes:</h4>
            <p className="text-xs text-manjaro-textAlt">{stakeholder.notes}</p>
          </>
        )}
        {!stakeholder.department && !stakeholder.responsibilities && !stakeholder.notes && (
          <p className="text-xs text-manjaro-textAlt italic">No additional details.</p>
        )}
        <div className="absolute bottom-[-5px] left-1/4 w-3 h-3 bg-manjaro-surface border-r border-b border-manjaro-border transform rotate-45"></div>
      </div>
    </div>
  );
};
