import React from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
} from 'react-flow-renderer';
import { useFlow } from '../context/FlowContext';

const FlowEditor: React.FC = () => {
  const { nodes, connections } = useFlow();

  const flowNodes: Node[] = nodes.map((node) => ({
    id: node.id,
    type: 'default',
    data: { label: node.name },
    position: node.position,
  }));

  const edges: Edge[] = connections.map((conn) => ({
    id: conn.id,
    source: conn.source,
    target: conn.target,
    label: conn.label,
  }));

  return (
    <div className="h-[600px] bg-white rounded-lg shadow">
      <ReactFlow
        nodes={flowNodes}
        edges={edges}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default FlowEditor;