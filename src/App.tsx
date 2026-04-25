import { useCallback, useState, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  MarkerType,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './App.css';

// ─── Types ────────────────────────────────────────────────────────────────────

type NodeStatus = 'idle' | 'warning' | 'overload' | 'active' | 'stable';
type LogLevel = 'info' | 'warning' | 'critical' | 'success';

interface GridNodeData extends Record<string, unknown> {
  label: string;
  nodeType: string;
  status: NodeStatus;
  load: number;
}

interface Metrics {
  overloadAvoided: number;
  reserveDispatched: number;
  criticalLoadProtected: number;
}

interface LogEntry {
  id: number;
  ts: string;
  message: string;
  level: LogLevel;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<NodeStatus, { bg: string; border: string; text: string; badge: string }> = {
  idle:     { bg: '#0f2040', border: '#3b82f6', text: '#93c5fd', badge: '#1d4ed8' },
  warning:  { bg: '#2d1a00', border: '#f59e0b', text: '#fcd34d', badge: '#92400e' },
  overload: { bg: '#3b0a0a', border: '#ef4444', text: '#fca5a5', badge: '#991b1b' },
  active:   { bg: '#052e16', border: '#22c55e', text: '#86efac', badge: '#166534' },
  stable:   { bg: '#082f49', border: '#06b6d4', text: '#67e8f9', badge: '#0e7490' },
};

const LOG_COLOR: Record<LogLevel, string> = {
  info:     '#3b82f6',
  warning:  '#f59e0b',
  critical: '#ef4444',
  success:  '#22c55e',
};

const LOG_TEXT: Record<LogLevel, string> = {
  info:     '#94a3b8',
  warning:  '#fcd34d',
  critical: '#fca5a5',
  success:  '#86efac',
};

const LOG_BG: Record<LogLevel, string> = {
  info:     '#1e293b',
  warning:  '#2d1a00',
  critical: '#2d0a0a',
  success:  '#052e16',
};

// ─── Custom Node Component ─────────────────────────────────────────────────────

function GridNodeComponent({ data }: { data: GridNodeData }) {
  const s = STATUS_STYLE[data.status];
  const isOverload = data.status === 'overload';
  const isActive   = data.status === 'active';

  return (
    <div
      className={isOverload ? 'node-overload' : isActive ? 'node-active' : ''}
      style={{
        background:   s.bg,
        border:       `2px solid ${s.border}`,
        borderRadius: '12px',
        padding:      '14px 18px',
        minWidth:     '160px',
        color:        s.text,
        boxShadow:    `0 0 16px ${s.border}33`,
        transition:   'all 0.6s ease',
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
          <span style={{ fontWeight: 600 }}>{data.load}%</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#64748b' }}>Status</span>
          <span style={{
            background: s.badge,
            color: s.text,
            padding: '1px 7px',
            borderRadius: '10px',
            fontSize: '10px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            {data.status}
          </span>
        </div>
        {/* Load bar */}
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

// ─── Initial Data ──────────────────────────────────────────────────────────────

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
    position: { x: 380, y: 160 },
    data: { label: 'Texas', nodeType: 'Grid Region', status: 'idle', load: 74 },
  },
  {
    id: 'reserve',
    type: 'gridNode',
    position: { x: 220, y: 370 },
    data: { label: 'Household Reserve Pool', nodeType: 'Reserve Storage', status: 'idle', load: 0 },
  },
];

const INIT_EDGES: Edge[] = [
  {
    id: 'va-tx',
    source: 'virginia',
    target: 'texas',
    label: 'Standby',
    animated: false,
    style: { stroke: '#334155', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#334155' },
    labelStyle: { fill: '#64748b', fontSize: 11 },
    labelBgStyle: { fill: '#0f172a', fillOpacity: 0.9 },
    labelBgPadding: [4, 6] as [number, number],
  },
  {
    id: 'res-tx',
    source: 'reserve',
    target: 'texas',
    label: 'Standby',
    animated: false,
    style: { stroke: '#334155', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#334155' },
    labelStyle: { fill: '#64748b', fontSize: 11 },
    labelBgStyle: { fill: '#0f172a', fillOpacity: 0.9 },
    labelBgPadding: [4, 6] as [number, number],
  },
];

const INIT_METRICS: Metrics = { overloadAvoided: 0, reserveDispatched: 0, criticalLoadProtected: 0 };

function nowTime() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}

const PHASE_LABELS = [
  'System Ready',
  'Demand Spike Detected',
  'Virginia Transfer Active',
  'Reserve Pool Dispatched',
  'Grid Stabilized',
];

// ─── Metric Card ───────────────────────────────────────────────────────────────

function MetricCard({ label, value, color, active }: { label: string; value: string; color: string; active: boolean }) {
  return (
    <div style={{
      padding: '12px 14px',
      borderRadius: '8px',
      background: active ? `${color}18` : '#1e293b',
      border: `1px solid ${active ? color : '#334155'}`,
      transition: 'all 0.6s ease',
    }}>
      <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '1px' }}>
        {label}
      </div>
      <div style={{ fontSize: '22px', fontWeight: 700, color: active ? color : '#475569', transition: 'color 0.6s ease' }}>
        {value}
      </div>
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
  const [phase, setPhase] = useState(0);
  const [triggered, setTriggered] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  function addLog(message: string, level: LogLevel) {
    setLog(prev => {
      const next = [...prev, { id: Date.now() + Math.random(), ts: nowTime(), message, level }];
      // auto-scroll handled by scrollIntoView
      return next;
    });
    setTimeout(() => logEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  }

  function updateNode(id: string, patch: Partial<GridNodeData>) {
    setNodes(ns =>
      ns.map(n => n.id === id ? { ...n, data: { ...n.data, ...patch } } : n)
    );
  }

  function updateEdge(id: string, patch: Partial<Edge>) {
    setEdges(es => es.map(e => e.id === id ? { ...e, ...patch } : e));
  }

  const triggerStressEvent = useCallback(() => {
    if (triggered) return;
    setTriggered(true);

    // ── Phase 1: Demand spike ──────────────────────────────────
    setPhase(1);
    addLog('⚡ ALERT: Sudden demand spike detected in Texas grid region!', 'critical');
    addLog('Texas load climbing rapidly — now at 97% capacity.', 'warning');
    updateNode('texas', { status: 'overload', load: 97 });

    // ── Phase 2: Virginia transfers power ─────────────────────
    setTimeout(() => {
      setPhase(2);
      addLog('Initiating emergency transfer: Virginia → Texas', 'info');
      addLog('Virginia diverting 850 MW through eastern corridor.', 'info');
      updateNode('virginia', { status: 'active', load: 81 });
      updateNode('texas',    { status: 'warning', load: 88 });
      updateEdge('va-tx', {
        animated: true,
        label: '850 MW',
        style: { stroke: '#22c55e', strokeWidth: 3 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#22c55e' },
        labelStyle: { fill: '#86efac', fontSize: 11, fontWeight: 700 },
        labelBgStyle: { fill: '#052e16', fillOpacity: 0.95 },
      });
      setMetrics(m => ({ ...m, overloadAvoided: 850 }));
    }, 1600);

    // ── Phase 3: Reserve pool dispatch ────────────────────────
    setTimeout(() => {
      setPhase(3);
      addLog('Texas still critical at 88%. Activating Household Reserve Pool.', 'warning');
      addLog('Dispatching 320 MW from distributed household battery storage.', 'info');
      updateNode('reserve', { status: 'active', load: 67 });
      updateNode('texas',   { status: 'warning', load: 76 });
      updateEdge('res-tx', {
        animated: true,
        label: '320 MW',
        style: { stroke: '#a855f7', strokeWidth: 3 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#a855f7' },
        labelStyle: { fill: '#d8b4fe', fontSize: 11, fontWeight: 700 },
        labelBgStyle: { fill: '#1a0533', fillOpacity: 0.95 },
      });
      setMetrics(m => ({ ...m, reserveDispatched: 320 }));
    }, 3600);

    // ── Phase 4: Stabilisation ────────────────────────────────
    setTimeout(() => {
      setPhase(4);
      addLog('✅ Texas grid stabilising — load reduced to 74%.', 'success');
      addLog('All critical residential and emergency loads protected.', 'success');
      addLog('Grid stress event resolved. Continuing real-time monitoring.', 'info');
      updateNode('texas', { status: 'stable', load: 74 });
      setMetrics(m => ({ ...m, criticalLoadProtected: 1200000 }));
    }, 5800);
  }, [triggered]); // eslint-disable-line react-hooks/exhaustive-deps

  const reset = useCallback(() => {
    setTriggered(false);
    setPhase(0);
    setNodes(INIT_NODES);
    setEdges(INIT_EDGES);
    setMetrics(INIT_METRICS);
    setLog([{ id: Date.now(), ts: nowTime(), message: 'System reset — all nodes operating normally.', level: 'info' }]);
  }, [setNodes, setEdges]);

  const phaseColor = phase === 0 ? '#3b82f6' : phase === 4 ? '#22c55e' : '#ef4444';
  const phaseBg    = phase === 0 ? '#0f2040' : phase === 4 ? '#052e16' : '#3b0a0a';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0f172a', color: '#e2e8f0' }}>

      {/* ── Header ── */}
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 20px', borderBottom: '1px solid #1e293b', flexShrink: 0,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>🌐</span>
            <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.3px', color: '#f1f5f9' }}>
              MURMURATION
            </span>
            <span style={{ fontSize: '11px', color: '#64748b', borderLeft: '1px solid #334155', paddingLeft: '10px' }}>
              Distributed Grid Intelligence Platform
            </span>
          </div>
        </div>
        <div style={{
          padding: '4px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
          background: phaseBg, color: phaseColor, border: `1px solid ${phaseColor}`,
          textTransform: 'uppercase', letterSpacing: '0.5px',
        }}>
          {PHASE_LABELS[phase]}
        </div>
      </header>

      {/* ── Body ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── Graph + Controls ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Graph */}
          <div style={{ flex: 1, position: 'relative' }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.3 }}
              minZoom={0.5}
              maxZoom={2}
              style={{ background: '#0f172a' }}
            >
              <Background color="#1e293b" gap={24} size={1} />
              <Controls />
            </ReactFlow>
          </div>

          {/* Control bar */}
          <div style={{
            padding: '14px 20px', borderTop: '1px solid #1e293b',
            display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0,
          }}>
            <button
              onClick={triggerStressEvent}
              disabled={triggered}
              style={{
                padding: '10px 22px',
                background: triggered
                  ? '#374151'
                  : 'linear-gradient(135deg, #dc2626, #ef4444)',
                color: triggered ? '#6b7280' : '#fff',
                border: 'none', borderRadius: '8px',
                fontSize: '14px', fontWeight: 700,
                cursor: triggered ? 'not-allowed' : 'pointer',
                boxShadow: triggered ? 'none' : '0 0 24px rgba(239,68,68,0.45)',
                transition: 'all 0.3s ease',
                letterSpacing: '0.2px',
              }}
            >
              ⚡ Trigger Grid Stress Event
            </button>

            {triggered && (
              <button
                onClick={reset}
                style={{
                  padding: '10px 18px',
                  background: '#0f2040',
                  color: '#93c5fd',
                  border: '1px solid #3b82f6',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                ↺ Reset Simulation
              </button>
            )}

            <span style={{ fontSize: '12px', color: '#475569', marginLeft: 'auto' }}>
              {triggered && phase < 4
                ? `Phase ${phase}/4 — simulation running…`
                : phase === 4
                ? 'Simulation complete'
                : 'Ready — click the button to run the simulation'}
            </span>
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div style={{
          width: '320px', flexShrink: 0,
          borderLeft: '1px solid #1e293b',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}>

          {/* Metrics */}
          <section style={{ padding: '14px 16px', borderBottom: '1px solid #1e293b', flexShrink: 0 }}>
            <div style={{ fontSize: '10px', color: '#475569', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
              Grid Metrics
            </div>
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
            </div>
          </section>

          {/* Event Log */}
          <section style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '14px 16px' }}>
            <div style={{ fontSize: '10px', color: '#475569', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
              Event Log
            </div>
            <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {log.map(entry => (
                <div
                  key={entry.id}
                  style={{
                    padding: '7px 10px',
                    borderRadius: '6px',
                    background: LOG_BG[entry.level],
                    borderLeft: `3px solid ${LOG_COLOR[entry.level]}`,
                    fontSize: '12px',
                    lineHeight: '1.45',
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
