import { machineProfile } from '../data/machineProfile'
import { useEffect, useState } from 'react'
import type { AppState, HomeScreenId } from '../types'
import { ManualInfoScreen, type ManualInfoField } from './ManualInfoScreen'

export function ControllerSoftware({ linePressure, onBack, onHome }: { linePressure: number; onBack: () => void; onHome: () => void }) {
  const fields: ManualInfoField[] = [
    { key: 'io-serial', value: 'IO2-7509S-0142', x: 47.9, y: 32.0, width: 17.4, className: 'software-info-field' },
    { key: 'io-hardware', value: '02250243-744', x: 47.9, y: 39.0, width: 17.4, className: 'software-info-field' },
    { key: 'io-software-part', value: '1001-1169', x: 47.9, y: 46.0, width: 17.4, className: 'software-info-field' },
    { key: 'io-software-version', value: 'R02', x: 47.9, y: 53.1, width: 17.4, className: 'software-info-field' },
    { key: 'io-setup-date', value: '6/10/2022', x: 47.9, y: 74.0, width: 17.4, className: 'software-info-field' },
    { key: 'display-serial', value: 'DSP-TRAIN-0001', x: 72.0, y: 32.0, width: 22.7, className: 'software-info-field' },
    { key: 'display-hardware', value: 'STS Controller 2.0', x: 72.0, y: 39.0, width: 22.7, className: 'software-info-field' },
    { key: 'display-software-part', value: '1003-0042', x: 72.0, y: 46.0, width: 22.7, className: 'software-info-field' },
    { key: 'display-software-version', value: 'R02', x: 72.0, y: 53.1, width: 22.7, className: 'software-info-field' },
    { key: 'display-setup-date', value: '6/10/2022', x: 72.0, y: 74.0, width: 22.7, className: 'software-info-field' },
  ]

  return (
    <ManualInfoScreen
      assetName="sts-controller-software-manual.png"
      fields={fields}
      linePressure={linePressure}
      onBack={onBack}
      onHome={onHome}
    />
  )
}

export function LoginScreen({ onBack, onHome }: { onBack: () => void; onHome: () => void }) {
  const [view, setView] = useState<'select' | 'keyboard'>('select')
  const selectAsset = `${import.meta.env.BASE_URL}assets/sts-login-select-manual.png`.replace(/\/{2,}/g, '/')
  const keyboardAsset = `${import.meta.env.BASE_URL}assets/sts-login-keyboard-manual.png`.replace(/\/{2,}/g, '/')

  return (
    <div className={`manual-reference-screen login-reference-screen ${view}`}>
      {view === 'select' ? (
        <div className="login-select-art">
          <img src={selectAsset} alt="" />
          <button className="login-hotspot login-back" type="button" onClick={onBack} aria-label="Back" />
          <button className="login-hotspot login-home" type="button" onClick={onHome} aria-label="Home" />
          <button className="login-hotspot login-distributor" type="button" onClick={() => setView('keyboard')} aria-label="Distributor" />
          <button className="login-hotspot login-technician" type="button" onClick={() => setView('keyboard')} aria-label="Technician" />
          <button className="login-hotspot login-ok" type="button" onClick={() => setView('keyboard')} aria-label="OK" />
          <button className="login-hotspot login-cancel" type="button" onClick={onBack} aria-label="Cancel" />
        </div>
      ) : (
        <div className="login-keyboard-art">
          <img src={keyboardAsset} alt="" />
          <button className="login-hotspot login-key-back" type="button" onClick={() => setView('select')} aria-label="Back" />
          <button className="login-hotspot login-key-enter" type="button" onClick={onBack} aria-label="Enter" />
          <button className="login-hotspot login-key-clear" type="button" onClick={() => setView('select')} aria-label="Clr" />
        </div>
      )}
    </div>
  )
}

const digitalIoRows = [17.7, 26.1, 34.5, 42.9, 51.3, 59.7, 68.1, 76.5]
const digitalInputColumns = [
  { start: 1, x: 2.3 },
  { start: 9, x: 14.8 },
  { start: 17, x: 27.3 },
  { start: 25, x: 39.8 },
]
const digitalOutputColumns = [
  { start: 1, x: 52.1 },
  { start: 9, x: 64.6 },
  { start: 17, x: 77.2 },
  { start: 25, x: 89.8 },
]

const digitalIoDetailLamps = [
  ...digitalInputColumns.flatMap((column) =>
    digitalIoRows.map((y, index) => ({
      key: `IN${column.start + index}`,
      x: column.x,
      y,
    })),
  ),
  ...digitalOutputColumns.flatMap((column) =>
    digitalIoRows.map((y, index) => ({
      key: `OUT${column.start + index}`,
      x: column.x,
      y,
    })),
  ),
]

type DigitalLampTone = 'off' | 'on' | 'warning' | 'fault'

export function DigitalIODetails({ state, onBack, onHome }: { state: AppState; onBack: () => void; onHome: () => void }) {
  const lampTones = getDigitalIoDetailLampTones(state)

  return (
    <ManualInfoScreen
      assetName="sts-digital-io-details-manual.png"
      fields={[]}
      linePressure={state.readings.linePressure}
      onBack={onBack}
      onHome={onHome}
      className="digital-io-details-screen"
    >
      {digitalIoDetailLamps.map((lamp) => {
        const tone = lampTones[lamp.key] ?? 'off'
        return tone === 'off' ? null : (
          <span key={lamp.key} className={`digital-detail-lamp ${tone}`} style={{ left: `${lamp.x}%`, top: `${lamp.y}%` }} />
        )
      })}
    </ManualInfoScreen>
  )
}

