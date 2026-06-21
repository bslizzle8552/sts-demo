import { HmiButton } from './HmiButton'
import type React from 'react'
import type { AppState, SimAction } from '../types'

interface OperatorControlsProps {
  state: AppState
  dispatch: React.Dispatch<SimAction>
  compact?: boolean
}

export function OperatorControls({ state, dispatch, compact = false }: OperatorControlsProps) {
  const canReset = (state.machineState === 'FAULTED' || state.machineState === 'MANUALLY STOPPED') && !state.activeFaults.includes('Emergency stop active')
  return (
    <div className={`operator-controls ${compact ? 'compact' : ''}`}>
      <HmiButton label="START" tone="primary" onClick={() => dispatch({ type: 'START' })} />
      <HmiButton label="STOP" tone="warning" onClick={() => dispatch({ type: 'STOP' })} />
      <HmiButton label="RESET / CLEAR FAULT" onClick={() => dispatch({ type: 'RESET' })} disabled={!canReset} />
      <HmiButton label="E-STOP" tone="danger" onClick={() => dispatch({ type: 'ESTOP' })} />
    </div>
  )
}
