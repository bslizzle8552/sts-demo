import type { AppState } from '../types'

const analogGauges = [
  { key: 'dischargeTemp', label: 'Discharge Temp', max: 300, unit: 'F' },
  { key: 'linePressure', label: 'Line Pressure', max: 250, unit: 'psi' },
  { key: 'sumpPressure', label: 'Sump Pressure', max: 250, unit: 'psi' },
] as const

export function HomeAnalog({ state }: { state: AppState }) {
  return (
    <div className="sts-analog-screen">
      <div className="analog-status-strip">
        <Cell label="Load" value={`${state.readings.loadedHours.toFixed(2)} hrs`} />
        <Cell label="State" value={state.machineState} />
        <Cell label="Starts" value={state.readings.starts.toString().padStart(3, '0')} />
        <Cell label="Run" value={`${state.readings.runHours.toFixed(2)} hrs`} />
        <Cell label="Mode" value={state.controls.mode} />
        <Cell label="Cycles" value={state.readings.loadCycles.toString().padStart(3, '0')} />
      </div>
      <div className="round-gauge-bank">
        {analogGauges.map((gauge, index) => {
          const value = state.readings[gauge.key]
          const deg = Math.min(250, (value / gauge.max) * 250) - 125
          return (
            <div className={`round-gauge ${index === 1 ? 'large' : ''}`} key={gauge.key}>
              <div className="round-face">
                <div className="tick-ring" />
                <div className="round-needle" style={{ transform: `rotate(${deg}deg)` }} />
                <span>{gauge.label}</span>
                <strong>{value.toFixed(0)}</strong>
                <em>{gauge.unit}</em>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="analog-status-cell">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}
