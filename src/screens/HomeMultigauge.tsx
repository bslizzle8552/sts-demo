import { CapacityBar } from '../components/CapacityBar'
import type { AppState } from '../types'

const bars = [
  { key: 'dischargeTemp', label: 'Discharge Temperature', max: 300, unit: 'F' },
  { key: 'linePressure', label: 'Line Pressure', max: 250, unit: 'psi' },
  { key: 'sumpPressure', label: 'Sump Pressure', max: 250, unit: 'psi' },
] as const

export function HomeMultigauge({ state }: { state: AppState }) {
  return (
    <div className="sts-multigauge-screen">
      <section className="sts-status-card multigauge-status">
        <Status label="State" value={state.machineState} />
        <Status label="Mode" value={state.controls.mode} />
        <div className="status-pair">
          <Status label="Load" value={state.readings.loadedHours.toFixed(2)} />
          <Status label="Run" value={state.readings.runHours.toFixed(2)} />
        </div>
        <div className="status-pair">
          <Status label="Starts" value={state.readings.starts} />
          <Status label="Cycles" value={state.readings.loadCycles} />
        </div>
        <CapacityBar value={state.readings.capacity} />
      </section>
      <section className="vertical-gauge-bank">
        {bars.map((bar) => {
          const value = state.readings[bar.key]
          const percent = Math.max(0, Math.min(100, (value / bar.max) * 100))
          return (
            <div className="vertical-gauge" key={bar.key}>
              <h2>{bar.label}</h2>
              <div className="vertical-track">
                <div className="vertical-fill" style={{ height: `${percent}%` }} />
                <div className="vertical-scale">
                  <span>{bar.max}</span>
                  <span>{Math.round(bar.max * 0.75)}</span>
                  <span>{Math.round(bar.max * 0.5)}</span>
                  <span>{Math.round(bar.max * 0.25)}</span>
                  <span>0</span>
                </div>
              </div>
              <strong>{value.toFixed(0)} {bar.unit}</strong>
            </div>
          )
        })}
      </section>
    </div>
  )
}

function Status({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="sts-status-field">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}
