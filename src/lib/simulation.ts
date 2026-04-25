import type { GridEdge, GridNode, Metrics, Scenario } from '../types';

export const initialNodes: GridNode[] = [
  { id: 'virginia', label: 'Virginia', nodeType: 'Grid Region', status: 'idle', load: 62 },
  { id: 'texas', label: 'Texas', nodeType: 'Grid Region', status: 'idle', load: 74 },
  { id: 'reserve', label: 'Distributed Reserves', nodeType: 'Household + Enterprise Storage', status: 'idle', load: 0 },
  { id: 'critical', label: 'Critical Services', nodeType: 'Hospitals, Water, Emergency', status: 'stable', load: 100 },
];

export const initialEdges: GridEdge[] = [
  { id: 'va-tx', from: 'virginia', to: 'texas', label: 'Standby transfer', status: 'standby' },
  { id: 'reserve-tx', from: 'reserve', to: 'texas', label: 'Reserve standby', status: 'standby' },
  { id: 'tx-critical', from: 'texas', to: 'critical', label: 'Protected load', status: 'standby' },
];

export const initialMetrics: Metrics = {
  overloadAvoided: 0,
  reserveDispatched: 0,
  criticalLoadProtected: 0,
};

export const texasStressScenario: Scenario = {
  id: 'texas-stress',
  name: 'Texas Grid Stress',
  description: 'Texas demand spikes; Virginia transfers surplus and distributed reserves dispatch.',
  phases: [
    {
      delayMs: 0,
      label: 'Stress Detected',
      headline: 'Texas needs help: forecasted load is now in emergency range.',
      subhead: 'Murmuration elevates Texas as the priority while keeping critical services visible.',
      story: 'need',
      decision: [
        'Prioritize Texas before residential interruptions expand.',
        'Keep hospitals, water, and emergency services marked as protected.',
      ],
      logs: [
        { level: 'critical', message: 'Demand spike detected in Texas. Load is approaching emergency range.' },
        { level: 'warning', message: 'Murmuration flags risk to protected critical services.' },
      ],
      nodes: {
        texas: { status: 'overload', load: 97 },
        critical: { status: 'warning', load: 100 },
      },
      edges: {},
      metrics: {},
    },
    {
      delayMs: 1200,
      label: 'Virginia Transfer',
      headline: 'Best near-term source found: Virginia can safely transfer surplus.',
      subhead: 'The system chooses the lowest-risk available route first, before draining reserves.',
      story: 'source',
      decision: [
        'Use 850 MW from Virginia to bring Texas below emergency threshold.',
        'Keep distributed reserves available as the next support layer.',
      ],
      logs: [
        { level: 'info', message: 'Virginia has surplus capacity. Dispatching 850 MW to Texas.' },
        { level: 'success', message: 'Texas load reduced below emergency threshold.' },
      ],
      nodes: {
        virginia: { status: 'active', load: 81 },
        texas: { status: 'warning', load: 88 },
      },
      edges: {
        'va-tx': { label: '850 MW transfer', status: 'active' },
      },
      metrics: { overloadAvoided: 850 },
    },
    {
      delayMs: 2600,
      label: 'Reserves Dispatch',
      headline: 'Second support layer dispatched: distributed reserves finish stabilization.',
      subhead: 'Household and enterprise storage fills the remaining gap without sacrificing protected services.',
      story: 'route',
      decision: [
        'Dispatch 320 MW from distributed reserves.',
        'Route support to Texas while preserving critical service priority.',
      ],
      logs: [
        { level: 'info', message: 'Household and enterprise reserves dispatch 320 MW.' },
        { level: 'success', message: 'Critical services remain protected while Texas stabilizes.' },
      ],
      nodes: {
        reserve: { status: 'active', load: 67 },
        texas: { status: 'stable', load: 74 },
        critical: { status: 'stable', load: 100 },
      },
      edges: {
        'reserve-tx': { label: '320 MW dispatch', status: 'active' },
        'tx-critical': { label: 'Protected', status: 'active' },
      },
      metrics: {
        reserveDispatched: 320,
        criticalLoadProtected: 1200000,
      },
    },
    {
      delayMs: 4200,
      label: 'Stable',
      headline: 'Outcome: Texas is stable and protected services stayed online.',
      subhead: 'The visible story is simple: forecast need, find supply, route power, protect people.',
      story: 'protect',
      decision: [
        'Texas returned to stable load.',
        'Critical load remained protected throughout the event.',
      ],
      logs: [
        { level: 'success', message: 'Grid stress event resolved. Texas is stable and protected loads stayed online.' },
      ],
      nodes: {
        virginia: { status: 'stable', load: 70 },
        reserve: { status: 'active', load: 42 },
      },
      edges: {},
      metrics: {},
    },
  ],
};

export function nowTime() {
  return new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}
