
import { useCallback, useMemo } from 'react';
import { Node, Edge, OnNodesChange, OnEdgesChange, applyNodeChanges, applyEdgeChanges, Connection as RFConnection } from 'reactflow';
import type { Stakeholder, Connection } from '../types';

export function useFlowState(
  stakeholders: Stakeholder[],
  connections: Connection[],
  onUpdateStakeholderPosition: (id: string, x: number, y: number) => void,
  onAddConnection: (sourceId: string, targetId: string) => void,
  onDeleteConnection: (id: string) => void
) {
  const nodes: Node<Stakeholder>[] = useMemo(() => {
    return stakeholders.map(s => ({
      id: s.id,
      type: 'stakeholder',
      position: { x: s.x_pos, y: s.y_pos },
      data: s,
    }));
  }, [stakeholders]);

  const edges: Edge[] = useMemo(() => {
    return connections.map(c => ({
      id: c.id,
      source: c.sourceId,
      target: c.targetId,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#34BE5B', strokeWidth: 2 },
      labelStyle: { fill: '#E8EDED', fontSize: 12 },
    }));
  }, [connections]);

  const onNodesChange: OnNodesChange = useCallback((changes) => {
    changes.forEach(change => {
      if (change.type === 'position' && change.position && !change.dragging) {
        onUpdateStakeholderPosition(change.id, change.position.x, change.position.y);
      }
    });
  }, [onUpdateStakeholderPosition]);

  const onEdgesChange: OnEdgesChange = useCallback((changes) => {
    changes.forEach(change => {
      if (change.type === 'remove') {
        onDeleteConnection(change.id);
      }
    });
  }, [onDeleteConnection]);

  const onConnect = useCallback((connection: RFConnection) => {
    if (connection.source && connection.target) {
      onAddConnection(connection.source, connection.target);
    }
  }, [onAddConnection]);

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
  };
}
