import type { AppState, ScreenId } from '../types'

interface BottomNavProps {
  active: ScreenId
  state: AppState
  onNavigate: (screen: ScreenId) => void
}

const nav: Array<{ id: ScreenId; label: string }> = [
  { id: 'mimic', label: 'Mimic' },
  { id: 'analog', label: 'Analog' },
  { id: 'multigauge', label: 'Gauges' },
  { id: 'menu', label: 'Menu' },
]

export function BottomNav({ active, state, onNavigate }: BottomNavProps) {
  const now = new Date()
  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-buttons">
        {nav.map((item) => (
          <button key={item.id} type="button" className={active === item.id ? 'active' : ''} onClick={() => onNavigate(item.id)}>
            {item.label}
          </button>
        ))}
      </div>
      <div className="bottom-status-strip">
        <span>Line Pressure: <strong>{state.readings.linePressure.toFixed(0)} psi</strong></span>
        <span>Mode: <strong>{state.controls.mode}</strong></span>
        <time dateTime={now.toISOString()}>
          {now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' })}
          {' '}
          {now.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}
        </time>
      </div>
    </nav>
  )
}
