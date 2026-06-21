import { CapacityBar } from '../components/CapacityBar'
import type { AppState } from '../types'

export function SpiralValveStatus({ state }: { state: AppState }) {
  const command = state.readings.capacity
  return (
    <div className="spiral-layout">
      <div className="spiral-visual">
        <div className="spiral-track">
          <div className="spiral-position" style={{ left: `${Math.max(4, Math.min(92, command))}%` }} />
        </div>
        <span>Minimum</span>
        <span>Maximum</span>
      </div>
      <CapacityBar value={command} />
      <div className="spiral-status-grid">
        <Readout label="Valve Command" value={`${command.toFixed(0)}%`} />
        <Readout label="Feedback" value={`${Math.max(0, command - 1.4).toFixed(0)}%`} />
        <Readout label="Mode" value="Spiral Valve / Variable" />
        <Readout label="Driver Ready Flags" value="Ready" />
        <Readout label="Last Warning" value="0h" />
        <Readout label="Operation Warning" value="0h" />
      </div>
    </div>
  )
}

function Readout({ label, value }: { label: string; value: string }) {
  return (
    <div className="spiral-readout">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}
