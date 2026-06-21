import type React from 'react'
import type { AppState, ControlParameters as ControlParametersType, SimAction } from '../types'

interface ControlParametersProps {
  state: AppState
  dispatch: React.Dispatch<SimAction>
}

export function ControlParameters({ state, dispatch }: ControlParametersProps) {
  const c = state.controls

  const setNumber = (key: keyof ControlParametersType, value: string) => {
    const parsed = Number(value)
    if (!Number.isNaN(parsed)) {
      dispatch({ type: 'SET_CONTROL', key, value: parsed })
    }
  }

  return (
    <div className="control-form">
      <EditableSelect
        label="Mode"
        value={c.mode}
        options={['AUTOMATIC', 'MANUAL', 'OFF']}
        onChange={(value) => dispatch({ type: 'SET_CONTROL', key: 'mode', value })}
      />
      <EditableNumber label="Load Pressure" value={c.loadPressure} unit="psi" min={80} max={180} onChange={(value) => setNumber('loadPressure', value)} />
      <EditableNumber label="Unload Pressure" value={c.unloadPressure} unit="psi" min={90} max={210} onChange={(value) => setNumber('unloadPressure', value)} />
      <EditableNumber label="Spiral Target Pressure" value={c.targetPressure} unit="psi" min={90} max={180} onChange={(value) => setNumber('targetPressure', value)} />
      <EditableSelect
        label="Modulation"
        value={c.modulation}
        options={['Spiral Valve / Variable Displacement', 'Load/Unload']}
        onChange={(value) => dispatch({ type: 'SET_CONTROL', key: 'modulation', value })}
      />
      <EditableNumber label="Unload Time" value={c.unloadTime} unit="seconds" min={30} max={900} onChange={(value) => setNumber('unloadTime', value)} />
    </div>
  )
}

function EditableNumber({ label, value, unit, min, max, onChange }: { label: string; value: number; unit: string; min: number; max: number; onChange: (value: string) => void }) {
  return (
    <label className="control-row">
      <span>{label}</span>
      <input type="number" min={min} max={max} value={value} onChange={(event) => onChange(event.target.value)} />
      <em>{unit}</em>
    </label>
  )
}

function EditableSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="control-row">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}
