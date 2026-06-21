import type { AppState } from '../types'

export function IOStatus({ state }: { state: AppState }) {
  const inputs: Array<[string, boolean]> = [
    ['Start permissive', state.machineState !== 'FAULTED'],
    ['Emergency stop circuit', !state.activeFaults.includes('Emergency stop active')],
    ['Pressure transducer', true],
    ['Temperature sensor', true],
    ['UI communication', !state.flags.communicationFault],
  ]
  const outputs: Array<[string, boolean]> = [
    ['Main motor starter', state.machineState.startsWith('STARTING') || state.machineState.includes('LOADED') || state.machineState === 'LOADING'],
    ['Load solenoid', state.readings.capacity > 5],
    ['Fan contactor', state.readings.fanRunning],
    ['Fault relay', state.activeFaults.length > 0],
    ['Run lamp', state.readings.runHours > 0 && state.machineState !== 'MANUALLY STOPPED'],
  ]

  return (
    <div className="io-grid">
      <Column title="Digital Inputs" rows={inputs} />
      <Column title="Digital Outputs" rows={outputs} />
    </div>
  )
}

function Column({ title, rows }: { title: string; rows: Array<[string, boolean]> }) {
  return (
    <div className="io-column">
      <h2>{title}</h2>
      {rows.map(([label, active]) => (
        <div className="io-row" key={label}>
          <span className={active ? 'lamp on' : 'lamp'} />
          <strong>{label}</strong>
          <em>{active ? 'ON' : 'OFF'}</em>
        </div>
      ))}
    </div>
  )
}
