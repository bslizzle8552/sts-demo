import { useEffect, useState } from 'react'
import type { AppState } from '../types'

interface HomeMimicProps {
  state: AppState
  onBack: () => void
}

export function HomeMimic({ state, onBack }: HomeMimicProps) {
  const [now, setNow] = useState(() => new Date())
  const r = state.readings
  const mimicAsset = `${import.meta.env.BASE_URL}assets/sts-mimic-manual-home.png`.replace(/\/{2,}/g, '/')
  const capacity = Math.max(0, Math.min(140, r.capacity))

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <div className="manual-mimic-screen">
      <img className="manual-mimic-image" src={mimicAsset} alt="" />
      <ManualField className="manual-field-state" value={state.machineState} />
      <ManualField className="manual-field-mode" value={state.controls.mode} />
      <ManualField className="manual-field-load" value={`${r.loadedHours.toFixed(2)} hrs`} />
      <ManualField className="manual-field-run" value={`${r.runHours.toFixed(2)} hrs`} />
      <ManualField className="manual-field-starts" value={r.starts.toString().padStart(3, '0')} />
      <ManualField className="manual-field-cycles" value={r.loadCycles.toString().padStart(3, '0')} />
      <ManualField className="manual-field-discharge-temp" value={`${r.dischargeTemp.toFixed(0)} F`} />
      <ManualField className="manual-field-sump-temp" value={`${r.sumpTemp.toFixed(0)} F`} />
      <ManualField className="manual-field-sump-pressure" value={`${r.sumpPressure.toFixed(0)} psi`} />
      <ManualField className="manual-field-line-pressure" value={`${r.linePressure.toFixed(0)} psi`} />
      <div className="manual-capacity-mask">
        <div className="manual-capacity-fill" style={{ width: `${(capacity / 140) * 100}%` }} />
      </div>
      <button className="manual-back-button" type="button" onClick={onBack} aria-label="Back" />
      <time className="manual-clock" dateTime={now.toISOString()}>
        <span>{now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' })}</span>
        <span>{now.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}</span>
      </time>
    </div>
  )
}

function ManualField({ className, value }: { className: string; value: string }) {
  return <div className={`manual-field ${className}`}>{value}</div>
}