function getDigitalIoDetailLampTones(state: AppState): Record<string, DigitalLampTone> {
  const running = isControllerRunning(state)
  const loaded = state.machineState === 'LOADING' || state.machineState === 'LOADED & MODULATING' || state.machineState === 'FULLY LOADED'
  const unloaded = state.machineState === 'UNLOADING' || state.machineState === 'RUNNING UNLOADED'
  const hasWarning = state.activeWarnings.length > 0
  const hasFault = state.activeFaults.length > 0
  const estopActive = state.activeFaults.includes('Emergency stop active')
  const communicationOk = !state.flags.communicationFault
  const drainWindow = Math.max(1, state.controls.drainInterval)
  const drainPulse = running && state.controls.drainTime > 0 && state.simTime % drainWindow < state.controls.drainTime

  return {
    IN3: running ? 'on' : 'off',
    IN4: state.readings.fanRunning ? 'on' : 'off',
    IN5: state.activeWarnings.some((warning) => warning.toLowerCase().includes('filter')) ? 'warning' : 'off',
    IN6: 'on',
    IN7: hasFault ? 'fault' : 'off',
    IN8: hasWarning ? 'warning' : 'off',
    IN9: unloaded ? 'on' : 'off',
    IN10: 'on',
    IN12: state.readings.capacity > 5 ? 'on' : 'off',
    IN15: estopActive ? 'fault' : 'on',
    IN16: 'on',
    IN17: communicationOk ? 'on' : 'fault',
    IN18: state.controls.mode === 'AUTOMATIC' ? 'on' : 'off',
    IN19: state.controls.mode === 'MANUAL' ? 'on' : 'off',
    IN20: state.readings.linePressure > 0 ? 'on' : 'off',
    IN21: loaded ? 'on' : 'off',
    OUT1: running ? 'on' : 'off',
    OUT2: state.readings.fanRunning ? 'on' : 'off',
    OUT3: loaded ? 'on' : 'off',
    OUT4: drainPulse ? 'on' : 'off',
    OUT5: hasWarning ? 'warning' : 'off',
    OUT6: hasFault ? 'fault' : 'off',
    OUT7: state.controls.mode !== 'OFF' ? 'on' : 'off',
    OUT8: !hasFault ? 'on' : 'off',
    OUT9: running ? 'on' : 'off',
    OUT10: unloaded ? 'on' : 'off',
    OUT11: loaded ? 'on' : 'off',
    OUT12: communicationOk ? 'on' : 'fault',
    OUT17: estopActive ? 'fault' : 'on',
  }
}

function isControllerRunning(state: AppState) {
  return !['INITIALIZING', 'MANUALLY STOPPED', 'STANDING BY', 'FAULTED'].includes(state.machineState)
}

export function AnalogDetails({ state, onBack, onHome }: { state: AppState; onBack: () => void; onHome: () => void }) {
  const r = state.readings
  const fields: ManualInfoField[] = [
    { key: 'an-in1', value: `${r.linePressure.toFixed(1)} psi`, x: 11.6, y: 17.4, width: 10.5, height: 3.5, className: 'analog-detail-field' },
    { key: 'an-in2', value: `${r.sumpPressure.toFixed(1)} psi`, x: 11.6, y: 25.8, width: 10.5, height: 3.5, className: 'analog-detail-field' },
    { key: 'an-in3', value: `${r.dischargeTemp.toFixed(1)} F`, x: 11.6, y: 34.2, width: 10.5, height: 3.5, className: 'analog-detail-field' },
    { key: 'an-in4', value: `${r.fluidTemp.toFixed(1)} F`, x: 11.6, y: 42.6, width: 10.5, height: 3.5, className: 'analog-detail-field' },
    { key: 'an-in10', value: `${r.machineCurrent.toFixed(1)} A`, x: 35.0, y: 17.4, width: 10.5, height: 3.5, className: 'analog-detail-field' },
    { key: 'an-in11', value: `${r.separatorDelta.toFixed(1)} psi`, x: 35.0, y: 25.8, width: 10.5, height: 3.5, className: 'analog-detail-field' },
    { key: 'an-out1', value: `${r.spiralValve.toFixed(0)}%`, x: 86.9, y: 17.4, width: 10.0, height: 3.5, className: 'analog-detail-field' },
    { key: 'an-out2', value: `${r.capacity.toFixed(0)}%`, x: 86.9, y: 25.8, width: 10.0, height: 3.5, className: 'analog-detail-field' },
  ]

  return (
    <ManualInfoScreen
      assetName="sts-analog-details-manual.png"
      fields={fields}
      linePressure={r.linePressure}
      onBack={onBack}
      onHome={onHome}
    />
  )
}

