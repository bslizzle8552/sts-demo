import type { AppState } from '../types'

export function Warnings({ state }: { state: AppState }) {
  const active = [...state.activeFaults.map((message) => ({ message, severity: 'FAULT' })), ...state.activeWarnings.map((message) => ({ message, severity: 'WARNING' }))]
  return (
    <div className="alarm-list">
      {active.length === 0 ? (
        <div className="empty-state">No active warnings or faults</div>
      ) : (
        active.map((item) => (
          <div className={`alarm-row ${item.severity.toLowerCase()}`} key={item.message}>
            <strong>{item.severity}</strong>
            <span>{item.message}</span>
          </div>
        ))
      )}
    </div>
  )
}
