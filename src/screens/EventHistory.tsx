import type { AppState } from '../types'

export function EventHistory({ state }: { state: AppState }) {
  return (
    <div className="event-table">
      <div className="event-head"><span>Time</span><span>Severity</span><span>Event</span><span>State</span><span>Value</span></div>
      {state.events.map((event) => (
        <div className="event-row" key={event.id}>
          <span>{event.timestamp}</span>
          <strong className={event.severity.toLowerCase()}>{event.severity}</strong>
          <span title={event.message}>{event.name}</span>
          <span>{event.state}</span>
          <span>{event.value ?? '-'}</span>
        </div>
      ))}
      {state.events.length === 0 && <div className="empty-state">No events recorded</div>}
    </div>
  )
}
