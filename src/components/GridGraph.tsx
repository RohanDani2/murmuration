import type { GridEdge, GridNode } from '../types';

interface GridGraphProps {
  nodes: GridNode[];
  edges: GridEdge[];
}

const nodeClass: Record<GridNode['status'], string> = {
  idle: 'node node-idle',
  warning: 'node node-warning',
  overload: 'node node-overload',
  active: 'node node-active',
  stable: 'node node-stable',
  offline: 'node node-offline',
};

function NodeCard({ node }: { node: GridNode }) {
  return (
    <article className={nodeClass[node.status]}>
      <div className="node-type">{node.nodeType}</div>
      <div className="node-title">{node.label}</div>
      <div className="node-row">
        <span>Load</span>
        <strong>{node.status === 'offline' ? 'Offline' : `${node.load}%`}</strong>
      </div>
      <div className="load-bar">
        <span style={{ width: `${node.load}%` }} />
      </div>
      <div className="status-badge">{node.status}</div>
    </article>
  );
}

function EdgeStatus({ edge }: { edge: GridEdge }) {
  return (
    <div className={`edge edge-${edge.status}`}>
      <span>{edge.label}</span>
    </div>
  );
}

export function GridGraph({ nodes, edges }: GridGraphProps) {
  const byId = Object.fromEntries(nodes.map((node) => [node.id, node]));

  return (
    <section className="graph" aria-label="Murmuration grid graph">
      <div className="graph-row">
        <NodeCard node={byId.virginia} />
        <EdgeStatus edge={edges.find((edge) => edge.id === 'va-tx')!} />
        <NodeCard node={byId.texas} />
      </div>
      <div className="graph-row graph-row-lower">
        <NodeCard node={byId.reserve} />
        <EdgeStatus edge={edges.find((edge) => edge.id === 'reserve-tx')!} />
        <NodeCard node={byId.critical} />
      </div>
      <div className="critical-link">
        <EdgeStatus edge={edges.find((edge) => edge.id === 'tx-critical')!} />
      </div>
    </section>
  );
}
