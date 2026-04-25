import { useRef, useState } from 'react';
import { EventLog } from './components/EventLog';
import { GridGraph } from './components/GridGraph';
import { MetricsPanel } from './components/MetricsPanel';
import {
  initialEdges,
  initialMetrics,
  initialNodes,
  nowTime,
  texasStressScenario,
} from './lib/simulation';
import type { GridEdge, GridNode, LogEntry, Metrics, Phase } from './types';

function makeLog(message: string, level: LogEntry['level']): LogEntry {
  return { id: Date.now() + Math.random(), ts: nowTime(), message, level };
}

function applyNodeUpdates(nodes: GridNode[], phase: Phase) {
  return nodes.map((node) => ({ ...node, ...(phase.nodes[node.id] ?? {}) }));
}

function applyEdgeUpdates(edges: GridEdge[], phase: Phase) {
  return edges.map((edge) => ({ ...edge, ...(phase.edges[edge.id] ?? {}) }));
}

export default function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [metrics, setMetrics] = useState<Metrics>(initialMetrics);
  const [log, setLog] = useState<LogEntry[]>([
    makeLog('System online. Virginia, Texas, distributed reserves, and critical services are nominal.', 'info'),
  ]);
  const [phaseLabel, setPhaseLabel] = useState('Ready');
  const [running, setRunning] = useState(false);
  const [complete, setComplete] = useState(false);
  const timers = useRef<number[]>([]);

  function reset() {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    setNodes(initialNodes);
    setEdges(initialEdges);
    setMetrics(initialMetrics);
    setLog([makeLog('System reset. Ready for another grid stress event.', 'info')]);
    setPhaseLabel('Ready');
    setRunning(false);
    setComplete(false);
  }

  function applyPhase(phase: Phase) {
    setPhaseLabel(phase.label);
    setNodes((current) => applyNodeUpdates(current, phase));
    setEdges((current) => applyEdgeUpdates(current, phase));
    setMetrics((current) => ({ ...current, ...phase.metrics }));
    setLog((current) => [
      ...current,
      ...phase.logs.map((entry) => makeLog(entry.message, entry.level)),
    ]);
  }

  function triggerStressEvent() {
    if (running) {
      return;
    }

    reset();
    setRunning(true);

    texasStressScenario.phases.forEach((phase, index) => {
      const timer = window.setTimeout(() => {
        applyPhase(phase);

        if (index === texasStressScenario.phases.length - 1) {
          setRunning(false);
          setComplete(true);
        }
      }, phase.delayMs);

      timers.current.push(timer);
    });
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Murmuration</p>
          <h1>AI-Assisted Grid Resilience</h1>
        </div>
        <div className="phase-pill">{complete ? 'Demo Complete' : phaseLabel}</div>
      </header>

      <section className="scenario-strip">
        <div>
          <strong>{texasStressScenario.name}</strong>
          <span>{texasStressScenario.description}</span>
        </div>
        <div className="actions">
          <button onClick={triggerStressEvent} disabled={running}>
            {running ? 'Running Event' : 'Trigger Grid Stress Event'}
          </button>
          <button className="secondary" onClick={reset}>
            Reset
          </button>
        </div>
      </section>

      <div className="workspace">
        <GridGraph nodes={nodes} edges={edges} />
        <aside className="side-panel">
          <MetricsPanel metrics={metrics} />
          <EventLog entries={log} />
        </aside>
      </div>
    </main>
  );
}
