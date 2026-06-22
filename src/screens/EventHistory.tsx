import type { AppState } from '../types'
import { ManualInfoScreen, type ManualInfoField } from './ManualInfoScreen'

export function EventHistory({ state, onBack, onHome }: { state: AppState; onBack: () => void; onHome: () => void }) {
  const today = new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })
  const fields: ManualInfoField[] = state.events.slice(0, 8).flatMap((event, index) => {
    const y = 18.6 + index * 6.8
    return [
      { key: `${event.id}-event`, value: event.name, x: 17.7, y, width: 35.8, height: 3.7, className: 'event-history-field text-left' },
      { key: `${event.id}-date`, value: today, x: 54.2, y, width: 10.7, height: 3.7, className: 'event-history-field' },
      { key: `${event.id}-time`, value: event.timestamp.replace(/\s/g, ''), x: 66.3, y, width: 11.2, height: 3.7, className: 'event-history-field' },
      { key: `${event.id}-hours`, value: state.readings.runHours.toFixed(1), x: 79.4, y, width: 8.2, height: 3.7, className: 'event-history-field' },
    ]
  })

  return (
    <ManualInfoScreen
      assetName="sts-event-history-manual.png"
      fields={fields}
      linePressure={state.readings.linePressure}
      onBack={onBack}
      onHome={onHome}
    />
  )
}
