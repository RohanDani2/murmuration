import type { Metrics } from '../types';

interface MetricsPanelProps {
  metrics: Metrics;
}

function metricValue(value: number, suffix: string) {
  return value > 0 ? `${value.toLocaleString()} ${suffix}` : '-';
}

export function MetricsPanel({ metrics }: MetricsPanelProps) {
  return (
    <section className="panel metrics-panel" aria-label="Grid metrics">
      <h2>Grid Metrics</h2>
      <div className="metric">
        <span>Overload Avoided</span>
        <strong>{metricValue(metrics.overloadAvoided, 'MW')}</strong>
      </div>
      <div className="metric">
        <span>Reserve Dispatched</span>
        <strong>{metricValue(metrics.reserveDispatched, 'MW')}</strong>
      </div>
      <div className="metric">
        <span>Critical Load Protected</span>
        <strong>{metrics.criticalLoadProtected > 0 ? `${(metrics.criticalLoadProtected / 1000000).toFixed(1)}M people` : '-'}</strong>
      </div>
    </section>
  );
}
