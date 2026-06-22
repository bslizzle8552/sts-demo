import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import type React from 'react'
import type { AppState, ControlParameters as ControlParametersType, SimAction } from '../types'

interface ControlParametersProps {
  state: AppState
  dispatch: React.Dispatch<SimAction>
  onBack: () => void
  onHome: () => void
}

export function ControlParameters({ state, dispatch, onBack, onHome }: ControlParametersProps) {
  const [now, setNow] = useState(() => new Date())
  const c = state.controls
  const asset = `${import.meta.env.BASE_URL}assets/sts-control-parameters-manual.png`.replace(/\/{2,}/g, '/')

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(interval)
  }, [])

  const setNumber = (key: keyof ControlParametersType, value: string) => {
    const parsed = Number(value)
    if (!Number.isNaN(parsed)) dispatch({ type: 'SET_CONTROL', key, value: parsed })
  }

  const setString = (key: keyof ControlParametersType, value: string) => {
    dispatch({ type: 'SET_CONTROL', key, value })
  }

  return (
    <div className="manual-reference-screen control-parameter-reference-screen">
      <img className="manual-reference-image" src={asset} alt="" />
      <ControlLabel value="Restart Pressure" x={2.4} y={58.7} width={22} />
      <ControlLabel value="Restart Time (s)" x={50.0} y={42.2} width={20} />
      <ControlNumber value={c.unloadPressure} x={29.9} y={13.2} width={18.8} height={7.1} onChange={(value) => setNumber('unloadPressure', value)} />
      <ControlNumber value={c.loadPressure} x={29.9} y={22.4} width={18.8} height={7.1} onChange={(value) => setNumber('loadPressure', value)} />
      <ControlSelect
        value={c.modulation}
        options={['Spiral Valve', 'Load/Unload']}
        x={29.9}
        y={31.6}
        width={18.8}
        height={7.1}
        onChange={(value) => setString('modulation', value)}
      />
      <ControlSelect
        value={c.mode}
        options={['AUTOMATIC', 'MANUAL', 'OFF']}
        x={29.9}
        y={40.8}
        width={18.8}
        height={7.1}
        onChange={(value) => setString('mode', value)}
      />
      <ControlNumber value={c.unloadTime} x={29.9} y={50.2} width={18.8} height={7.0} onChange={(value) => setNumber('unloadTime', value)} />
      <ControlNumber value={c.restartPressure} x={29.9} y={59.4} width={18.8} height={7.0} onChange={(value) => setNumber('restartPressure', value)} />
      <ControlNumber value={c.targetPressure} x={29.9} y={68.6} width={18.8} height={7.1} onChange={(value) => setNumber('targetPressure', value)} />
      <ControlNumber value={c.drainInterval} x={78.3} y={13.2} width={18.8} height={7.1} onChange={(value) => setNumber('drainInterval', value)} />
      <ControlNumber value={c.drainTime} x={78.3} y={22.4} width={18.8} height={7.1} onChange={(value) => setNumber('drainTime', value)} />
      <ControlReadout value="5" x={78.3} y={31.9} width={19.0} height={7.1} />
      <ControlNumber value={c.restartTime} x={78.3} y={41.3} width={19.0} height={7.3} onChange={(value) => setNumber('restartTime', value)} />
      <button className="control-parameter-link" type="button" style={fieldStyle(78.2, 51.1, 18.8, 7.1)}>......</button>
      <button className="manual-info-back" type="button" onClick={onBack} aria-label="Back" />
      <button className="manual-info-home" type="button" onClick={onHome} aria-label="Home" />
      <div className="manual-info-pressure">{state.readings.linePressure.toFixed(0)}psi</div>
      <time className="manual-clock manual-info-clock" dateTime={now.toISOString()}>
        <span>{now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' })}</span>
        <span>{now.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}</span>
      </time>
    </div>
  )
}

function fieldStyle(x: number, y: number, width: number, height: number): CSSProperties {
  return { left: `${x}%`, top: `${y}%`, width: `${width}%`, height: `${height}%` }
}

function ControlLabel({ value, x, y, width }: { value: string; x: number; y: number; width: number }) {
  return (
    <span className="control-parameter-label" style={fieldStyle(x, y, width, 4.8)}>
      {value}
    </span>
  )
}

function ControlNumber({ value, x, y, width, height, onChange }: { value: number; x: number; y: number; width: number; height: number; onChange: (value: string) => void }) {
  return (
    <input
      className="control-parameter-field"
      type="number"
      value={value}
      style={fieldStyle(x, y, width, height)}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}

function ControlSelect({ value, options, x, y, width, height, onChange }: { value: string; options: string[]; x: number; y: number; width: number; height: number; onChange: (value: string) => void }) {
  return (
    <select className="control-parameter-field" value={value} style={fieldStyle(x, y, width, height)} onChange={(event) => onChange(event.target.value)}>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}

function ControlReadout({ value, x, y, width, height }: { value: string; x: number; y: number; width: number; height: number }) {
  return (
    <span className="control-parameter-field readout" style={fieldStyle(x, y, width, height)}>
      {value}
    </span>
  )
}
