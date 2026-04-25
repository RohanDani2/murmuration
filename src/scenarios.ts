import { MarkerType, type Edge } from '@xyflow/react';

// ─── Shared Types ─────────────────────────────────────────────────────────────

export type NodeStatus = 'idle' | 'warning' | 'overload' | 'active' | 'stable' | 'offline';
export type LogLevel = 'info' | 'warning' | 'critical' | 'success';

export interface GridNodeData extends Record<string, unknown> {
  label: string;
  nodeType: string;
  status: NodeStatus;
  load: number;
}

export interface Metrics {
  overloadAvoided: number;    // MW
  reserveDispatched: number;  // MW
  criticalLoadProtected: number; // homes
  recoveryPct?: number;       // % restored (outage scenario)
}

export interface LogMessage {
  message: string;
  level: LogLevel;
}

export interface ScenarioPhase {
  delayMs: number;
  logs: LogMessage[];
  nodeUpdates: { id: string; patch: Partial<GridNodeData> }[];
  edgeUpdates: { id: string; patch: Partial<Edge> }[];
  metricsUpdate: Partial<Metrics>;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  badgeColor: string;
  badgeBg: string;
  phases: ScenarioPhase[];
  phaseLabels: string[];
}

// ─── Shared edge helper ───────────────────────────────────────────────────────

function activeEdge(id: string, label: string, color: string, bgColor: string): { id: string; patch: Partial<Edge> } {
  return {
    id,
    patch: {
      animated: true,
      label,
      style: { stroke: color, strokeWidth: 3 },
      markerEnd: { type: MarkerType.ArrowClosed, color },
      labelStyle: { fill: color, fontSize: 11, fontWeight: 700 },
      labelBgStyle: { fill: bgColor, fillOpacity: 0.95 },
    },
  };
}

// ─── Scenario 1: Normal Operations ───────────────────────────────────────────

const normalScenario: Scenario = {
  id: 'normal',
  name: 'Normal Operations',
  description: 'Baseline grid status. All regions operating within capacity.',
  badgeColor: '#22c55e',
  badgeBg: '#052e16',
  phases: [
    {
      delayMs: 0,
      logs: [
        { message: 'All grid regions operating within normal parameters.', level: 'info' },
        { message: 'Virginia: 62% load — nominal.', level: 'info' },
        { message: 'Texas: 74% load — nominal.', level: 'info' },
        { message: 'Household Reserve Pool: on standby.', level: 'info' },
      ],
      nodeUpdates: [
        { id: 'virginia', patch: { status: 'idle', load: 62 } },
        { id: 'texas',    patch: { status: 'idle', load: 74 } },
        { id: 'reserve',  patch: { status: 'idle', load: 0 } },
      ],
      edgeUpdates: [],
      metricsUpdate: {},
    },
    {
      delayMs: 2000,
      logs: [
        { message: 'Routine load-balancing check complete. No action required.', level: 'success' },
        { message: 'Grid health: NOMINAL. Reserve capacity available if needed.', level: 'success' },
      ],
      nodeUpdates: [
        { id: 'virginia', patch: { status: 'stable', load: 61 } },
        { id: 'texas',    patch: { status: 'stable', load: 73 } },
      ],
      edgeUpdates: [],
      metricsUpdate: { criticalLoadProtected: 1200000 },
    },
  ],
  phaseLabels: ['System Ready', 'Baseline Check', 'All Systems Normal'],
};

// ─── Scenario 2: Texas Demand Spike ──────────────────────────────────────────

const texasSpikeScenario: Scenario = {
  id: 'texas-spike',
  name: 'Texas Demand Spike',
  description: 'Summer heat wave causes a sudden demand surge in Texas. Virginia transfers power; reserve pool dispatched.',
  badgeColor: '#f59e0b',
  badgeBg: '#2d1a00',
  phases: [
    {
      delayMs: 0,
      logs: [
        { message: '⚡ ALERT: Sudden demand spike detected in Texas grid region!', level: 'critical' },
        { message: 'Texas load climbing rapidly — now at 97% capacity.', level: 'warning' },
        { message: 'Risk of rolling blackout if load is not shed within 4 minutes.', level: 'warning' },
      ],
      nodeUpdates: [
        { id: 'texas', patch: { status: 'overload', load: 97 } },
      ],
      edgeUpdates: [],
      metricsUpdate: {},
    },
    {
      delayMs: 1600,
      logs: [
        { message: 'Initiating emergency transfer: Virginia → Texas', level: 'info' },
        { message: 'Virginia diverting 850 MW through eastern corridor.', level: 'info' },
        { message: 'Texas load partially relieved — now at 88%.', level: 'warning' },
      ],
      nodeUpdates: [
        { id: 'virginia', patch: { status: 'active', load: 81 } },
        { id: 'texas',    patch: { status: 'warning', load: 88 } },
      ],
      edgeUpdates: [
        activeEdge('va-tx', '850 MW', '#22c55e', '#052e16'),
      ],
      metricsUpdate: { overloadAvoided: 850 },
    },
    {
      delayMs: 3600,
      logs: [
        { message: 'Texas still critical at 88%. Activating Household Reserve Pool.', level: 'warning' },
        { message: 'Dispatching 320 MW from distributed household battery storage.', level: 'info' },
        { message: 'Reserve Pool now supplying 320 MW to Texas grid.', level: 'info' },
      ],
      nodeUpdates: [
        { id: 'reserve', patch: { status: 'active', load: 67 } },
        { id: 'texas',   patch: { status: 'warning', load: 76 } },
      ],
      edgeUpdates: [
        activeEdge('res-tx', '320 MW', '#a855f7', '#1a0533'),
      ],
      metricsUpdate: { reserveDispatched: 320 },
    },
    {
      delayMs: 5800,
      logs: [
        { message: '✅ Texas grid stabilising — load reduced to 74%.', level: 'success' },
        { message: 'All critical residential and emergency loads protected.', level: 'success' },
        { message: 'Grid stress event resolved. Continuing real-time monitoring.', level: 'info' },
      ],
      nodeUpdates: [
        { id: 'texas', patch: { status: 'stable', load: 74 } },
      ],
      edgeUpdates: [],
      metricsUpdate: { criticalLoadProtected: 1200000 },
    },
  ],
  phaseLabels: [
    'System Ready',
    'Demand Spike Detected',
    'Virginia Transfer Active',
    'Reserve Pool Dispatched',
    'Grid Stabilised',
  ],
};