export function SensorLogRate({ linePressure, onBack, onHome }: { linePressure: number; onBack: () => void; onHome: () => void }) {
  const [sampleRate, setSampleRate] = useState('0')
  const [samplePickerOpen, setSamplePickerOpen] = useState(false)
  const modalAsset = `${import.meta.env.BASE_URL}assets/sts-sample-rate-modal-manual.png`.replace(/\/{2,}/g, '/')
  const fields: ManualInfoField[] = [
    { key: 'sample-rate', value: sampleRate, x: 43.0, y: 51.0, width: 24.2, height: 9.5, className: 'manual-box-field sensor-rate-field' },
  ]
  const sampleRates = [
    { value: '1 second', x: 9.0, y: 21.0, width: 33.0, height: 11.0 },
    { value: '10 second', x: 9.0, y: 35.0, width: 33.0, height: 11.0 },
    { value: '1 minute', x: 9.0, y: 49.5, width: 33.0, height: 11.0 },
    { value: '2 minutes', x: 54.0, y: 21.0, width: 35.0, height: 11.0 },
    { value: '5 minutes', x: 54.0, y: 35.0, width: 35.0, height: 11.0 },
    { value: '10 minutes', x: 54.0, y: 49.5, width: 35.0, height: 11.0 },
  ]

  return (
    <ManualInfoScreen
      assetName="sts-sensor-log-rate-manual.png"
      fields={fields}
      linePressure={linePressure}
      onBack={onBack}
      onHome={onHome}
      className="sensor-log-rate-screen"
    >
      <button className="sensor-rate-hotspot" type="button" onClick={() => setSamplePickerOpen(true)} aria-label="Sample Rate" />
      {samplePickerOpen && (
        <div className="sample-rate-modal">
          <img src={modalAsset} alt="" />
          {sampleRates.map((rate) => (
            <button
              key={rate.value}
              type="button"
              aria-label={rate.value}
              className="sample-rate-option"
              style={{ left: `${rate.x}%`, top: `${rate.y}%`, width: `${rate.width}%`, height: `${rate.height}%` }}
              onClick={() => setSampleRate(rate.value)}
            />
          ))}
          <button className="sample-rate-ok" type="button" onClick={() => setSamplePickerOpen(false)} aria-label="OK" />
          <button className="sample-rate-cancel" type="button" onClick={() => setSamplePickerOpen(false)} aria-label="Cancel" />
        </div>
      )}
    </ManualInfoScreen>
  )
}

export function DisplayInformation({ linePressure, onBack, onHome }: { linePressure: number; onBack: () => void; onHome: () => void }) {
  const fields: ManualInfoField[] = [
    { key: 'model', value: 'STS Controller 2.0', x: 22.4, y: 31.4, width: 25.0, height: 4.0, className: 'display-info-field' },
    { key: 'version', value: '1003-0042 R02', x: 22.4, y: 38.6, width: 25.0, height: 4.0, className: 'display-info-field' },
    { key: 'serial', value: 'DSP-TRAIN-0001', x: 22.4, y: 45.8, width: 25.0, height: 4.0, className: 'display-info-field' },
    { key: 'engine', value: machineProfile.model, x: 22.4, y: 53.0, width: 25.0, height: 4.0, className: 'display-info-field' },
    { key: 'cargo', value: `${machineProfile.motorHp}HP ${machineProfile.cooling}`, x: 22.4, y: 60.2, width: 25.0, height: 4.0, className: 'display-info-field' },
  ]

  return (
    <ManualInfoScreen
      assetName="sts-display-info-manual.png"
      fields={fields}
      linePressure={linePressure}
      onBack={onBack}
      onHome={onHome}
    />
  )
}

const homeScreenOptions: HomeScreenId[] = ['mimic', 'multigauge', 'analog']
const homeScreenLabels: Record<HomeScreenId, string> = {
  mimic: 'Mimic',
  multigauge: 'Multi Gauge',
  analog: 'Analog/Digital',
}

export function UserPreferences({
  linePressure,
  homeScreen,
  setHomeScreen,
  onBack,
  onHome,
}: {
  linePressure: number
  homeScreen: HomeScreenId
  setHomeScreen: (screen: HomeScreenId) => void
  onBack: () => void
  onHome: () => void
}) {
  const fields: ManualInfoField[] = [
    { key: 'pressure', value: 'psi', x: 38.5, y: 17.0, width: 49.9, height: 8.6, className: 'manual-box-field preference-field' },
    { key: 'temperature', value: 'Fahrenheit', x: 38.5, y: 27.8, width: 49.9, height: 8.6, className: 'manual-box-field preference-field' },
    { key: 'language', value: 'English', x: 38.5, y: 38.4, width: 49.9, height: 8.6, className: 'manual-box-field preference-field' },
    { key: 'home-screen', value: homeScreenLabels[homeScreen], x: 38.5, y: 49.2, width: 49.9, height: 8.6, className: 'manual-box-field preference-field' },
  ]
  const nextHomeScreen = () => {
    const currentIndex = homeScreenOptions.indexOf(homeScreen)
    setHomeScreen(homeScreenOptions[(currentIndex + 1) % homeScreenOptions.length])
  }

  return (
    <ManualInfoScreen
      assetName="sts-user-preferences-manual.png"
      fields={fields}
      linePressure={linePressure}
      onBack={onBack}
      onHome={onHome}
    >
      <button className="preference-home-screen-hotspot" type="button" onClick={nextHomeScreen} aria-label="Home Screen" />
    </ManualInfoScreen>
  )
}

