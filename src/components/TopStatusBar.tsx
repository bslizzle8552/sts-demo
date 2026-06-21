import type { AppState } from '../types'

interface TopStatusBarProps {
  state: AppState
  title: string
  isHome: boolean
  canBack: boolean
  onBack: () => void
  onHome: () => void
}

export function TopStatusBar({ state, title, isHome, canBack, onBack, onHome }: TopStatusBarProps) {
  const faulted = state.activeFaults.length > 0 || state.machineState.includes('FAULT')
  return (
    <header className="top-status">
      <div className="brand-block">
        {!isHome && <button className="top-nav-button back" type="button" onClick={onBack} disabled={!canBack}>BACK</button>}
        <div>
          <span className="brand">SULLAIR</span>
          <span className="model">SN7509S AC</span>
        </div>
      </div>
      <div className="title-block">
        <span>{title}</span>
        <strong>{state.machineState}</strong>
      </div>
      <div className="status-block">
        {!isHome && <button className="top-nav-button home" type="button" onClick={onHome}>HOME</button>}
        <span className={`status-pill ${faulted ? 'fault' : state.activeWarnings.length ? 'warning' : 'ok'}`}>
          {faulted ? 'FAULT' : state.activeWarnings.length ? 'WARNING' : 'READY'}
        </span>
        <span>Mode: {state.controls.mode}</span>
      </div>
    </header>
  )
}
