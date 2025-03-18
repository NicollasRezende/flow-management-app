import React, { createContext, useContext, useState } from 'react';
import { FlowNode, FlowConnection } from '../types/flow';

interface FlowContextType {
  nodes: FlowNode[];
  connections: FlowConnection[];
  addNode: (node: FlowNode) => void;
  updateNode: (id: string, node: Partial<FlowNode>) => void;
  removeNode: (id: string) => void;
  addConnection: (connection: FlowConnection) => void;
  removeConnection: (id: string) => void;
}

const FlowContext = createContext<FlowContextType | undefined>(undefined);

export function FlowProvider({ children }: { children: React.ReactNode }) {
  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [connections, setConnections] = useState<FlowConnection[]>([]);

  const addNode = (node: FlowNode) => {
    setNodes((prev) => [...prev, node]);
  };

  const updateNode = (id: string, updates: Partial<FlowNode>) => {
    setNodes((prev) =>
      prev.map((node) => (node.id === id ? { ...node, ...updates } : node))
    );
  };

  const removeNode = (id: string) => {
    setNodes((prev) => prev.filter((node) => node.id !== id));
    setConnections((prev) =>
      prev.filter((conn) => conn.source !== id && conn.target !== id)
    );
  };

  const addConnection = (connection: FlowConnection) => {
    setConnections((prev) => [...prev, connection]);
  };

  const removeConnection = (id: string) => {
    setConnections((prev) => prev.filter((conn) => conn.id !== id));
  };

  return (
    <FlowContext.Provider
      value={{
        nodes,
        connections,
        addNode,
        updateNode,
        removeNode,
        addConnection,
        removeConnection,
      }}
    >
      {children}
    </FlowContext.Provider>
  );
}

export function useFlow() {
  const context = useContext(FlowContext);
  if (context === undefined) {
    throw new Error('useFlow must be used within a FlowProvider');
  }
  return context;
}