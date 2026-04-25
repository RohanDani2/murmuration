export type NodeStatus = 'idle' | 'warning' | 'overload' | 'active' | 'stable' | 'offline';
export type LogLevel = 'info' | 'warning' | 'critical' | 'success';

export interface GridNode {
  id: 'virginia' | 'texas' | 'reserve' | 'critical';
  label: string;
  nodeType: string;
  status: NodeStatus;
  load: number;
}

export interface GridEdge {
  id: string;
  from: GridNode['id'];
  to: GridNode['id'];
  label: string;
  status: 'standby' | 'active' | 'warning';
}

export interface Metrics {
  overloadAvoided: number;
  reserveDispatched: number;
  criticalLoadProtected: number;
}

export interface LogEntry {
  id: number;
  ts: string;
  message: string;
  level: LogLevel;
}

export interface Phase {
  delayMs: number;
  label: string;
  headline: string;
  subhead: string;
  story: 'need' | 'source' | 'route' | 'protect';
  decision: string[];
  logs: Omit<LogEntry, 'id' | 'ts'>[];
  nodes: Partial<Record<GridNode['id'], Partial<GridNode>>>;
  edges: Partial<Record<GridEdge['id'], Partial<GridEdge>>>;
  metrics: Partial<Metrics>;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  phases: Phase[];
}
