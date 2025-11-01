
import React, { useState, useRef, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import type { Stakeholder, Connection } from '../types';
import { StakeholderCard } from './StakeholderCard';
import { ConnectionLine, TempConnectionLine } from './ConnectionLine';
import { ZoomControls } from './ZoomControls';

interface CanvasProps {
  stakeholders: Stakeholder[];
  connections: Connection[];
  onUpdateStakeholderPosition: (id: string, x: number, y: number) => void;
  onEditStakeholder: (stakeholder: Stakeholder) => void;
  onAddConnection: (sourceId: string, targetId: string) => void;
  onDeleteConnection: (id: string) => void;
}

interface ConnectionState {
  isConnecting: boolean;
  sourceId: string | null;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

export const Canvas: React.FC<CanvasProps> = ({ 
  stakeholders, 
  connections,
  onUpdateStakeholderPosition, 
  onEditStakeholder,
  onAddConnection,
  onDeleteConnection
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    isConnecting: false,
    sourceId: null,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
  });

  const handleConnectionStart = (stakeholderId: string, x: number, y: number) => {
    setConnectionState({
      isConnecting: true,
      sourceId: stakeholderId,
      startX: x,
      startY: y,
      currentX: x,
      currentY: y,
    });
  };

  const handleConnectionEnd = (targetId: string) => {
    if (connectionState.isConnecting && connectionState.sourceId && connectionState.sourceId !== targetId) {
      onAddConnection(connectionState.sourceId, targetId);
    }
    setConnectionState({
      isConnecting: false,
      sourceId: null,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (connectionState.isConnecting && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const scale = parseFloat(canvasRef.current.style.transform?.match(/scale\(([^)]+)\)/)?.[1] || '1');
        setConnectionState(prev => ({
          ...prev,
          currentX: (e.clientX - rect.left) / scale,
          currentY: (e.clientY - rect.top) / scale,
        }));
      }
    };

    const handleMouseUp = () => {
      if (connectionState.isConnecting) {
        setConnectionState({
          isConnecting: false,
          sourceId: null,
          startX: 0,
          startY: 0,
          currentX: 0,
          currentY: 0,
        });
      }
    };

    if (connectionState.isConnecting) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [connectionState.isConnecting]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-manjaro-bg">
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={2}
        wheel={{ step: 0.1 }}
        doubleClick={{ disabled: true }}
        panning={{ disabled: connectionState.isConnecting }}
        limitToBounds={false}
      >
        {() => (
          <>
            <ZoomControls />
            <TransformComponent
              wrapperStyle={{ width: '100%', height: '100%' }}
              contentStyle={{ width: '100%', height: '100%' }}
            >
              <div ref={canvasRef} className="w-full h-full relative bg-grid" style={{ minWidth: '100%', minHeight: '100%' }}>
                {/* SVG Layer for Connections */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                  {connections.map(connection => (
                    <g key={connection.id} className="pointer-events-auto">
                      <ConnectionLine
                        connection={connection}
                        stakeholders={stakeholders}
                        onDelete={onDeleteConnection}
                      />
                    </g>
                  ))}
                  {connectionState.isConnecting && (
                    <TempConnectionLine
                      startX={connectionState.startX}
                      startY={connectionState.startY}
                      endX={connectionState.currentX}
                      endY={connectionState.currentY}
                    />
                  )}
                </svg>

                {/* Stakeholder Cards */}
                {stakeholders.map(stakeholder => (
                  <StakeholderCard
                    key={stakeholder.id}
                    stakeholder={stakeholder}
                    onMove={onUpdateStakeholderPosition}
                    onEdit={onEditStakeholder}
                    onConnectionStart={handleConnectionStart}
                    onConnectionEnd={handleConnectionEnd}
                    isConnecting={connectionState.isConnecting}
                  />
                ))}
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>

      <style>{`
        .bg-grid {
          background-color: #1B1F23;
          background-image:
            linear-gradient(rgba(52, 190, 91, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(52, 190, 91, 0.08) 1px, transparent 1px);
          background-size: 20px 20px;
          background-position: -1px -1px;
        }
        .react-transform-wrapper {
          width: 100%;
          height: 100%;
        }
        .react-transform-component {
          width: 100%;
          height: 100%;
          will-change: transform;
        }
      `}</style>
    </div>
  );
};
