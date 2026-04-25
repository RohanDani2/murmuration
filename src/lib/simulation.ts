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
      headline: 'Texas posts a request for fast grid relief.',
      subhead: 'Murmuration turns a grid problem into a market request: who can help, for how long, and at what price?',
      story: 'need',
      decision: [
        'Buyer: Texas load pocket needs 1,170 MW of relief.',
        'Murmuration searches advertised flex offers.',
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
      headline: 'Murmuration accepts the first offer: Virginia surplus.',
      subhead: 'The marketplace match is simple: Texas needs relief, Virginia advertises available capacity, Murmuration routes it.',
      story: 'source',
      decision: [
        '850 MW accepted from Virginia at $280/MWh for 90 minutes.',
        'DER reserves remain available as the next support layer.',
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
      headline: 'Murmuration accepts the second offer: DER reserve pool.',
      subhead: 'The remaining gap is filled by household and enterprise reserves, turning small assets into one useful market participant.',
      story: 'route',
      decision: [
        '320 MW accepted from distributed reserves at $140/MWh for 45 minutes.',
        'Protected load remains online.',
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
      headline: 'Marketplace result: sellers got paid, Texas stabilized, critical load stayed online.',
      subhead: 'Tomorrow this can become a spot-flex marketplace: data centers, homes, and grid regions advertise what they can give or reduce.',
      story: 'protect',
      decision: [
        'Accepted offers supplied 1,170 MW of relief.',
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
