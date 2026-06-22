import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import type { AppState } from '../types'

interface WarningsProps {
  state: AppState
  onBack: () => void
  onHome: () => void
}

const warningIndicators = [
  { key: 'separator-dp', x: 5.5, y: 34.7, active: (state: AppState) => state.activeWarnings.includes('Separator differential high') },
  {
    key: 'compressor-temp-high',
    x: 5.5,
    y: 49.8,
    active: (state: AppState) =>
      state.activeWarnings.includes('High discharge temperature warning') || state.activeFaults.includes('High discharge temperature fault'),
  },
  { key: 'sequence-comm', x: 54.8, y: 42.2, active: (state: AppState) => state.activeFaults.includes('UI communication fault') },
  { key: 'low-line-pressure', x: 54.8, y: 72.4, active: (state: AppState) => state.activeWarnings.includes('Low line pressure') },
]

export function Warnings({ state, onBack, onHome }: WarningsProps) {
  const [now, setNow] = useState(() => new Date())
  const asset = `${import.meta.env.BASE_URL}assets/sts-warnings-manual.png`.replace(/\/{2,}/g, '/')

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <div className="manual-reference-screen warnings-reference-screen">
      <img className="manual-reference-image warnings-reference-image" src={asset} alt="" />
      <div className="warnings-fixed-speed-row">Low Line Pressure</div>
      {warningIndicators
        .filter((indicator) => indicator.active(state))
        .map((indicator) => (
          <span
            key={indicator.key}
            className="warnings-active-indicator"
            style={
              {
                left: `${indicator.x}%`,
                top: `${indicator.y}%`,
              } as CSSProperties
            }
          />
        ))}
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
