import { useEffect, useState } from 'react'
import type { AppState } from '../types'

interface HomeMultigaugeProps {
  state: AppState
  onBack: () => void
  onEMode: () => void
}

export function HomeMultigauge({ state, onBack, onEMode }: HomeMultigaugeProps) {
  const [now, setNow] = useState(() => new Date())
  const r = state.readings
  const multigaugeAsset = `${import.meta.env.BASE_URL}assets/sts-multigauge-manual-home-clean.png`.replace(/\/{2,}/g, '/')

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <div className="manual-reference-screen multigauge-reference-screen">
      <img className="manual-reference-image" src={multigaugeAsset} alt="" />
      <GaugeTitle className="multigauge-title-discharge" lines={['Discharge', 'Temperature']} />
      <GaugeTitle className="multigauge-title-line" lines={['Line', 'Pressure']} />
      <GaugeTitle className="multigauge-title-sump" lines={['Sump', 'Pressure']} />
      <ManualField className="multigauge-field-state" value={state.machineState} />
      <ManualField className="multigauge-field-mode" value={state.controls.mode} />
      <ManualField className="multigauge-field-load" value={`${r.loadedHours.toFixed(2)} hrs`} />
      <ManualField className="multigauge-field-run" value={`${r.runHours.toFixed(2)} hrs`} />
      <ManualField className="multigauge-field-starts" value={r.starts.toString().padStart(3, '0')} />
      <ManualField className="multigauge-field-cycles" value={r.loadCycles.toString().padStart(3, '0')} />
      <div className="manual-capacity-mask multigauge-capacity-mask">
        <div className="manual-capacity-fill" style={{ width: `${(Math.max(0, Math.min(140, r.capacity)) / 140) * 100}%` }} />
      </div>
      <VerticalFill className="multigauge-fill-discharge" value={r.dischargeTemp} max={300} />
      <VerticalFill className="multigauge-fill-line" value={r.linePressure} max={250} />
      <VerticalFill className="multigauge-fill-sump" value={r.sumpPressure} max={250} />
      <button className="manual-back-button multigauge-back-button" type="button" onClick={onBack} aria-label="Back" />
      <button className="multigauge-emode-button" type="button" onClick={onEMode} aria-label="E-Mode" />
      <time className="manual-clock multigauge-clock" dateTime={now.toISOString()}>
        <span>{now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' })}</span>
        <span>{now.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}</span>
      </time>
    </div>
  )
}

function GaugeTitle({ className, lines }: { className: string; lines: string[] }) {
  return (
    <div className={`multigauge-title ${className}`}>
      {lines.map((line) => (
        <span key={line}>{line}</span>
      ))}
    </div>
  )
}

function ManualField({ className, value }: { className: string; value: string }) {
  return <div className={`manual-field multigauge-field ${className}`}>{value}</div>
}

function VerticalFill({ className, value, max }: { className: string; value: number; max: number }) {
  const height = `${Math.max(0, Math.min(100, (value / max) * 100))}%`
  return (
    <div className={`multigauge-fill-track ${className}`}>
      <div style={{ height }} />
    </div>
  )
}
