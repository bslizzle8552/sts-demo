import { CapacityBar } from '../components/CapacityBar'
import { ValueTile } from '../components/ValueTile'
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
            <FlowOverlay />
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

function FlowOverlay() {
  return (
    <svg className="mimic-flow-svg" viewBox="0 0 1716 966" preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="air-flow-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="oil-flow-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <FlowPath
        id="air-intake-flow"
        className="air-flow"
        path="M330 224 H650 Q692 224 692 266 V377"
        count={5}
        duration={1.8}
      />
      <FlowPath
        id="air-discharge-flow"
        className="air-flow"
        path="M885 526 H928 Q962 526 962 492 Q962 469 1000 469 H1137"
        count={4}
        duration={1.5}
      />
      <FlowPath
        id="air-cooler-flow"
        className="air-flow"
        path="M1219 345 V281 Q1219 231 1268 231 H1367"
        count={3}
        duration={1.4}
      />
      <FlowPath
        id="air-outlet-flow"
        className="air-flow"
        path="M1562 370 H1678"
        count={3}
        duration={1.2}
      />
      <FlowPath
        id="oil-sump-filter-flow"
        className="oil-flow"
        path="M1115 665 V807 Q1115 842 1083 842 H967"
        count={3}
        duration={1.7}
      />
      <FlowPath
        id="oil-filter-airend-flow"
        className="oil-flow"
        path="M855 842 H776 Q741 842 741 806 V669"
        count={4}
        duration={1.9}
      />
    </svg>
  )
}

function FlowPath({
  id,
  className,
  path,
  count,
  duration,
}: {
  id: string
  className: 'air-flow' | 'oil-flow'
  path: string
  count: number
  duration: number
}) {
  const offsets = Array.from({ length: count }, (_, index) => -(duration / count) * index)
  return (
    <g className={`flow-path ${className}`}>
      <path id={id} d={path} />
      {offsets.map((offset, index) => (
        <circle key={index} r={className === 'air-flow' ? 6 : 4}>
          <animateMotion dur={`${duration}s`} begin={`${offset}s`} repeatCount="indefinite">
            <mpath href={`#${id}`} />
          </animateMotion>
        </circle>
      ))}
    </g>
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
