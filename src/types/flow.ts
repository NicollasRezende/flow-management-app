export interface FlowNode {
  id: string;
  type: 'step' | 'action' | 'condition';
  name: string;
  description?: string;
  actions?: string[];
  nextSteps?: string[];
  position: {
    x: number;
    y: number;
  };
}

export interface FlowConnection {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface FlowData {
  nodes: FlowNode[];
  connections: FlowConnection[];
}