export function Scheduling({ linePressure, onBack, onHome }: { linePressure: number; onBack: () => void; onHome: () => void }) {
  const [enabled, setEnabled] = useState(false)
  const scheduleRows = [
    { time: '7:00', sun: '', mon: 'ON', tue: 'ON', wed: 'ON', thu: 'ON', fri: 'ON', sat: '', action: 'Pressure', pressure: '125' },
    { time: '12:00', sun: '', mon: 'ON', tue: 'ON', wed: 'ON', thu: 'ON', fri: 'ON', sat: '', action: 'Normal', pressure: '' },
    { time: '17:00', sun: '', mon: 'ON', tue: 'ON', wed: 'ON', thu: 'ON', fri: 'ON', sat: '', action: 'Unload', pressure: '' },
    { time: '6:00', sun: 'ON', mon: '', tue: '', wed: '', thu: '', fri: '', sat: 'ON', action: 'Pressure', pressure: '118' },
  ]
  const scheduleColumns = [
    { key: 'time', x: 0.1, width: 10.2 },
    { key: 'sun', x: 11.3, width: 7.2 },
    { key: 'mon', x: 19.6, width: 7.2 },
    { key: 'tue', x: 27.9, width: 7.2 },
    { key: 'wed', x: 36.2, width: 7.2 },
    { key: 'thu', x: 44.6, width: 7.2 },
    { key: 'fri', x: 52.9, width: 7.2 },
    { key: 'sat', x: 61.2, width: 7.2 },
    { key: 'action', x: 69.8, width: 14.1 },
    { key: 'pressure', x: 84.9, width: 14.4 },
  ] as const
  const scheduleRowTops = [24.4, 33.4, 42.4, 51.4]
  const fields: ManualInfoField[] = scheduleRows.flatMap((row, rowIndex) =>
    scheduleColumns.flatMap((column) => {
      const value = row[column.key]
      return value
        ? [
            {
              key: `schedule-${rowIndex}-${column.key}`,
              value,
              x: column.x,
              y: scheduleRowTops[rowIndex],
              width: column.width,
              height: 7.3,
              className: 'manual-box-field schedule-cell-field',
            },
          ]
        : []
    }),
  )

  return (
    <ManualInfoScreen
      assetName="sts-schedule-manual.png"
      fields={fields}
      linePressure={linePressure}
      onBack={onBack}
      onHome={onHome}
      className={enabled ? 'schedule-manual-screen schedule-enabled' : 'schedule-manual-screen'}
    >
      <button className="schedule-write-hotspot" type="button" aria-label="Write schedule" />
      <button className="schedule-enable-hotspot" type="button" onClick={() => setEnabled((value) => !value)} aria-label="Enable schedule" aria-pressed={enabled} />
    </ManualInfoScreen>
  )
}

export function EModeSettings({ state, onBack, onHome }: { state: AppState; onBack: () => void; onHome: () => void }) {
  return (
    <ManualInfoScreen
      assetName="sts-emode-manual.png"
      fields={[]}
      linePressure={state.readings.linePressure}
      onBack={onBack}
      onHome={onHome}
    />
  )
}

export function SpiralValveStatus({ state, onBack, onHome }: { state: AppState; onBack: () => void; onHome: () => void }) {
  const fields: ManualInfoField[] = [
    { key: 'cfm-delivery', value: `${state.readings.capacity.toFixed(0)}%`, x: 51.7, y: 31.5, width: 22.2, height: 4.0, className: 'spiral-status-field' },
    { key: 'valve-position', value: `${state.readings.spiralValve.toFixed(0)}%`, x: 51.7, y: 38.7, width: 22.2, height: 4.0, className: 'spiral-status-field' },
    { key: 'warning-value', value: '0h', x: 51.7, y: 45.9, width: 22.2, height: 4.0, className: 'spiral-status-field' },
    { key: 'ready-flags', value: state.readings.capacity > 0 ? 'READY / RUN' : 'READY', x: 51.7, y: 53.1, width: 22.2, height: 4.0, className: 'spiral-status-field' },
    { key: 'system-warning', value: '0h', x: 51.7, y: 60.3, width: 22.2, height: 4.0, className: 'spiral-status-field' },
    { key: 'operation-warning', value: '0h', x: 51.7, y: 67.5, width: 22.2, height: 4.0, className: 'spiral-status-field' },
  ]

  return (
    <ManualInfoScreen
      assetName="sts-spiral-valve-status-manual.png"
      fields={fields}
      linePressure={state.readings.linePressure}
      onBack={onBack}
      onHome={onHome}
    />
  )
}

export function RemoteSettings({ state, onBack, onHome }: { state: AppState; onBack: () => void; onHome: () => void }) {
  const fields: ManualInfoField[] = [
    { key: 'mode-switch', value: 'Panel', x: 49.9, y: 36.2, width: 24.4, height: 6.5, className: 'manual-box-field remote-field' },
    { key: 'mode-selection', value: state.controls.mode === 'MANUAL' ? 'Local' : 'Local', x: 49.9, y: 44.6, width: 24.4, height: 6.7, className: 'manual-box-field remote-field' },
    { key: 'operation-signal', value: 'Level', x: 49.9, y: 53.2, width: 24.4, height: 6.7, className: 'manual-box-field remote-field' },
    { key: 'fault-mode', value: 'Local', x: 49.9, y: 61.7, width: 24.4, height: 6.7, className: 'manual-box-field remote-field' },
  ]

  return (
    <ManualInfoScreen
      assetName="sts-remote-manual.png"
      fields={fields}
      linePressure={state.readings.linePressure}
      onBack={onBack}
      onHome={onHome}
    />
  )
}

export function IpiSettings({ linePressure, onBack, onHome }: { linePressure: number; onBack: () => void; onHome: () => void }) {
  const fields: ManualInfoField[] = [
    { key: 'ipi-enabled', value: 'OFF', x: 21.8, y: 39.4, width: 16.6, height: 7.5, className: 'manual-box-field ipi-field' },
    { key: 'ipi-time', value: '5', x: 69.5, y: 39.4, width: 16.5, height: 7.5, className: 'manual-box-field ipi-field' },
    { key: 'waiting', value: '15', x: 69.5, y: 54.6, width: 16.5, height: 7.6, className: 'manual-box-field ipi-field' },
  ]

  return (
    <ManualInfoScreen
      assetName="sts-ipi-manual.png"
      fields={fields}
      linePressure={linePressure}
      onBack={onBack}
      onHome={onHome}
    />
  )
}

