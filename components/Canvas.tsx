import React, { useMemo, useState, useCallback } from 'react';
import type { Stakeholder } from '../types';
import { StakeholderCard } from './StakeholderCard';
import { PlusIcon, MinusIcon } from './icons';

interface CanvasProps {
  stakeholders: Stakeholder[];
  onUpdateStakeholderPosition: (id: string, x: number, y: number) => void;
  onEditStakeholder: (stakeholder: Stakeholder) => void;
  onConnectStakeholders: (aId: string, bId: string) => void;
  activeAccountName: string;
  theme: 'dark' | 'light';
}

export const Canvas: React.FC<CanvasProps> = ({ stakeholders, onUpdateStakeholderPosition, onEditStakeholder, onConnectStakeholders, activeAccountName, theme }) => {
  const [connectingFromId, setConnectingFromId] = useState<string | null>(null);
  const [mouse, setMouse] = useState<{x: number, y: number}>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<{x: number, y: number}>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = React.useRef<{mx: number, my: number, px: number, py: number} | null>(null);
  const lineColor = theme === 'dark' ? '#ffffff' : '#000000';
  const gridStyle = useMemo(() => {
    const cell = 20 * zoom;
    const norm = (v: number) => ((v % cell) + cell) % cell; // ensure positive
    const posX = norm(-pan.x);
    const posY = norm(-pan.y);
    return { backgroundSize: `${cell}px ${cell}px`, backgroundPosition: `${posX - 1}px ${posY - 1}px` } as React.CSSProperties;
  }, [zoom, pan.x, pan.y]);

  const lines = useMemo(() => {
    const byId = new Map(stakeholders.map(s => [s.id, s] as const));
    const seen = new Set<string>();
    const result: { x1: number; y1: number; x2: number; y2: number; key: string }[] = [];
    for (const s of stakeholders) {
      const conns = s.connections || [];
      for (const targetId of conns) {
        const t = byId.get(targetId);
        if (!t) continue;
        const pairKey = [s.id, t.id].sort().join('::');
        if (seen.has(pairKey)) continue;
        seen.add(pairKey);
        // approximate center positions (card width 224px, attach 24px from top)
        const x1 = s.x_pos + 224 / 2;
        const y1 = s.y_pos + 24;
        const x2 = t.x_pos + 224 / 2;
        const y2 = t.y_pos + 24;
        result.push({ x1, y1, x2, y2, key: pairKey });
      }
    }
    return result;
  }, [stakeholders]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    if (isPanning && panStartRef.current) {
      const dx = e.clientX - panStartRef.current.mx;
      const dy = e.clientY - panStartRef.current.my;
      setPan({ x: panStartRef.current.px + dx, y: panStartRef.current.py + dy });
    }
    if (connectingFromId) {
      setMouse({ x: (e.clientX - rect.left) / zoom, y: (e.clientY - rect.top) / zoom });
    }
  }, [connectingFromId, zoom, isPanning]);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (connectingFromId) return; // don't pan while connecting
    if (e.button !== 0) return; // left click only
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    panStartRef.current = { mx: e.clientX, my: e.clientY, px: pan.x, py: pan.y };
    setIsPanning(true);
    e.preventDefault();
    // set mouse for potential connection preview baseline
    setMouse({ x: (e.clientX - rect.left) / zoom, y: (e.clientY - rect.top) / zoom });
  }, [connectingFromId, pan.x, pan.y, zoom]);

  const handleCanvasMouseUp = useCallback(() => {
    setIsPanning(false);
    panStartRef.current = null;
  }, []);

  const cancelConnect = useCallback(() => setConnectingFromId(null), []);

  const startConnectFrom = useCallback((id: string) => {
    setConnectingFromId(id);
  }, []);

  const completeConnectTo = useCallback((targetId: string) => {
    if (connectingFromId && targetId !== connectingFromId) {
      onConnectStakeholders(connectingFromId, targetId);
    }
    setConnectingFromId(null);
  }, [connectingFromId, onConnectStakeholders]);

  return (
    <div
      className={`w-full h-full relative overflow-hidden bg-grid ${connectingFromId ? 'cursor-crosshair' : isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={gridStyle}
      onMouseMove={handleCanvasMouseMove}
      onMouseDown={handleCanvasMouseDown}
      onMouseUp={handleCanvasMouseUp}
      onMouseLeave={handleCanvasMouseUp}
      onClick={() => { if (connectingFromId) cancelConnect(); }}
    >
      {/* Static Account name card */}
      {activeAccountName && (
        <div className="absolute top-3 left-3 inline-block px-3 py-2 rounded-lg border border-manjaro-border bg-manjaro-light shadow z-20">
          <p className="font-extrabold uppercase tracking-wide text-manjaro-text">{activeAccountName}</p>
        </div>
      )}
      {/* Zoom controls */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
        <div className="flex rounded-md overflow-hidden border border-manjaro-border bg-manjaro-surface">
          <button className="px-2 py-1 text-manjaro-textAlt hover:text-manjaro-text hover:bg-manjaro-border" onClick={() => setZoom(z => Math.max(0.5, +(z - 0.1).toFixed(2)))} title="Zoom out">
            <MinusIcon className="w-4 h-4" />
          </button>
          <div className="px-2 py-1 text-xs text-manjaro-textAlt select-none w-10 text-center">{Math.round(zoom*100)}%</div>
          <button className="px-2 py-1 text-manjaro-textAlt hover:text-manjaro-text hover:bg-manjaro-border" onClick={() => setZoom(z => Math.min(2, +(z + 0.1).toFixed(2)))} title="Zoom in">
            <PlusIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="absolute inset-0" style={{ transform: `scale(${zoom})`, transformOrigin: '0 0' }}>
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L6,3 z" fill="currentColor" />
          </marker>
        </defs>
        {lines.map(l => (
          <line key={l.key} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={lineColor} strokeOpacity="0.9" strokeWidth="2.5" />
        ))}
        {connectingFromId && (() => {
          const src = stakeholders.find(s => s.id === connectingFromId);
          if (!src) return null;
          const x1 = src.x_pos + 224 / 2;
          const y1 = src.y_pos + 24;
          return <line x1={x1} y1={y1} x2={mouse.x} y2={mouse.y} stroke={lineColor} strokeOpacity="0.8" strokeDasharray="4 4" strokeWidth="2" />
        })()}
      </svg>
      {stakeholders.map(stakeholder => (
        <StakeholderCard
          key={stakeholder.id}
          stakeholder={stakeholder}
          onMove={onUpdateStakeholderPosition}
          onEdit={onEditStakeholder}
          isConnecting={!!connectingFromId}
          connectingFromId={connectingFromId}
          onStartConnect={startConnectFrom}
          onCompleteConnect={completeConnectTo}
          zoom={zoom}
        />
      ))}
      </div>
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
