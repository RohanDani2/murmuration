import { useCallback, useState, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './App.css';
import {
  SCENARIOS,
  type GridNodeData,
  type Metrics,
  type LogLevel,
  type Scenario,
} from './scenarios';

// ─── Types ────────────────────────────────────────────────────────────────────

interface LogEntry {
  id: number;
  ts: string;
  message: string;
  level: LogLevel;
}

// ─── Visual Mappings ──────────────────────────────────────────────────────────

const STATUS_STYLE: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  idle:    { bg: '#0f2040', border: '#3b82f6', text: '#93c5fd', badge: '#1d4ed8' },
  warning: { bg: '#2d1a00', border: '#f59e0b', text: '#fcd34d', badge: '#92400e' },
  overload:{ bg: '#3b0a0a', border: '#ef4444', text: '#fca5a5', badge: '#991b1b' },
  active:  { bg: '#052e16', border: '#22c55e', text: '#86efac', badge: '#166534' },
  stable:  { bg: '#082f49', border: '#06b6d4', text: '#67e8f9', badge: '#0e7490' },
  offline: { bg: '#1a1a1a', border: '#6b7280', text: '#9ca3af', badge: '#374151' },
};

const LOG_COLOR: Record<LogLevel, string> = {
  info:    '#3b82f6',
  warning: '#f59e0b',
  critical:'#ef4444',
  success: '#22c55e',
};
const LOG_TEXT: Record<LogLevel, string> = {
  info:    '#94a3b8',
  warning: '#fcd34d',
  critical:'#fca5a5',
  success: '#86efac',
};
const LOG_BG: Record<LogLevel, string> = {
  info:    '#1e293b',
  warning: '#2d1a00',
  critical:'#2d0a0a',
  success: '#052e16',
};

// ─── Grid Node Component ───────────────────────────────────────────────────────

function GridNodeComponent({ data }: { data: GridNodeData }) {
  const s = STATUS_STYLE[data.status] ?? STATUS_STYLE.idle;
  const isOverload = data.status === 'overload';
  const isActive   = data.status === 'active';
  const isOffline  = data.status === 'offline';

  return (
    <div
      className={isOverload ? 'node-overload' : isActive ? 'node-active' : ''}
      style={{
        background:   s.bg,
        border:       `2px solid ${s.border}`,
        borderRadius: '12px',
        padding:      '14px 18px',
        minWidth:     '165px',
        color:        s.text,
        boxShadow:    `0 0 16px ${s.border}33`,
        transition:   'all 0.6s ease',
        opacity:      isOffline ? 0.6 : 1,
        cursor:       'default',
      }}
    >
      <div style={{ fontSize: '10px', opacity: 0.6, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1.2px' }}>
        {data.nodeType}
      </div>
      <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '10px', color: '#f1f5f9' }}>
        {data.label}
      </div>
      <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#64748b' }}>Load</span>
          <span style={{ fontWeight: 600 }}>{isOffline ? 'OFFLINE' : `${data.load}%`}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#64748b' }}>Status</span>
          <span style={{
            background: s.badge, color: s.text,
            padding: '1px 7px', borderRadius: '10px',
            fontSize: '10px', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.5px',
          }}>
            {data.status}
          </span>
        </div>
        <div style={{ marginTop: '6px', background: '#1e293b', borderRadius: '4px', height: '5px', overflow: 'hidden' }}>
          <div style={{
            width: `${data.load}%`,
            height: '100%',
            background: data.load > 90 ? '#ef4444' : data.load > 75 ? '#f59e0b' : s.border,
            borderRadius: '4px',
            transition: 'width 0.8s ease, background 0.5s ease',
          }} />
        </div>
      </div>
    </div>
  );
}

const nodeTypes = { gridNode: GridNodeComponent };

// ─── Initial Graph Data ────────────────────────────────────────────────────────