export function TimeDateSettings({ linePressure, onBack, onHome }: { linePressure: number; onBack: () => void; onHome: () => void }) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(interval)
  }, [])

  const hour12 = ((now.getHours() + 11) % 12) + 1
  const fields: ManualInfoField[] = [
    { key: 'date-month', value: String(now.getMonth() + 1), x: 31.2, y: 56.8, width: 4.8, height: 7.5, className: 'manual-box-field time-date-box-field' },
    { key: 'date-day', value: String(now.getDate()), x: 39.3, y: 56.8, width: 4.6, height: 7.5, className: 'manual-box-field time-date-box-field' },
    { key: 'date-year', value: String(now.getFullYear()), x: 47.2, y: 56.8, width: 4.8, height: 7.5, className: 'manual-box-field time-date-box-field' },
    { key: 'time-hour', value: String(hour12), x: 31.2, y: 67.1, width: 4.8, height: 7.5, className: 'manual-box-field time-date-box-field' },
    { key: 'time-minute', value: String(now.getMinutes()).padStart(2, '0'), x: 39.3, y: 67.1, width: 4.6, height: 7.3, className: 'manual-box-field time-date-box-field' },
    { key: 'time-second', value: String(now.getSeconds()).padStart(2, '0'), x: 47.1, y: 67.1, width: 4.9, height: 7.5, className: 'manual-box-field time-date-box-field' },
    { key: 'time-ampm', value: now.getHours() >= 12 ? 'PM' : 'AM', x: 55.3, y: 67.3, width: 4.6, height: 7.1, className: 'manual-box-field time-date-box-field' },
  ]

  return (
    <ManualInfoScreen
      assetName="sts-time-date-manual.png"
      fields={fields}
      linePressure={linePressure}
      onBack={onBack}
      onHome={onHome}
    />
  )
}

export function ModbusSettings({ linePressure, onBack, onHome }: { linePressure: number; onBack: () => void; onHome: () => void }) {
  const [baudRate, setBaudRate] = useState('19200')
  const [baudPickerOpen, setBaudPickerOpen] = useState(false)
  const baudAsset = `${import.meta.env.BASE_URL}assets/sts-baud-rate-modal-manual.png`.replace(/\/{2,}/g, '/')
  const fields: ManualInfoField[] = [
    { key: 'slave-address', value: '1', x: 46.5, y: 22.9, width: 16.1, height: 9.0, className: 'manual-box-field modbus-field' },
    { key: 'baud-rate', value: baudRate, x: 46.5, y: 41.9, width: 16.0, height: 8.9, className: 'manual-box-field modbus-field' },
    { key: 'parity', value: 'None', x: 46.5, y: 60.6, width: 16.0, height: 9.0, className: 'manual-box-field modbus-field' },
  ]
  const baudOptions = [
    { value: '1200', x: 17.5, y: 28.0 },
    { value: '2400', x: 17.5, y: 41.2 },
    { value: '4800', x: 17.5, y: 54.2 },
    { value: '9600', x: 17.5, y: 67.5 },
    { value: '14400', x: 43.8, y: 28.0 },
    { value: '19200', x: 43.8, y: 41.2 },
    { value: '38400', x: 43.8, y: 54.2 },
    { value: '57600', x: 43.8, y: 67.5 },
    { value: '115200', x: 70.6, y: 28.0 },
    { value: '230400', x: 70.6, y: 41.2 },
    { value: '460800', x: 70.6, y: 54.2 },
    { value: '921600', x: 70.6, y: 67.5 },
  ]

  return (
    <ManualInfoScreen
      assetName="sts-modbus-manual.png"
      fields={fields}
      linePressure={linePressure}
      onBack={onBack}
      onHome={onHome}
    >
      <button className="modbus-baud-hotspot" type="button" onClick={() => setBaudPickerOpen(true)} aria-label="Baud Rate" />
      {baudPickerOpen && (
        <div className="baud-rate-modal">
          <img src={baudAsset} alt="" />
          {baudOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className="baud-rate-option"
              style={{ left: `${option.x}%`, top: `${option.y}%` }}
              onClick={() => setBaudRate(option.value)}
              aria-label={option.value}
            />
          ))}
          <button className="baud-rate-ok" type="button" onClick={() => setBaudPickerOpen(false)} aria-label="OK" />
          <button className="baud-rate-cancel" type="button" onClick={() => setBaudPickerOpen(false)} aria-label="Cancel" />
        </div>
      )}
    </ManualInfoScreen>
  )
}

export function NetworkingSettings({ linePressure, onBack, onHome }: { linePressure: number; onBack: () => void; onHome: () => void }) {
  const networkRows = [
    { key: 'ip', y: 25.3, values: ['192', '168', '1', '42'] },
    { key: 'subnet', y: 35.9, values: ['255', '255', '255', '0'] },
    { key: 'name-server', y: 46.4, values: ['192', '168', '1', '1'] },
    { key: 'gateway', y: 57.0, values: ['192', '168', '1', '1'] },
  ]
  const networkColumns = [32.8, 42.8, 52.8, 62.8]
  const fields: ManualInfoField[] = networkRows.flatMap((row) =>
    row.values.map((value, columnIndex) => ({
      key: `${row.key}-${columnIndex}`,
      value,
      x: networkColumns[columnIndex],
      y: row.y,
      width: 8.4,
      height: 9.1,
      className: 'manual-box-field network-octet-field',
    })),
  )

  return (
    <ManualInfoScreen
      assetName="sts-networking-manual.png"
      fields={fields}
      linePressure={linePressure}
      onBack={onBack}
      onHome={onHome}
      className="networking-manual-screen"
    >
      <button className="networking-write-hotspot" type="button" aria-label="Write Value" />
    </ManualInfoScreen>
  )
}