// ─── Scenario 3: Outage Emergency ─────────────────────────────────────────────

const outageEmergencyScenario: Scenario = {
  id: 'outage-emergency',
  name: 'Outage Emergency',
  description: 'Major transmission line failure in Texas. Cascading fault triggers blackout risk across the region.',
  badgeColor: '#ef4444',
  badgeBg: '#3b0a0a',
  phases: [
    {
      delayMs: 0,
      logs: [
        { message: '🚨 CRITICAL: Transmission line failure in Texas southern corridor!', level: 'critical' },
        { message: 'Texas region entering controlled blackout — load shed to 0%.', level: 'critical' },
        { message: 'Estimated 1.2M customers affected. Emergency protocols initiated.', level: 'critical' },
      ],
      nodeUpdates: [
        { id: 'texas', patch: { status: 'offline', load: 0 } },
      ],
      edgeUpdates: [],
      metricsUpdate: {},
    },
    {
      delayMs: 1800,
      logs: [
        { message: 'Virginia absorbing rerouted demand from Texas corridor.', level: 'warning' },
        { message: 'Virginia load surging to 93% — approaching capacity limits.', level: 'critical' },
        { message: 'Requesting emergency dispatch from Household Reserve Pool.', level: 'info' },
      ],
      nodeUpdates: [
        { id: 'virginia', patch: { status: 'overload', load: 93 } },
      ],
      edgeUpdates: [
        activeEdge('va-tx', 'Emergency', '#ef4444', '#3b0a0a'),
      ],
      metricsUpdate: {},
    },
    {
      delayMs: 3500,
      logs: [
        { message: 'Household Reserve Pool emergency activation — all units online.', level: 'info' },
        { message: 'Dispatching 480 MW of reserve to stabilise Virginia and protect Texas critical loads.', level: 'info' },
        { message: 'Hospitals, emergency services, water treatment prioritised.', level: 'warning' },
      ],
      nodeUpdates: [
        { id: 'reserve',  patch: { status: 'active', load: 95 } },
        { id: 'virginia', patch: { status: 'warning', load: 79 } },
      ],
      edgeUpdates: [
        activeEdge('va-tx',  'Rerouting', '#f59e0b', '#2d1a00'),
        activeEdge('res-tx', '480 MW',    '#a855f7', '#1a0533'),
      ],
      metricsUpdate: { reserveDispatched: 480 },
    },
    {
      delayMs: 5500,
      logs: [
        { message: 'Partial Texas restoration underway — critical infrastructure first.', level: 'info' },
        { message: 'Texas back at 38% load — essential services restored.', level: 'warning' },
        { message: 'Full grid restoration estimated in 2–4 hours. Monitoring continues.', level: 'info' },
      ],
      nodeUpdates: [
        { id: 'texas',    patch: { status: 'warning', load: 38 } },
        { id: 'virginia', patch: { status: 'active',  load: 72 } },
      ],
      edgeUpdates: [],
      metricsUpdate: { overloadAvoided: 1170, recoveryPct: 38 },
    },
    {
      delayMs: 8000,
      logs: [
        { message: '✅ Virginia stabilised at 68%. Reserve pool ramping down.', level: 'success' },
        { message: 'Texas recovery at 62% — residential zones coming back online.', level: 'success' },
        { message: 'Critical load protection maintained throughout event.', level: 'success' },
        { message: 'Event contained. Post-incident review scheduled.', level: 'info' },
      ],
      nodeUpdates: [
        { id: 'texas',    patch: { status: 'stable',  load: 62 } },
        { id: 'virginia', patch: { status: 'stable',  load: 68 } },
        { id: 'reserve',  patch: { status: 'active',  load: 40 } },
      ],
      edgeUpdates: [],
      metricsUpdate: { criticalLoadProtected: 980000, recoveryPct: 62 },
    },
  ],
  phaseLabels: [
    'System Ready',
    'Blackout Detected',
    'Virginia Overloading',
    'Reserve Emergency Dispatch',
    'Partial Restoration',
    'Stabilising',
  ],
};

// ─── Export ───────────────────────────────────────────────────────────────────

export const SCENARIOS: Scenario[] = [
  normalScenario,
  texasSpikeScenario,
  outageEmergencyScenario,
];

export const SCENARIO_MAP: Record<string, Scenario> = Object.fromEntries(
  SCENARIOS.map(s => [s.id, s])
);