const INIT_NODES: Node<GridNodeData>[] = [
  {
    id: 'virginia',
    type: 'gridNode',
    position: { x: 60, y: 160 },
    data: { label: 'Virginia', nodeType: 'Grid Region', status: 'idle', load: 62 },
  },
  {
    id: 'texas',
    type: 'gridNode',
    position: { x: 390, y: 160 },
    data: { label: 'Texas', nodeType: 'Grid Region', status: 'idle', load: 74 },
  },
  {
    id: 'reserve',
    type: 'gridNode',
    position: { x: 225, y: 370 },
    data: { label: 'Household Reserve Pool', nodeType: 'Reserve Storage', status: 'idle', load: 0 },
  },
];

import { MarkerType } from '@xyflow/react';

const STANDBY_EDGE_STYLE = {
  animated: false,
  style: { stroke: '#334155', strokeWidth: 2 },
  markerEnd: { type: MarkerType.ArrowClosed, color: '#334155' },
  labelStyle: { fill: '#64748b', fontSize: 11 },
  labelBgStyle: { fill: '#0f172a', fillOpacity: 0.9 },
  labelBgPadding: [4, 6] as [number, number],
};

const INIT_EDGES: Edge[] = [
  { id: 'va-tx',  source: 'virginia', target: 'texas',   label: 'Standby', ...STANDBY_EDGE_STYLE },
  { id: 'res-tx', source: 'reserve',  target: 'texas',   label: 'Standby', ...STANDBY_EDGE_STYLE },
];

const INIT_METRICS: Metrics = {
  overloadAvoided: 0,
  reserveDispatched: 0,
  criticalLoadProtected: 0,
};

