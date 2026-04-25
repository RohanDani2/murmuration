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
  const [headline, setHeadline] = useState('Ready: Murmuration is watching demand, surplus, and protected services.');
  const [subhead, setSubhead] = useState('Click the stress event to see the protocol forecast need, choose available sources, and route power to Texas.');
  const [activeStory, setActiveStory] = useState<'need' | 'source' | 'route' | 'protect'>('need');
  const [decision, setDecision] = useState([
    'Monitor regional load and reserve availability.',
    'Hold Virginia and distributed reserves on standby.',
  ]);
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
    setHeadline('Ready: Murmuration is watching demand, surplus, and protected services.');
    setSubhead('Click the stress event to see the protocol forecast need, choose available sources, and route power to Texas.');
    setActiveStory('need');
    setDecision([
      'Monitor regional load and reserve availability.',
      'Hold Virginia and distributed reserves on standby.',
    ]);
    setRunning(false);
    setComplete(false);
  }

  function applyPhase(phase: Phase) {
    setPhaseLabel(phase.label);
    setHeadline(phase.headline);
    setSubhead(phase.subhead);
    setActiveStory(phase.story);
    setDecision(phase.decision);
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

      <section className="story-band" aria-label="Scenario phases">
        <article className={`story-step ${activeStory === 'need' ? 'active' : ''}`}>
          <span>1. Forecast Need</span>
          <strong>Texas demand spike</strong>
        </article>
        <article className={`story-step ${activeStory === 'source' ? 'active' : ''}`}>
          <span>2. Find Sources</span>
          <strong>Virginia surplus + reserves</strong>
        </article>
        <article className={`story-step ${activeStory === 'route' ? 'active' : ''}`}>
          <span>3. Route Power</span>
          <strong>Transfer where it helps most</strong>
        </article>
        <article className={`story-step ${activeStory === 'protect' ? 'active' : ''}`}>
          <span>4. Protect Services</span>
          <strong>Keep critical load online</strong>
        </article>
      </section>

      <div className="workspace">
        <section className="graph-area">
          <div className="graph-title">
            <strong>{headline}</strong>
            <span>{subhead}</span>
          </div>
          <GridGraph nodes={nodes} edges={edges} />
          <section className="decision-card">
            <h2>Protocol Decision</h2>
            <ul>
              {decision.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </section>
        <aside className="side-panel">
          <MetricsPanel metrics={metrics} />
          <EventLog entries={log} />
        </aside>
      </div>
    </main>
  );
}
