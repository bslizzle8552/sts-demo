import { CapacityBar } from '../components/CapacityBar'
import { ValueTile } from '../components/ValueTile'
import type { CSSProperties } from 'react'
import type { AppState, ScreenId } from '../types'

interface HomeMimicProps {
  state: AppState
  setScreen: (screen: ScreenId) => void
}

export function HomeMimic({ state, setScreen }: HomeMimicProps) {
  const r = state.readings
  const mimicAsset = `${import.meta.env.BASE_URL}assets/sts-mimic-generated.png`.replace(/\/{2,}/g, '/')
  const running = !['INITIALIZING', 'MANUALLY STOPPED', 'STANDING BY', 'FAULTED'].includes(state.machineState)
  const flowing = running && r.capacity > 0
  return (
    <div className="home-screen">
      <div className="sts-mimic">
        <section className="sts-status-card">
          <StatusField label="State" value={state.machineState} />
          <StatusField label="Mode" value={state.controls.mode} />
          <div className="status-pair">
            <StatusField label="Load" value={r.loadedHours.toFixed(2)} />
            <StatusField label="Run" value={r.runHours.toFixed(2)} />
          </div>
          <div className="status-pair">
            <StatusField label="Starts" value={r.starts} />
            <StatusField label="Cycles" value={r.loadCycles} />
          </div>
          <CapacityBar value={r.capacity} />
          <div className="alarm-icons">
            <button type="button" onClick={() => setScreen(state.activeFaults.length ? 'history' : 'warnings')} className={state.activeFaults.length ? 'fault' : state.activeWarnings.length ? 'warning' : ''}>
              {state.activeFaults.length ? 'FAULT' : state.activeWarnings.length ? 'WARN' : 'OK'}
            </button>
            <button type="button" onClick={() => setScreen('menu')}>MENU</button>
          </div>
        </section>

        <section className="sts-process-card">
          <img className="mimic-asset" src={mimicAsset} alt="" />
          <div className={`mimic-motion-layer ${flowing ? 'flowing' : 'idle'}`} aria-hidden="true">
            <div className="rotor-motion">
              <span className="rotor rotor-a" />
              <span className="rotor rotor-b" />
            </div>
            <FlowTrack className="air-intake" count={4} />
            <FlowTrack className="air-discharge" count={3} />
            <FlowTrack className="air-cooler" count={4} />
            <FlowTrack className="oil-drop" count={3} />
            <FlowTrack className="oil-return" count={5} />
          </div>
          <ValueTile className="temp-readout" label="Discharge Temp" value={r.dischargeTemp.toFixed(0)} unit="F" tone={r.dischargeTemp > 210 ? 'warning' : 'normal'} />
          <ValueTile className="sump-readout" label="Sump Pressure" value={r.sumpPressure.toFixed(0)} unit="psig" />
          <ValueTile className="line-readout" label="Line Pressure" value={r.linePressure.toFixed(0)} unit="psig" />
          <ValueTile className="kw-readout" label="Package kW" value={r.packageKw.toFixed(1)} unit="kW" />
          <ValueTile className="capacity-readout" label="Capacity" value={r.capacity.toFixed(0)} unit="%" />
          <ValueTile className="sep-readout" label="Separator Delta" value={r.separatorDelta.toFixed(1)} unit="psi" tone={r.separatorDelta > 5 ? 'warning' : 'normal'} />
        </section>
      </div>
    </div>
  )
}

function FlowTrack({ className, count }: { className: string; count: number }) {
  return (
    <div className={`flow-track ${className}`}>
      {Array.from({ length: count }, (_, index) => (
        <span key={index} style={{ '--flow-index': index } as CSSProperties} />
      ))}
    </div>
  )
}

function StatusField({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="sts-status-field">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}