export function CurrentTransducerSettings({ state, onBack, onHome }: { state: AppState; onBack: () => void; onHome: () => void }) {
  const fields: ManualInfoField[] = [
    { key: 'low-signal', value: '0.50', x: 33.2, y: 27.5, width: 16.4, height: 6.4, className: 'manual-box-field' },
    { key: 'low-current', value: '4.00', x: 33.2, y: 35.9, width: 16.4, height: 6.4, className: 'manual-box-field' },
    { key: 'high-signal', value: '4.50', x: 75.0, y: 27.5, width: 16.4, height: 6.4, className: 'manual-box-field' },
    { key: 'high-current', value: machineProfile.packageAmpsAirCooled[460].toFixed(1), x: 75.0, y: 35.9, width: 16.4, height: 6.4, className: 'manual-box-field' },
  ]

  return (
    <ManualInfoScreen
      assetName="sts-current-transducer-manual.png"
      fields={fields}
      linePressure={state.readings.linePressure}
      onBack={onBack}
      onHome={onHome}
    />
  )
}

export function AnalogZeroTrim({ state, onBack, onHome }: { state: AppState; onBack: () => void; onHome: () => void }) {
  const zeroTrimColumns = [
    { start: 1, x: 16.0, count: 7 },
    { start: 8, x: 48.5, count: 7 },
    { start: 15, x: 81.0, count: 3 },
  ]
  const zeroTrimRows = [15.4, 26.4, 37.6, 48.7, 59.8, 70.8, 82.0]
  const fields: ManualInfoField[] = zeroTrimColumns.flatMap((column) =>
    zeroTrimRows.slice(0, column.count).map((y, index) => ({
      key: column.start + index === 17 ? 'separator-dp' : `ain${column.start + index}`,
      value: '0.0',
      x: column.x,
      y,
      width: 7.8,
      height: 8.2,
      className: 'manual-box-field zero-trim-field',
    })),
  )

  return (
    <ManualInfoScreen
      assetName="sts-analog-zero-trims-manual.png"
      fields={fields}
      linePressure={state.readings.linePressure}
      onBack={onBack}
      onHome={onHome}
      className="analog-zero-trim-screen"
    />
  )
}

export function InitializationScreen({ state, onBack, onHome }: { state: AppState; onBack: () => void; onHome: () => void }) {
  const fields: ManualInfoField[] = [
    { key: 'model', value: 'SN7509S', x: 4.8, y: 24.4, width: 12.6, height: 6.2, className: 'initialization-field' },
    { key: 'power', value: `${machineProfile.motorHp}HP`, x: 22.8, y: 24.4, width: 12.4, height: 6.2, className: 'initialization-field' },
    { key: 'pressure', value: `${machineProfile.fullLoadOperatingPressure}PSI`, x: 40.6, y: 24.4, width: 12.4, height: 6.2, className: 'initialization-field' },
    { key: 'modulation', value: machineProfile.modulationCode, x: 58.5, y: 24.4, width: 12.4, height: 6.2, className: 'initialization-field' },
    { key: 'starter', value: machineProfile.starter, x: 76.4, y: 24.4, width: 12.4, height: 6.2, className: 'initialization-field' },
    { key: 'hertz', value: `${machineProfile.frequencyHz}`, x: 4.8, y: 37.4, width: 12.6, height: 6.2, className: 'initialization-field' },
    { key: 'cooling', value: 'AC', x: 22.8, y: 37.4, width: 12.4, height: 6.2, className: 'initialization-field' },
    { key: 'volts', value: `${machineProfile.voltage}`, x: 40.6, y: 37.4, width: 12.4, height: 6.2, className: 'initialization-field' },
    { key: 'dryer', value: 'NONE', x: 58.5, y: 37.4, width: 12.4, height: 6.2, className: 'initialization-field' },
  ]

  return (
    <ManualInfoScreen
      assetName="sts-initialization-manual.png"
      fields={fields}
      linePressure={state.readings.linePressure}
      onBack={onBack}
      onHome={onHome}
    />
  )
}

export function RegisterScreen({ state, onBack, onHome }: { state: AppState; onBack: () => void; onHome: () => void }) {
  const fields: ManualInfoField[] = [
    { key: 'address', value: '0', x: 50.0, y: 28.3, width: 16.2, height: 8.5, className: 'manual-box-field config-box-field' },
    { key: 'value', value: '0', x: 50.0, y: 46.2, width: 16.2, height: 8.5, className: 'manual-box-field config-box-field' },
  ]

  return (
    <ManualInfoScreen
      assetName="sts-register-manual.png"
      fields={fields}
      linePressure={state.readings.linePressure}
      onBack={onBack}
      onHome={onHome}
    />
  )
}

type SignalAddressKey =
  | 'general-fault'
  | 'general-warning'
  | 'general-runtime-fault'
  | 'general-runtime-warning'
  | 'remote-stop'
  | 'remote-master'
  | 'remote-unload'
  | 'dryer-warning'
  | 'dryer-fault'
  | 'phase-motor-fault'
  | 'digital-output-7'
  | 'digital-output-8'
  | 'digital-output-9'

