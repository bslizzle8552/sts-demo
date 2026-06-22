import { useEffect, useState } from 'react'
import type { AppState } from '../types'

interface HomeAnalogProps {
  state: AppState
  onBack: () => void
}

export function HomeAnalog({ state, onBack }: HomeAnalogProps) {
  const [now, setNow] = useState(() => new Date())
  const r = state.readings
  const analogAsset = `${import.meta.env.BASE_URL}assets/sts-analog-manual-home-clean.png`.replace(/\/{2,}/g, '/')
  const pointerSmallAsset = `${import.meta.env.BASE_URL}assets/sts-analog-pointer-small.png`.replace(/\/{2,}/g, '/')
  const pointerLargeAsset = `${import.meta.env.BASE_URL}assets/sts-analog-pointer-large.png`.replace(/\/{2,}/g, '/')

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <div className="manual-reference-screen analog-reference-screen">
      <img className="manual-reference-image" src={analogAsset} alt="" />
      <ManualField className="analog-field-load" value={`${r.loadedHours.toFixed(2)} hrs`} />
      <ManualField className="analog-field-run" value={`${r.runHours.toFixed(2)} hrs`} />
      <ManualField className="analog-field-state" value={titleCaseState(state.machineState)} />
      <ManualField className="analog-field-mode" value={state.controls.mode} />
      <ManualField className="analog-field-starts" value={r.starts.toString().padStart(3, '0')} />
      <ManualField className="analog-field-cycles" value={r.loadCycles.toString().padStart(3, '0')} />
      <AnalogPointer className="analog-pointer-discharge" src={pointerSmallAsset} value={r.dischargeTemp} max={300} />
      <AnalogPointer className="analog-pointer-line" src={pointerLargeAsset} value={r.linePressure} max={250} />
      <AnalogPointer className="analog-pointer-sump" src={pointerSmallAsset} value={r.sumpPressure} max={250} />
      <GaugeReadout className="analog-gauge-discharge" label="Discharge Temp" value={r.dischargeTemp.toFixed(0)} unit={'\u00b0F'} />
      <GaugeReadout className="analog-gauge-line" label="Line Pressure" value={r.linePressure.toFixed(0)} unit="psi" />
      <GaugeReadout className="analog-gauge-sump" label="Sump Pressure" value={r.sumpPressure.toFixed(0)} unit="psi" />
      <button className="manual-back-button analog-back-button" type="button" onClick={onBack} aria-label="Back" />
      <time className="manual-clock analog-clock" dateTime={now.toISOString()}>
        <span>{now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' })}</span>
        <span>{now.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}</span>
      </time>
    </div>
  )
}

function AnalogPointer({ className, src, value, max }: { className: string; src: string; value: number; max: number }) {
  const sweep = 290
  const rotation = Math.max(0, Math.min(1, value / max)) * sweep
  return <img className={`analog-gauge-pointer ${className}`} src={src} alt="" style={{ transform: `rotate(${rotation}deg)` }} />
}

function ManualField({ className, value }: { className: string; value: string }) {
  return <div className={`manual-field analog-field ${className}`}>{value}</div>
}

function GaugeReadout({ className, label, value, unit }: { className: string; label: string; value: string; unit: string }) {
  return (
    <div className={`analog-gauge-readout ${className}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <em>{unit}</em>
    </div>
  )
}

function titleCaseState(value: string) {
  return value
    .toLowerCase()
    .split(' ')
    .map((word) => word ? `${word.charAt(0).toUpperCase()}${word.slice(1)}` : word)
    .join(' ')
}
