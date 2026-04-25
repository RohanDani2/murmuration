import type { LogEntry } from '../types';

interface EventLogProps {
  entries: LogEntry[];
}

export function EventLog({ entries }: EventLogProps) {
  return (
    <section className="panel event-log" aria-label="Event log">
      <h2>Event Log</h2>
      <div className="log-list">
        {entries.map((entry) => (
          <article className={`log-entry log-${entry.level}`} key={entry.id}>
            <time>{entry.ts}</time>
            <span>{entry.message}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