const signalAddressFields: Array<{ key: SignalAddressKey; value: string; x: number; y: number; width: number; height: number }> = [
  { key: 'general-fault', value: 'Disabled', x: 30.0, y: 15.2, width: 19.4, height: 8.7 },
  { key: 'general-warning', value: 'Disabled', x: 30.0, y: 24.4, width: 19.4, height: 8.7 },
  { key: 'general-runtime-fault', value: 'Disabled', x: 30.0, y: 33.5, width: 19.4, height: 8.7 },
  { key: 'general-runtime-warning', value: 'Disabled', x: 30.0, y: 42.6, width: 19.4, height: 8.7 },
  { key: 'remote-stop', value: 'Disabled', x: 30.0, y: 51.7, width: 19.4, height: 8.7 },
  { key: 'remote-master', value: 'Disabled', x: 30.0, y: 60.8, width: 19.4, height: 8.7 },
  { key: 'remote-unload', value: 'Disabled', x: 30.0, y: 69.9, width: 19.4, height: 8.7 },
  { key: 'dryer-warning', value: 'Disabled', x: 30.0, y: 79.0, width: 19.4, height: 8.7 },
  { key: 'dryer-fault', value: 'Disabled', x: 79.3, y: 15.2, width: 18.8, height: 8.7 },
  { key: 'phase-motor-fault', value: 'Disabled', x: 79.3, y: 24.4, width: 18.8, height: 8.7 },
  { key: 'digital-output-7', value: 'Disabled', x: 79.3, y: 60.8, width: 18.8, height: 8.7 },
  { key: 'digital-output-8', value: 'Disabled', x: 79.3, y: 69.9, width: 18.8, height: 8.7 },
  { key: 'digital-output-9', value: 'Disabled', x: 79.3, y: 79.0, width: 18.8, height: 8.7 },
]

const signalAddressOptions = [
  { value: 'On', x: 1.5, y: 12.0 },
  { value: 'Off', x: 1.5, y: 22.9 },
  { value: 'DIN7 ON', x: 1.5, y: 33.8 },
  { value: 'DIN8 ON', x: 1.5, y: 44.6 },
  { value: 'DIN9 ON', x: 1.5, y: 55.5 },
  { value: 'DIN10 ON', x: 1.5, y: 66.4 },
  { value: 'DIN7 OFF', x: 26.3, y: 12.0 },
  { value: 'DIN8 OFF', x: 26.3, y: 22.9 },
  { value: 'DIN9 OFF', x: 26.3, y: 33.8 },
  { value: 'DIN11 OFF', x: 26.3, y: 44.6 },
  { value: 'MB Remote On', x: 26.3, y: 55.5 },
  { value: 'MB Timer1 On', x: 26.3, y: 66.4 },
  { value: 'MB Timer2 On', x: 51.1, y: 12.0 },
  { value: 'MB Timer3 On', x: 51.1, y: 22.9 },
  { value: 'MB Remote Off', x: 51.1, y: 33.8 },
  { value: 'MB Timer1 Off', x: 51.1, y: 44.6 },
  { value: 'MB Timer2 Off', x: 51.1, y: 55.5 },
  { value: 'MB Timer3 Off', x: 51.1, y: 66.4 },
  { value: 'DIN11 ON', x: 75.9, y: 12.0 },
  { value: 'DIN12 ON', x: 75.9, y: 22.9 },
  { value: 'DIN10 OFF', x: 75.9, y: 33.8 },
  { value: 'DIN12 OFF', x: 75.9, y: 44.6 },
  { value: 'Disabled', x: 75.9, y: 55.5 },
]

export function SignalAddressSettings({ state, onBack, onHome }: { state: AppState; onBack: () => void; onHome: () => void }) {
  const [signalValues, setSignalValues] = useState<Record<SignalAddressKey, string>>(() =>
    signalAddressFields.reduce(
      (values, field) => ({
        ...values,
        [field.key]: field.value,
      }),
      {} as Record<SignalAddressKey, string>,
    ),
  )
  const [activeSignal, setActiveSignal] = useState<SignalAddressKey | null>(null)
  const [pendingSignal, setPendingSignal] = useState('Disabled')
  const modalAsset = `${import.meta.env.BASE_URL}assets/sts-signal-address-options-manual.png`.replace(/\/{2,}/g, '/')
  const fields: ManualInfoField[] = signalAddressFields.map((field) => ({
    ...field,
    value: signalValues[field.key],
    className: 'manual-box-field signal-address-field',
  }))

  const openSignalPicker = (key: SignalAddressKey) => {
    setActiveSignal(key)
    setPendingSignal(signalValues[key])
  }

  const commitSignalPicker = () => {
    if (activeSignal) {
      setSignalValues((values) => ({ ...values, [activeSignal]: pendingSignal }))
    }
    setActiveSignal(null)
  }

  return (
    <ManualInfoScreen
      assetName="sts-signal-address-manual.png"
      fields={fields}
      linePressure={state.readings.linePressure}
      onBack={onBack}
      onHome={onHome}
    >
      {signalAddressFields.map((field) => (
        <button
          key={field.key}
          type="button"
          className="signal-address-hotspot"
          style={{ left: `${field.x}%`, top: `${field.y}%`, width: `${field.width}%`, height: `${field.height}%` }}
          onClick={() => openSignalPicker(field.key)}
          aria-label={field.key.replace(/-/g, ' ')}
        />
      ))}
      {activeSignal && (
        <div className="signal-address-modal">
          <img src={modalAsset} alt="" />
          <span className="signal-address-selected-value">{pendingSignal}</span>
          {signalAddressOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className="signal-address-option"
              style={{ left: `${option.x}%`, top: `${option.y}%` }}
              onClick={() => setPendingSignal(option.value)}
              aria-label={option.value}
            />
          ))}
          <button className="signal-address-ok" type="button" onClick={commitSignalPicker} aria-label="OK" />
          <button className="signal-address-cancel" type="button" onClick={() => setActiveSignal(null)} aria-label="Cancel" />
        </div>
      )}
    </ManualInfoScreen>
  )
}

