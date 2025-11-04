import React, { useState, useEffect, useRef } from 'react';
import type { Stakeholder } from '../types';
import { ROLE_COLORS } from '../constants';
import { ExternalLinkIcon, LinkIcon } from './icons';

interface StakeholderCardProps {
  stakeholder: Stakeholder;
  onMove: (id: string, x: number, y: number) => void;
  onEdit: (stakeholder: Stakeholder) => void;
  isConnecting?: boolean;
  connectingFromId?: string | null;
  onStartConnect?: (id: string) => void;
  onCompleteConnect?: (targetId: string) => void;
  zoom?: number;
}

export const StakeholderCard: React.FC<StakeholderCardProps> = ({ stakeholder, onMove, onEdit, isConnecting, connectingFromId, onStartConnect, onCompleteConnect, zoom = 1 }) => {
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    if (isConnecting) return; // do not start dragging while connecting
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
      const x = (e.clientX - parentRect.left - offsetRef.current.x) / zoom;
      const y = (e.clientY - parentRect.top - offsetRef.current.y) / zoom;
      
      const boundedX = Math.max(0, Math.min(x, parentRect.width / zoom - cardRef.current.offsetWidth));
      const boundedY = Math.max(0, Math.min(y, parentRect.height / zoom - cardRef.current.offsetHeight));

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
  };

  // Connect handle: start connection from this card only via handle
  const handleStartConnect = (e: React.MouseEvent) => {
    if (onStartConnect) {
      onStartConnect(stakeholder.id);
      e.stopPropagation();
      e.preventDefault();
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (connectingFromId && onCompleteConnect) {
      onCompleteConnect(stakeholder.id);
      e.stopPropagation();
    }
  };

  return (
    <div
      ref={cardRef}
      className={`absolute w-56 p-4 rounded-xl shadow-lg cursor-grab group transition-all duration-200 border border-manjaro-border bg-manjaro-light ${isDragging ? 'shadow-2xl scale-105 z-20 cursor-grabbing' : 'z-10'}`}
      style={{ 
        left: `${stakeholder.x_pos}px`, 
        top: `${stakeholder.y_pos}px`,
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      onMouseUp={handleMouseUp}
    >
      {/* Connect handles (top, right, bottom, left) */}
      <button
        className={`absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border border-manjaro-border bg-manjaro-surface text-manjaro-textAlt hover:text-manjaro-text hover:bg-manjaro-border flex items-center justify-center ${isConnecting ? 'ring-2 ring-manjaro-info' : ''}`}
        title="Start connection"
        onMouseDown={handleStartConnect}
        onClick={(e) => e.stopPropagation()}
      >
        <LinkIcon className="w-3 h-3" />
      </button>
      <button
        className={`absolute -right-1 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-manjaro-border bg-manjaro-surface text-manjaro-textAlt hover:text-manjaro-text hover:bg-manjaro-border flex items-center justify-center ${isConnecting ? 'ring-2 ring-manjaro-info' : ''}`}
        title="Start connection"
        onMouseDown={handleStartConnect}
        onClick={(e) => e.stopPropagation()}
      >
        <LinkIcon className="w-3 h-3" />
      </button>
      <button
        className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border border-manjaro-border bg-manjaro-surface text-manjaro-textAlt hover:text-manjaro-text hover:bg-manjaro-border flex items-center justify-center ${isConnecting ? 'ring-2 ring-manjaro-info' : ''}`}
        title="Start connection"
        onMouseDown={handleStartConnect}
        onClick={(e) => e.stopPropagation()}
      >
        <LinkIcon className="w-3 h-3" />
      </button>
      <button
        className={`absolute -left-1 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-manjaro-border bg-manjaro-surface text-manjaro-textAlt hover:text-manjaro-text hover:bg-manjaro-border flex items-center justify-center ${isConnecting ? 'ring-2 ring-manjaro-info' : ''}`}
        title="Start connection"
        onMouseDown={handleStartConnect}
        onClick={(e) => e.stopPropagation()}
      >
        <LinkIcon className="w-3 h-3" />
      </button>
      <div className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-lg ${ROLE_COLORS[stakeholder.role]}`}></div>
      <div className="mt-2">
        <p className="font-bold text-manjaro-text truncate">{stakeholder.name}</p>
        <p className="text-sm text-manjaro-textAlt truncate">{stakeholder.title}</p>
        <div className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full mt-2 text-manjaro-bg ${ROLE_COLORS[stakeholder.role]}`}>
          {stakeholder.role}
        </div>
        {stakeholder.linkedin_url && (
          <div className="mt-2">
            <a
              href={stakeholder.linkedin_url}
              target="_blank"
              rel="noreferrer"
              title="Open LinkedIn profile"
              className="inline-flex items-center gap-1 text-xs text-manjaro-info hover:underline"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <ExternalLinkIcon className="w-3.5 h-3.5" /> LinkedIn
            </a>
          </div>
        )}
      </div>

      <div className="absolute bottom-full mb-2 w-64 p-3 bg-manjaro-bg border border-manjaro-border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-30 transform -translate-x-1/4 left-1/2">
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
        {!stakeholder.responsibilities && !stakeholder.notes && (
          <p className="text-xs text-manjaro-textAlt opacity-75 italic">No additional details.</p>
        )}
        <div className="absolute bottom-[-5px] left-1/4 w-3 h-3 bg-manjaro-bg border-r border-b border-manjaro-border transform rotate-45"></div>
      </div>
    </div>
  );
};
