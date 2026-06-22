import { useEffect, useState } from 'react'
import type { AppState } from '../types'

interface IOStatusProps {
  state: AppState
  onBack: () => void
  onHome: () => void
}

const lampPositions = [
  { key: 'mainMotorOverload', x: 4.1, y: 29.4 },
  { key: 'fanMotorOverload', x: 4.1, y: 39.9 },
  { key: 'mainAux', x: 4.1, y: 50.4 },
  { key: 'fanAux', x: 4.1, y: 60.9 },
  { key: 'airFilter', x: 4.1, y: 71.4 },
  { key: 'waterPressure', x: 28.9, y: 29.4 },
  { key: 'phaseProtection', x: 28.9, y: 39.9 },
  { key: 'userFault', x: 28.9, y: 50.4 },
  { key: 'userWarn', x: 28.9, y: 60.9 },
  { key: 'userUnload', x: 28.9, y: 71.4 },
  { key: 'remoteStop', x: 53.5, y: 29.4 },
  { key: 'remoteMaster', x: 53.5, y: 39.9 },
  { key: 'inletControlSensor', x: 53.5, y: 50.4 },
  { key: 'dryerFault', x: 53.5, y: 60.9 },
  { key: 'dryerWarning', x: 53.5, y: 71.4 },
  { key: 'estop', x: 78.3, y: 29.4 },
  { key: 'mainMotorOverTemp', x: 78.3, y: 39.9 },
  { key: 'fanMotorOverTemp', x: 78.3, y: 50.4 },
  { key: 'brownOut', x: 78.3, y: 60.9 },
  { key: 'userRunFault', x: 78.3, y: 71.4 },
] as const

export function IOStatus({ state, onBack, onHome }: IOStatusProps) {
  const [now, setNow] = useState(() => new Date())
  const asset = `${import.meta.env.BASE_URL}assets/sts-io-status-manual.png`.replace(/\/{2,}/g, '/')
  const lampState = getLampState(state)

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <div className="manual-reference-screen io-reference-screen">
      <img className="manual-reference-image io-reference-image" src={asset} alt="" />
      {lampPositions.map((lamp) => {
        const tone = lamp.key === 'estop' && state.activeFaults.includes('Emergency stop active') ? 'fault' : lampState[lamp.key] ? 'on' : 'off'
        return <span key={lamp.key} className={`io-status-lamp ${tone}`} style={{ left: `${lamp.x}%`, top: `${lamp.y}%` }} />
      })}
      <button className="io-reference-back" type="button" onClick={onBack} aria-label="Back" />
      <button className="io-reference-home" type="button" onClick={onHome} aria-label="Home" />
      <div className="io-reference-pressure">{state.readings.linePressure.toFixed(0)}psi</div>
      <time className="manual-clock io-reference-clock" dateTime={now.toISOString()}>
        <span>{now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' })}</span>
        <span>{now.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}</span>
      </time>
    </div>
  )
}

function getLampState(state: AppState): Record<(typeof lampPositions)[number]['key'], boolean> {
  const running = !['INITIALIZING', 'MANUALLY STOPPED', 'STANDING BY', 'FAULTED'].includes(state.machineState)
  return {
    mainMotorOverload: false,
    fanMotorOverload: false,
    mainAux: running,
    fanAux: state.readings.fanRunning,
    airFilter: state.activeWarnings.includes('High Air Filter dP'),
    waterPressure: false,
    phaseProtection: true,
    userFault: state.activeFaults.length > 0,
    userWarn: state.activeWarnings.length > 0,
    userUnload: state.machineState === 'RUNNING UNLOADED' || state.machineState === 'UNLOADING',
    remoteStop: true,
    remoteMaster: false,
    inletControlSensor: state.readings.capacity > 5,
    dryerFault: false,
    dryerWarning: false,
    estop: !state.activeFaults.includes('Emergency stop active'),
    mainMotorOverTemp: false,
    fanMotorOverTemp: false,
    brownOut: false,
    userRunFault: state.activeFaults.length > 0,
  }
}