export function MaxUnloadSettings({ state, onBack, onHome }: { state: AppState; onBack: () => void; onHome: () => void }) {
  const fields: ManualInfoField[] = [
    {
      key: 'load-unload-mode',
      value: `${Math.round(state.controls.targetPressure)}psi`,
      x: 55.1,
      y: 36.4,
      width: 19.4,
      height: 9.0,
      className: 'manual-box-field max-unload-field',
    },
    {
      key: 'modulating-mode',
      value: `${Math.round(state.controls.targetPressure + 10)}psi`,
      x: 55.1,
      y: 47.6,
      width: 19.4,
      height: 9.0,
      className: 'manual-box-field max-unload-field',
    },
  ]

  return (
    <ManualInfoScreen
      assetName="sts-max-unload-manual.png"
      fields={fields}
      linePressure={state.readings.linePressure}
      onBack={onBack}
      onHome={onHome}
      className="max-unload-manual-screen"
    />
  )
}

export function MachineProfiles({ state, onBack, onHome }: { state: AppState; onBack: () => void; onHome: () => void }) {
  return (
    <ManualInfoScreen
      assetName="sts-machine-profiles-manual.png"
      fields={[]}
      linePressure={state.readings.linePressure}
      onBack={onBack}
      onHome={onHome}
    />
  )
}

export function SpiralValveSettings({ state, onBack, onHome }: { state: AppState; onBack: () => void; onHome: () => void }) {
  const fields: ManualInfoField[] = [
    { key: 'spiral-tuning', value: '0', x: 56.8, y: 45.5, width: 18.7, height: 8.6, className: 'manual-box-field' },
    { key: 'spiral-target', value: `${Math.round(state.controls.targetPressure)}`, x: 56.8, y: 56.1, width: 18.7, height: 8.6, className: 'manual-box-field' },
  ]

  return (
    <ManualInfoScreen
      assetName="sts-spiral-valve-setting-manual.png"
      fields={fields}
      linePressure={state.readings.linePressure}
      onBack={onBack}
      onHome={onHome}
    />
  )
}

export function SoftwareUpgrade({ linePressure, onBack, onHome }: { linePressure: number; onBack: () => void; onHome: () => void }) {
  const [view, setView] = useState<'menu' | 'hmi' | 'acb'>('menu')

  if (view === 'hmi') {
    return (
      <ManualInfoScreen
        assetName="sts-hmi-software-manual.png"
        fields={[]}
        linePressure={linePressure}
        onBack={() => setView('menu')}
        onHome={onHome}
        className="software-update-screen"
      >
        <button className="software-update-hotspot hmi-upgrade" type="button" aria-label="HMI firmware upgrade" />
        <button className="software-update-hotspot hmi-cancel" type="button" onClick={() => setView('menu')} aria-label="Cancel" />
      </ManualInfoScreen>
    )
  }

  if (view === 'acb') {
    return (
      <ManualInfoScreen
        assetName="sts-acb-software-manual.png"
        fields={[]}
        linePressure={linePressure}
        onBack={() => setView('menu')}
        onHome={onHome}
        className="software-update-screen software-acb-screen"
      >
        <button className="software-update-hotspot acb-usb" type="button" aria-label="Update from USB" />
        <button className="software-update-hotspot acb-backup" type="button" aria-label="Update from backup" />
      </ManualInfoScreen>
    )
  }

  return (
    <ManualInfoScreen
      assetName="sts-software-update-manual.png"
      fields={[]}
      linePressure={linePressure}
      onBack={onBack}
      onHome={onHome}
      className="software-update-screen"
    >
      <button className="software-update-hotspot software-hmi" type="button" onClick={() => setView('hmi')} aria-label="HMI software update" />
      <button className="software-update-hotspot software-acb" type="button" onClick={() => setView('acb')} aria-label="ACB software update" />
      <button className="software-update-hotspot software-sim" type="button" onClick={() => setView('hmi')} aria-label="HMI software update SIM USBH" />
    </ManualInfoScreen>
  )
}

export function RecommendedService({ state, onBack, onHome }: { state: AppState; onBack: () => void; onHome: () => void }) {
  return (
    <ManualInfoScreen
      assetName="sts-recommended-service-manual.png"
      fields={[]}
      linePressure={state.readings.linePressure}
      onBack={onBack}
      onHome={onHome}
      className="recommended-service-screen"
    />
  )
}

export function CleanDisplay({ onBack }: { onBack: () => void }) {
  const asset = `${import.meta.env.BASE_URL}assets/sts-clean-display-manual.png`.replace(/\/{2,}/g, '/')

  useEffect(() => {
    const timeout = window.setTimeout(onBack, 5000)
    return () => window.clearTimeout(timeout)
  }, [onBack])

  return (
    <div className="manual-reference-screen clean-display-reference-screen">
      <img className="manual-reference-image clean-display-reference-image" src={asset} alt="" />
    </div>
  )
}

export function RebootDisplay({ onHome }: { onHome: () => void }) {
  useEffect(() => {
    const timeout = window.setTimeout(onHome, 600)
    return () => window.clearTimeout(timeout)
  }, [onHome])

  return (
    <div className="manual-reference-screen reboot-reference-screen">
      <div className="reboot-message">Rebooting Display</div>
    </div>
  )
}

export function LogFileScreen({ linePressure, onBack, onHome }: { linePressure: number; onBack: () => void; onHome: () => void }) {
  return (
    <ManualInfoScreen
      assetName="sts-log-file-manual.png"
      fields={[]}
      linePressure={linePressure}
      onBack={onBack}
      onHome={onHome}
    />
  )
}