function nowTime() {
  return new Date().toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetricCard({ label, value, color, active }: {
  label: string; value: string; color: string; active: boolean;
}) {
  return (
    <div style={{
      padding: '11px 14px', borderRadius: '8px',
      background: active ? `${color}18` : '#1e293b',
      border: `1px solid ${active ? color : '#334155'}`,
      transition: 'all 0.6s ease',
    }}>
      <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '1px' }}>
        {label}
      </div>
      <div style={{ fontSize: '21px', fontWeight: 700, color: active ? color : '#475569', transition: 'color 0.6s ease' }}>
        {value}
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: '10px', color: '#475569', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
      {children}
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<GridNodeData>>(INIT_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(INIT_EDGES);
  const [metrics, setMetrics] = useState<Metrics>(INIT_METRICS);
  const [log, setLog] = useState<LogEntry[]>([
    { id: 1, ts: nowTime(), message: 'System online — all nodes operating normally.', level: 'info' },
  ]);
  const [activeScenario, setActiveScenario] = useState<Scenario>(SCENARIOS[1]); // default: Texas spike
  const [phase, setPhase] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);
  const timeoutIds = useRef<ReturnType<typeof setTimeout>[]>([]);

  function addLogs(msgs: { message: string; level: LogLevel }[]) {
    setLog(prev => [
      ...prev,
      ...msgs.map(m => ({ id: Date.now() + Math.random(), ts: nowTime(), message: m.message, level: m.level })),
    ]);
    setTimeout(() => logEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  }

  function applyPhase(scenario: Scenario, phaseIdx: number) {
    const p = scenario.phases[phaseIdx];
    if (!p) return;

    setPhase(phaseIdx + 1);
    addLogs(p.logs);

    if (p.nodeUpdates.length > 0) {
      setNodes(ns =>
        ns.map(n => {
          const u = p.nodeUpdates.find(u => u.id === n.id);
          return u ? { ...n, data: { ...n.data, ...u.patch } } : n;
        })
      );
    }

    if (p.edgeUpdates.length > 0) {
      setEdges(es =>
        es.map(e => {
          const u = p.edgeUpdates.find(u => u.id === e.id);
          return u ? { ...e, ...u.patch } : e;
        })
      );
    }

    if (Object.keys(p.metricsUpdate).length > 0) {
      setMetrics(m => ({ ...m, ...p.metricsUpdate }));
    }
  }

  const triggerScenario = useCallback(() => {
    if (running) return;
    setRunning(true);
    setDone(false);

    const s = activeScenario;

    s.phases.forEach((phase, idx) => {
      const id = setTimeout(() => {
        applyPhase(s, idx);
        if (idx === s.phases.length - 1) {
          setRunning(false);
          setDone(true);
        }
      }, phase.delayMs);
      timeoutIds.current.push(id);
    });
  }, [running, activeScenario]); // eslint-disable-line react-hooks/exhaustive-deps

  const reset = useCallback(() => {
    timeoutIds.current.forEach(clearTimeout);
    timeoutIds.current = [];
    setRunning(false);
    setDone(false);
    setPhase(0);
    setNodes(INIT_NODES);
    setEdges(INIT_EDGES);
    setMetrics(INIT_METRICS);
    setLog([{ id: Date.now(), ts: nowTime(), message: 'System reset — all nodes operating normally.', level: 'info' }]);
  }, [setNodes, setEdges]);

  function selectScenario(s: Scenario) {
    if (running) return;
    reset();
    setActiveScenario(s);
  }

  const totalPhases = activeScenario.phases.length;
  const phaseLabel  = activeScenario.phaseLabels[phase] ?? activeScenario.phaseLabels[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0f172a', color: '#e2e8f0' }}>

      {/* ── Header ── */}
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '11px 20px', borderBottom: '1px solid #1e293b', flexShrink: 0,
        gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <span style={{ fontSize: '18px' }}>🌐</span>
          <span style={{ fontSize: '17px', fontWeight: 700, color: '#f1f5f9' }}>MURMURATION</span>
          <span style={{ fontSize: '11px', color: '#475569', borderLeft: '1px solid #334155', paddingLeft: '10px' }}>
            Distributed Grid Intelligence
          </span>
        </div>

        {/* Scenario selector */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {SCENARIOS.map(s => (
            <button
              key={s.id}
              onClick={() => selectScenario(s)}
              disabled={running}
              title={s.description}
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: running ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                border: `1px solid ${activeScenario.id === s.id ? s.badgeColor : '#334155'}`,
                background: activeScenario.id === s.id ? s.badgeBg : '#1e293b',
                color: activeScenario.id === s.id ? s.badgeColor : '#64748b',
              }}
            >
              {s.name}
            </button>
          ))}
        </div>

        {/* Phase badge */}
        <div style={{
          padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
          background: done ? '#052e16' : running ? activeScenario.badgeBg : '#0f2040',
          color: done ? '#22c55e' : running ? activeScenario.badgeColor : '#3b82f6',
          border: `1px solid ${done ? '#22c55e' : running ? activeScenario.badgeColor : '#1d4ed8'}`,
          textTransform: 'uppercase', letterSpacing: '0.5px', flexShrink: 0,
          whiteSpace: 'nowrap',
        }}>
          {phaseLabel}
        </div>
      </header>

      {/* ── Body ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── Graph + Controls ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Scenario description */}
          <div style={{
            padding: '8px 20px',
            background: '#0d1b2e',
            borderBottom: '1px solid #1e293b',
            fontSize: '12px',
            color: '#64748b',
            flexShrink: 0,
          }}>
            <span style={{ color: activeScenario.badgeColor, fontWeight: 600 }}>{activeScenario.name}: </span>
            {activeScenario.description}
          </div>

          {/* Graph */}
          <div style={{ flex: 1, position: 'relative' }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.35 }}
              minZoom={0.4}
              maxZoom={2.5}
              style={{ background: '#0f172a' }}
            >
              <Background color="#1e293b" gap={24} size={1} />
              <Controls />
            </ReactFlow>
          </div>

          {/* Control bar */}
          <div style={{
            padding: '12px 20px', borderTop: '1px solid #1e293b',
            display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0,
          }}>
            <button
              onClick={triggerScenario}
              disabled={running || done}
              style={{
                padding: '10px 22px',
                background: (running || done)
                  ? '#374151'
                  : `linear-gradient(135deg, ${activeScenario.badgeColor}cc, ${activeScenario.badgeColor})`,
                color: (running || done) ? '#6b7280' : '#fff',
                border: 'none', borderRadius: '8px',
                fontSize: '14px', fontWeight: 700,
                cursor: (running || done) ? 'not-allowed' : 'pointer',
                boxShadow: (running || done) ? 'none' : `0 0 24px ${activeScenario.badgeColor}55`,
                transition: 'all 0.3s ease',
                letterSpacing: '0.2px',
              }}
            >
              ⚡ Trigger Grid Stress Event
            </button>

            {(running || done) && (
              <button
                onClick={reset}
                style={{
                  padding: '10px 18px',
                  background: '#0f2040', color: '#93c5fd',
                  border: '1px solid #3b82f6', borderRadius: '8px',
                  fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                ↺ Reset
              </button>
            )}

            {/* Progress pips */}
            {running && (
              <div style={{ display: 'flex', gap: '5px', marginLeft: '4px' }}>
                {Array.from({ length: totalPhases }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: i < phase ? activeScenario.badgeColor : '#334155',
                      transition: 'background 0.4s',
                    }}
                  />
                ))}
              </div>
            )}

            <span style={{ fontSize: '12px', color: '#475569', marginLeft: 'auto' }}>
              {running
                ? `Phase ${phase}/${totalPhases} — running…`
                : done
                ? 'Scenario complete — reset to run again'
                : 'Select a scenario and trigger the event'}
            </span>
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div style={{
          width: '310px', flexShrink: 0,
          borderLeft: '1px solid #1e293b',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}>

          {/* Metrics */}
          <section style={{ padding: '14px 16px', borderBottom: '1px solid #1e293b', flexShrink: 0 }}>
            <SectionLabel>Grid Metrics</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <MetricCard
                label="Overload Avoided"
                value={metrics.overloadAvoided > 0 ? `${metrics.overloadAvoided.toLocaleString()} MW` : '—'}
                color="#22c55e"
                active={metrics.overloadAvoided > 0}
              />
              <MetricCard
                label="Reserve Dispatched"
                value={metrics.reserveDispatched > 0 ? `${metrics.reserveDispatched.toLocaleString()} MW` : '—'}
                color="#a855f7"
                active={metrics.reserveDispatched > 0}
              />
              <MetricCard
                label="Critical Load Protected"
                value={metrics.criticalLoadProtected > 0
                  ? `${(metrics.criticalLoadProtected / 1000).toFixed(0)}K homes`
                  : '—'}
                color="#06b6d4"
                active={metrics.criticalLoadProtected > 0}
              />
              {metrics.recoveryPct !== undefined && metrics.recoveryPct > 0 && (
                <MetricCard
                  label="Grid Recovery"
                  value={`${metrics.recoveryPct}%`}
                  color="#f59e0b"
                  active={true}
                />
              )}
            </div>
          </section>

          {/* Event Log */}
          <section style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '14px 16px' }}>
            <SectionLabel>Event Log</SectionLabel>
            <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {log.map(entry => (
                <div
                  key={entry.id}
                  style={{
                    padding: '7px 10px', borderRadius: '6px',
                    background: LOG_BG[entry.level],
                    borderLeft: `3px solid ${LOG_COLOR[entry.level]}`,
                    fontSize: '12px', lineHeight: '1.45',
                  }}
                >
                  <span style={{ color: '#475569', marginRight: '7px', fontFamily: 'monospace', fontSize: '11px' }}>
                    {entry.ts}
                  </span>
                  <span style={{ color: LOG_TEXT[entry.level] }}>{entry.message}</span>
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
