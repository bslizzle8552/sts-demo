import { useEffect, useReducer, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { BottomNav } from './components/BottomNav'
import { HmiButton } from './components/HmiButton'
import { TopStatusBar } from './components/TopStatusBar'
import { maintenanceItems, systemConfigurationItems, systemInformationItems } from './data/menuItems'
import { ControlParameters } from './screens/ControlParameters'
import { EventHistory } from './screens/EventHistory'
import { Graphs } from './screens/Graphs'
import { HomeAnalog } from './screens/HomeAnalog'
import { HomeMimic } from './screens/HomeMimic'
import { HomeMultigauge } from './screens/HomeMultigauge'
import { IOStatus } from './screens/IOStatus'
import { MachineInformation } from './screens/MachineInformation'
import { MainMenu } from './screens/MainMenu'
import { MenuCategory } from './screens/MenuCategory'
import { PackageInformation } from './screens/PackageInformation'
import { SpiralValveStatus } from './screens/SpiralValveStatus'
import { Warnings } from './screens/Warnings'
import { initialState, simulate } from './sim/simulationEngine'
import type { ScreenId } from './types'
import './styles.css'

const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`.replace(/\/{2,}/g, '/')
const panelWidth = 1024
const panelHeight = 600

function getPanelScale() {
  if (typeof window === 'undefined') return 1
  const viewport = window.visualViewport
  const width = viewport?.width ?? window.innerWidth
  const height = viewport?.height ?? window.innerHeight
  return Math.min(1, width / panelWidth, height / panelHeight)
}

const screenTitle: Record<ScreenId, string> = {
  mimic: 'Home Mimic',
  analog: 'Home Analog',
  multigauge: 'Home Multigauge',
  menu: 'Main Menu',
  systemInfo: 'System Information',
  systemConfig: 'System Configuration',
  maintenance: 'Maintenance',
  login: 'Log In',
  machine: 'Machine Information',
  controls: 'Control Parameters',
  graphs: 'Graphs',
  warnings: 'Warnings',
  history: 'Event History',
  package: 'Package Information',
  io: 'I/O Status',
  spiral: 'Spiral Valve Status',
}

function App() {
  const [state, dispatch] = useReducer(simulate, initialState)
  const [screen, setScreen] = useState<ScreenId>('mimic')
  const [screenHistory, setScreenHistory] = useState<ScreenId[]>([])
  const [trainerOpen, setTrainerOpen] = useState(false)
  const [panelScale, setPanelScale] = useState(getPanelScale)
  const stopLongPressTimer = useRef<number | null>(null)
  const stopLongPressFired = useRef(false)

  useEffect(() => {
    const interval = window.setInterval(() => dispatch({ type: 'TICK', dt: 1 }), 1000)
    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    const updateScale = () => setPanelScale(getPanelScale())
    window.addEventListener('resize', updateScale)
    window.visualViewport?.addEventListener('resize', updateScale)
    window.addEventListener('orientationchange', updateScale)
    return () => {
      window.removeEventListener('resize', updateScale)
      window.visualViewport?.removeEventListener('resize', updateScale)
      window.removeEventListener('orientationchange', updateScale)
    }
  }, [])

  const navigate = (nextScreen: ScreenId) => {
    setScreenHistory((history) => (nextScreen === screen ? history : [...history, screen].slice(-20)))
    setScreen(nextScreen)
  }

  const goBack = () => {
    setScreenHistory((history) => {
      const previous = history[history.length - 1] ?? 'mimic'
      setScreen(previous)
      return history.slice(0, -1)
    })
  }

  const goHome = () => {
    setScreenHistory((history) => (screen === 'mimic' ? history : [...history, screen].slice(-20)))
    setScreen('mimic')
  }

  const clearStopLongPress = () => {
    if (stopLongPressTimer.current !== null) {
      window.clearTimeout(stopLongPressTimer.current)
      stopLongPressTimer.current = null
    }
  }

  const handleStopPointerDown = () => {
    stopLongPressFired.current = false
    clearStopLongPress()
    if (!isMachineRunning(state.machineState)) {
      stopLongPressTimer.current = window.setTimeout(() => {
        stopLongPressFired.current = true
        if (state.machineState === 'FAULTED' && !state.activeFaults.includes('Emergency stop active')) {
          dispatch({ type: 'RESET' })
        } else if (state.machineState !== 'FAULTED') {
          dispatch({ type: 'CLEAR_WARNINGS' })
        }
      }, 900)
    }
  }

  const handleStopPointerUp = () => {
    clearStopLongPress()
    if (!stopLongPressFired.current) dispatch({ type: 'STOP' })
  }

  const currentScreen = (() => {
    switch (screen) {
      case 'mimic':
        return <HomeMimic state={state} setScreen={navigate} />
      case 'analog':
        return <HomeAnalog state={state} />
      case 'multigauge':
        return <HomeMultigauge state={state} />
      case 'menu':
        return <MainMenu setScreen={navigate} />
      case 'systemInfo':
        return <MenuCategory title="System Information" items={systemInformationItems} setScreen={navigate} />
      case 'systemConfig':
        return <MenuCategory title="System Configuration" items={systemConfigurationItems} setScreen={navigate} />
      case 'maintenance':
        return <MenuCategory title="Maintenance" items={maintenanceItems} setScreen={navigate} />
      case 'login':
        return <MenuCategory title="Log In" items={[{ label: 'User', disabled: true }, { label: 'Distributor', disabled: true }, { label: 'Technician', disabled: true }]} setScreen={navigate} />
      case 'machine':
        return <MachineInformation />
      case 'controls':
        return <ControlParameters state={state} dispatch={dispatch} />
      case 'graphs':
        return <Graphs state={state} />
      case 'warnings':
        return <Warnings state={state} />
      case 'history':
        return <EventHistory state={state} />
      case 'package':
        return <PackageInformation />
      case 'io':
        return <IOStatus state={state} />
      case 'spiral':
        return <SpiralValveStatus state={state} />
      default:
        return <HomeMimic state={state} setScreen={navigate} />
    }
  })()

  return (
    <div className="panel-stage" style={{ width: panelWidth * panelScale, height: panelHeight * panelScale }}>
      <div
        className="physical-panel"
        style={
          {
            '--panel-scale': panelScale,
            '--stop-button-image': `url('${assetUrl('assets/panel/stop-button.png')}')`,
            '--led-blue-image': `url('${assetUrl('assets/panel/led-blue.png')}')`,
            '--led-green-image': `url('${assetUrl('assets/panel/led-green.png')}')`,
            '--led-amber-image': `url('${assetUrl('assets/panel/led-amber.png')}')`,
            '--led-red-image': `url('${assetUrl('assets/panel/led-red.png')}')`,
            '--brand-badge-image': `url('${assetUrl('assets/panel/brand-badge.png')}')`,
            '--estop-button-image': `url('${assetUrl('assets/panel/estop-button.png')}')`,
            '--gauge-face-image': `url('${assetUrl('assets/panel/gauge-face.png')}')`,
          } as CSSProperties
        }
      >
      <section className="touch-bezel">
        <div className="hmi-shell">
          <TopStatusBar state={state} title={screenTitle[screen]} isHome={screen === 'mimic'} canBack={screenHistory.length > 0} onBack={goBack} onHome={goHome} />
          <main className={`screen-frame ${trainerOpen ? 'trainer-open' : ''}`}>
            <section className="screen-body">{currentScreen}</section>
            {trainerOpen && (
              <aside className="trainer open">
                <button className="trainer-toggle" type="button" onClick={() => setTrainerOpen(false)}>
                  Close Trainer
                </button>
                <div className="trainer-panel">
                  <div className="trainer-row">
                    <span>Demand</span>
                    <div className="segmented">
                      {(['low', 'normal', 'high'] as const).map((level) => (
                        <button
                          key={level}
                          type="button"
                          className={state.flags.demand === level ? 'active' : ''}
                          onClick={() => dispatch({ type: 'SET_DEMAND', demand: level })}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                  <label><input type="checkbox" checked={state.flags.highDischargeTemp} onChange={() => dispatch({ type: 'TOGGLE_FLAG', flag: 'highDischargeTemp' })} /> High discharge temp</label>
                  <label><input type="checkbox" checked={state.flags.separatorWarning} onChange={() => dispatch({ type: 'TOGGLE_FLAG', flag: 'separatorWarning' })} /> Separator differential</label>
                  <label><input type="checkbox" checked={state.flags.lowLinePressure} onChange={() => dispatch({ type: 'TOGGLE_FLAG', flag: 'lowLinePressure' })} /> Low line pressure</label>
                  <label><input type="checkbox" checked={state.flags.communicationFault} onChange={() => dispatch({ type: 'TOGGLE_FLAG', flag: 'communicationFault' })} /> Communication fault</label>
                  <div className="trainer-actions">
                    <HmiButton label="Inject E-stop" tone="danger" onClick={() => dispatch({ type: 'ESTOP' })} />
                    <HmiButton label="Reset / Clear" onClick={() => dispatch({ type: state.machineState === 'FAULTED' ? 'RESET' : 'CLEAR_ACTIVE' })} />
                    <HmiButton label="Clear Events" onClick={() => dispatch({ type: 'CLEAR_HISTORY' })} />
                    <HmiButton label="Auto/Manual" onClick={() => dispatch({ type: 'TOGGLE_MODE' })} />
                  </div>
                </div>
              </aside>
            )}
          </main>
          <BottomNav active={screen} onNavigate={navigate} />
        </div>
      </section>
      <aside className="hardware-panel">
        <button className="physical-button start" type="button" onClick={() => dispatch({ type: 'START' })} aria-label="Physical start" />
        <button
          className="physical-button stop"
          type="button"
          onPointerDown={handleStopPointerDown}
          onPointerUp={handleStopPointerUp}
          onPointerCancel={clearStopLongPress}
          aria-label="Physical stop"
        />
        <div className="hardware-leds" aria-label="STS indicator LEDs">
          <Led label="Power" color="blue" active />
          <Led label="Auto / Manual" color="green" active={state.controls.mode === 'AUTOMATIC' || state.controls.mode === 'MANUAL'} />
          <Led label="Warning" color="amber" active={state.activeWarnings.length > 0} />
          <Led label="Fault" color="red" active={state.activeFaults.length > 0 || state.machineState.includes('FAULT')} />
        </div>
        <div className="hardware-logo">SULLAIR</div>
        <button className="physical-dev" type="button" onClick={() => setTrainerOpen((open) => !open)}>DEV</button>
        <button
          className={`physical-estop ${state.activeFaults.includes('Emergency stop active') ? 'latched' : ''}`}
          type="button"
          onClick={() => dispatch({ type: 'ESTOP' })}
        >
          E-STOP
        </button>
      </aside>
      </div>
    </div>
  )
}

function Led({ label, color, active }: { label: string; color: 'blue' | 'green' | 'amber' | 'red'; active: boolean }) {
  return (
    <div className="led-row">
      <span className={`led ${color} ${active ? 'active' : ''}`} />
      <span>{label}</span>
    </div>
  )
}

function isMachineRunning(machineState: string) {
  return !['INITIALIZING', 'MANUALLY STOPPED', 'STANDING BY', 'FAULTED'].includes(machineState)
}

export default App
