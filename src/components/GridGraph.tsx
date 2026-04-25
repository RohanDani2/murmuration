import type { GridEdge, GridNode } from '../types';

interface GridGraphProps {
  nodes: GridNode[];
  edges: GridEdge[];
}

const regionClass: Record<GridNode['status'], string> = {
  idle: 'available',
  warning: 'stressed',
  overload: 'stressed',
  active: 'active',
  stable: 'protected',
  offline: 'stressed',
};

const regionPosition: Record<GridNode['id'], string> = {
  virginia: 'virginia',
  texas: 'texas',
  reserve: 'reserve',
  critical: 'critical',
};

const regionShortLabel: Record<GridNode['id'], string> = {
  virginia: 'VA',
  texas: 'TX',
  reserve: 'DER',
  critical: '911',
};

function RegionMarker({ node }: { node: GridNode }) {
  const loadLabel = node.id === 'reserve' && node.load === 0 ? 'Ready' : node.id === 'critical' ? 'Safe' : `${node.load}%`;

  return (
    <div className={`region ${regionPosition[node.id]} ${regionClass[node.status]}`}>
      <div className="region-core">
        <strong>{regionShortLabel[node.id]}</strong>
        <span>{loadLabel}</span>
      </div>
      <div className="region-label">{node.label}</div>
    </div>
  );
}

function routeClass(edges: GridEdge[], id: string, activeClass = 'active') {
  return `route ${edges.find((edge) => edge.id === id)?.status === 'active' ? activeClass : ''}`;
}

export function GridGraph({ nodes, edges }: GridGraphProps) {
  const byId = Object.fromEntries(nodes.map((node) => [node.id, node]));

  return (
    <section className="map-canvas" aria-label="Stylized Murmuration grid map">
      <div className="us-silhouette">
        <svg viewBox="0 0 900 470" aria-hidden="true">
          <path d="M90 230 C150 150 250 115 340 130 C405 86 505 85 575 125 C675 105 775 160 812 236 C850 313 794 372 692 363 C612 428 489 426 407 382 C317 398 231 374 193 319 C120 318 61 284 90 230Z" />
          <path className="map-line" d="M580 128 C590 205 574 272 545 355" />
          <path className="map-line" d="M378 136 C405 222 396 310 367 384" />
        </svg>
      </div>
      <svg className="route-layer" viewBox="0 0 1000 650" preserveAspectRatio="none" aria-hidden="true">
        <path className={routeClass(edges, 'va-tx')} d="M660 292 C620 340 560 385 470 422" />
        <path className={routeClass(edges, 'reserve-tx', 'reserve-active')} d="M250 403 C315 440 390 445 470 422" />
        <path className={routeClass(edges, 'tx-critical')} d="M470 422 C560 456 660 458 750 448" />
        <path className="route future-route" d="M580 234 C550 296 515 352 470 422" />
      </svg>
      <RegionMarker node={byId.virginia} />
      <RegionMarker node={byId.texas} />
      <div className="region ohio">
        <div className="region-core">
          <strong>OH</strong>
          <span>Watch</span>
        </div>
        <div className="region-label">Future: data center growth</div>
      </div>
      <RegionMarker node={byId.reserve} />
      <RegionMarker node={byId.critical} />
      <div className="map-legend">
        <span>Red: demand risk</span>
        <span>Teal: available supply</span>
        <span>Purple: reserves</span>
        <span>Green: protected load</span>
      </div>
    </section>
  );
}
