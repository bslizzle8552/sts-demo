import { useEffect, useReducer, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { BottomNav } from './components/BottomNav'
import { HmiButton } from './components/HmiButton'
import { TopStatusBar } from './components/TopStatusBar'
import { systemConfigurationItems, systemInformationItems } from './data/menuItems'
import { ControlParameters } from './screens/ControlParameters'
import { EventHistory } from './screens/EventHistory'
import { Graphs } from './screens/Graphs'
import { HomeAnalog } from './screens/HomeAnalog'
import { HomeMimic } from './screens/HomeMimic'
import { HomeMultigauge } from './screens/HomeMultigauge'
import { IOStatus } from './screens/IOStatus'
import { MachineInformation } from './screens/MachineInformation'
import { MainMenu } from './screens/MainMenu'
import { MaintenanceMenu } from './screens/MaintenanceMenu'
import { MenuCategory } from './screens/MenuCategory'
import { PackageInformation } from './screens/PackageInformation'
import {
  AnalogDetails,
  AnalogZeroTrim,
  CleanDisplay,
  ControllerSoftware,
  CurrentTransducerSettings,
  DigitalIODetails,
  DisplayInformation,
  EModeSettings,
  InitializationScreen,
  IpiSettings,
  LoginScreen,
  LogFileScreen,
  MachineProfiles,
  MaxUnloadSettings,
  ModbusSettings,
  NetworkingSettings,
  RebootDisplay,
  RecommendedService,
  RegisterScreen,
  RemoteSettings,
  Scheduling,
  SensorLogRate,
  SignalAddressSettings,
  SoftwareUpgrade,
  SpiralValveStatus,
  SpiralValveSettings,
  TimeDateSettings,
  UserPreferences,
} from './screens/ReferenceScreens'
import { Warnings } from './screens/Warnings'
import { initialState, simulate } from './sim/simulationEngine'
import type { HomeScreenId, ScreenId } from './types'
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
  controllerSoftware: 'Controller & Software',
  controls: 'Control Parameters',
  graphs: 'Graphs',
  warnings: 'Warnings',
  recommendedService: 'Recommended Service',
  history: 'Event History',
  package: 'Package Information',
  io: 'I/O Status',
  digitalDetails: 'Digital I/O Details',
  analogDetails: 'Analog Details',
  sensorLogRate: 'Sensor Log Rate',
  spiral: 'Spiral Valve Status',
  displayInfo: 'Display Information',
  userPrefs: 'User Preferences',
  scheduling: 'Scheduling',
  emode: 'E-Mode',
  remote: 'Remote',
  ipi: 'IPI Setting',
  timeDate: 'Time & Date',
  modbus: 'Modbus Settings',
  networking: 'Networking',
  currentTransducer: 'Current Transducer Settings',
  analogZeroTrim: 'Analog Zero Trim',
  initialization: 'Initialization',
  register: 'Register',
  signalAddress: 'Signal Address Function',
  maxUnload: 'Max Unload Settings',
  machineProfiles: 'Machine Profiles',
  spiralSettings: 'Spiral Valve Settings',
  softwareUpgrade: 'Software Upgrade',
  cleanDisplay: 'Clean Display',
  rebootDisplay: 'Reboot Display',
  logFile: 'Log File',
}

const screenIds = new Set<ScreenId>(Object.keys(screenTitle) as ScreenId[])
const homeScreenIds = new Set<HomeScreenId>(['mimic', 'analog', 'multigauge'])
const homeScreenStorageKey = 'sts.homeScreen'

function readHomeScreenPreference(): HomeScreenId {
  if (typeof window === 'undefined') return 'mimic'
  const storedScreen = window.localStorage.getItem(homeScreenStorageKey)
  return homeScreenIds.has(storedScreen as HomeScreenId) ? (storedScreen as HomeScreenId) : 'mimic'
}

function getInitialScreen(): ScreenId {
  if (typeof window === 'undefined') return 'mimic'
  const screen = new URLSearchParams(window.location.search).get('screen')
  return screenIds.has(screen as ScreenId) ? (screen as ScreenId) : readHomeScreenPreference()
}

function getInitialHomeScreen(): HomeScreenId {
  const initialScreen = getInitialScreen()
  return homeScreenIds.has(initialScreen as HomeScreenId) ? (initialScreen as HomeScreenId) : readHomeScreenPreference()
}

function App() {
  const [state, dispatch] = useReducer(simulate, initialState)
  const [screen, setScreen] = useState<ScreenId>(getInitialScreen)
  const [homeScreen, setHomeScreen] = useState<HomeScreenId>(getInitialHomeScreen)
  const [screenHistory, setScreenHistory] = useState<ScreenId[]>([])
  const [trainerOpen, setTrainerOpen] = useState(false)
  const isManualScreen =
    screen === 'mimic' ||
    screen === 'analog' ||
    screen === 'multigauge' ||
    screen === 'menu' ||
    screen === 'systemInfo' ||
    screen === 'systemConfig' ||
    screen === 'maintenance' ||
    screen === 'io' ||
    screen === 'login' ||
    screen === 'machine' ||
    screen === 'controllerSoftware' ||
    screen === 'controls' ||
    screen === 'package' ||
    screen === 'graphs' ||
    screen === 'recommendedService' ||
    screen === 'history' ||
    screen === 'warnings' ||
    screen === 'sensorLogRate' ||
    screen === 'spiral' ||
    screen === 'remote' ||
    screen === 'ipi' ||
    screen === 'timeDate' ||
    screen === 'modbus' ||
    screen === 'networking' ||
    screen === 'currentTransducer' ||
    screen === 'analogZeroTrim' ||
    screen === 'initialization' ||
    screen === 'register' ||
    screen === 'signalAddress' ||
    screen === 'maxUnload' ||
    screen === 'machineProfiles' ||
    screen === 'spiralSettings' ||
    screen === 'softwareUpgrade' ||
    screen === 'cleanDisplay' ||
    screen === 'logFile' ||
    screen === 'digitalDetails' ||
    screen === 'analogDetails' ||
    screen === 'displayInfo' ||
    screen === 'userPrefs' ||
    screen === 'scheduling' ||
    screen === 'emode'
  const [panelScale, setPanelScale] = useState(getPanelScale)
  const stopLongPressTimer = useRef<number | null>(null)
  const stopLongPressFired = useRef(false)

  useEffect(() => {
    const interval = window.setInterval(() => dispatch({ type: 'TICK', dt: 1 }), 1000)
    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    window.localStorage.setItem(homeScreenStorageKey, homeScreen)
  }, [homeScreen])

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
    setScreenHistory((history) => (screen === homeScreen ? history : [...history, screen].slice(-20)))
    setScreen(homeScreen)
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
        return <HomeMimic state={state} onBack={screenHistory.length > 0 ? goBack : () => navigate('menu')} />
      case 'analog':
        return <HomeAnalog state={state} onBack={screenHistory.length > 0 ? goBack : () => navigate('menu')} />
      case 'multigauge':
        return <HomeMultigauge state={state} onBack={screenHistory.length > 0 ? goBack : () => navigate('menu')} onEMode={() => navigate('emode')} />
      case 'menu':
        return <MainMenu linePressure={state.readings.linePressure} onBack={screenHistory.length > 0 ? goBack : goHome} onHome={goHome} setScreen={navigate} />
      case 'systemInfo':
        return <MenuCategory title="System Information" items={systemInformationItems} linePressure={state.readings.linePressure} onBack={screenHistory.length > 0 ? goBack : () => navigate('menu')} onHome={goHome} setScreen={navigate} />
      case 'systemConfig':
        return <MenuCategory title="System Configuration" items={systemConfigurationItems} linePressure={state.readings.linePressure} onBack={screenHistory.length > 0 ? goBack : () => navigate('menu')} onHome={goHome} setScreen={navigate} />
      case 'maintenance':
        return <MaintenanceMenu linePressure={state.readings.linePressure} onBack={screenHistory.length > 0 ? goBack : () => navigate('menu')} onHome={goHome} setScreen={navigate} />
      case 'login':
        return <LoginScreen onBack={screenHistory.length > 0 ? goBack : goHome} onHome={goHome} />
      case 'machine':
        return <MachineInformation state={state} onBack={screenHistory.length > 0 ? goBack : () => navigate('systemInfo')} onHome={goHome} />
      case 'controllerSoftware':
        return <ControllerSoftware linePressure={state.readings.linePressure} onBack={screenHistory.length > 0 ? goBack : () => navigate('systemInfo')} onHome={goHome} />
      case 'controls':
        return <ControlParameters state={state} dispatch={dispatch} onBack={screenHistory.length > 0 ? goBack : () => navigate('systemConfig')} onHome={goHome} />
      case 'graphs':
        return <Graphs state={state} onBack={screenHistory.length > 0 ? goBack : () => navigate('systemInfo')} onHome={goHome} />
      case 'warnings':
        return <Warnings state={state} onBack={screenHistory.length > 0 ? goBack : () => navigate('maintenance')} onHome={goHome} />
      case 'recommendedService':
        return <RecommendedService state={state} onBack={screenHistory.length > 0 ? goBack : () => navigate('maintenance')} onHome={goHome} />
      case 'history':
        return <EventHistory state={state} onBack={screenHistory.length > 0 ? goBack : () => navigate('maintenance')} onHome={goHome} />
      case 'package':
        return <PackageInformation linePressure={state.readings.linePressure} onBack={screenHistory.length > 0 ? goBack : () => navigate('systemInfo')} onHome={goHome} />
      case 'io':
        return <IOStatus state={state} onBack={screenHistory.length > 0 ? goBack : goHome} onHome={goHome} />
      case 'digitalDetails':
        return <DigitalIODetails state={state} onBack={screenHistory.length > 0 ? goBack : () => navigate('systemInfo')} onHome={goHome} />
      case 'analogDetails':
        return <AnalogDetails state={state} onBack={screenHistory.length > 0 ? goBack : () => navigate('systemInfo')} onHome={goHome} />
      case 'sensorLogRate':
        return <SensorLogRate linePressure={state.readings.linePressure} onBack={screenHistory.length > 0 ? goBack : () => navigate('systemInfo')} onHome={goHome} />
      case 'spiral':
        return <SpiralValveStatus state={state} onBack={screenHistory.length > 0 ? goBack : () => navigate('systemInfo')} onHome={goHome} />
      case 'displayInfo':
        return <DisplayInformation linePressure={state.readings.linePressure} onBack={screenHistory.length > 0 ? goBack : () => navigate('systemInfo')} onHome={goHome} />
      case 'userPrefs':
        return <UserPreferences linePressure={state.readings.linePressure} homeScreen={homeScreen} setHomeScreen={setHomeScreen} onBack={screenHistory.length > 0 ? goBack : () => navigate('systemConfig')} onHome={goHome} />
      case 'scheduling':
        return <Scheduling linePressure={state.readings.linePressure} onBack={screenHistory.length > 0 ? goBack : () => navigate('systemConfig')} onHome={goHome} />
      case 'emode':
        return <EModeSettings state={state} onBack={screenHistory.length > 0 ? goBack : () => navigate('systemConfig')} onHome={goHome} />
      case 'remote':
        return <RemoteSettings state={state} onBack={screenHistory.length > 0 ? goBack : () => navigate('systemConfig')} onHome={goHome} />
      case 'ipi':
        return <IpiSettings linePressure={state.readings.linePressure} onBack={screenHistory.length > 0 ? goBack : () => navigate('systemConfig')} onHome={goHome} />
      case 'timeDate':
        return <TimeDateSettings linePressure={state.readings.linePressure} onBack={screenHistory.length > 0 ? goBack : () => navigate('systemConfig')} onHome={goHome} />
      case 'modbus':
        return <ModbusSettings linePressure={state.readings.linePressure} onBack={screenHistory.length > 0 ? goBack : () => navigate('systemConfig')} onHome={goHome} />
      case 'networking':
        return <NetworkingSettings linePressure={state.readings.linePressure} onBack={screenHistory.length > 0 ? goBack : () => navigate('systemConfig')} onHome={goHome} />
      case 'currentTransducer':
        return <CurrentTransducerSettings state={state} onBack={screenHistory.length > 0 ? goBack : () => navigate('systemConfig')} onHome={goHome} />
      case 'analogZeroTrim':
        return <AnalogZeroTrim state={state} onBack={screenHistory.length > 0 ? goBack : () => navigate('systemConfig')} onHome={goHome} />
      case 'initialization':
        return <InitializationScreen state={state} onBack={screenHistory.length > 0 ? goBack : () => navigate('systemConfig')} onHome={goHome} />
      case 'register':
        return <RegisterScreen state={state} onBack={screenHistory.length > 0 ? goBack : () => navigate('systemConfig')} onHome={goHome} />
      case 'signalAddress':
        return <SignalAddressSettings state={state} onBack={screenHistory.length > 0 ? goBack : () => navigate('systemConfig')} onHome={goHome} />
      case 'maxUnload':
        return <MaxUnloadSettings state={state} onBack={screenHistory.length > 0 ? goBack : () => navigate('systemConfig')} onHome={goHome} />
      case 'machineProfiles':
        return <MachineProfiles state={state} onBack={screenHistory.length > 0 ? goBack : () => navigate('systemConfig')} onHome={goHome} />
      case 'spiralSettings':
        return <SpiralValveSettings state={state} onBack={screenHistory.length > 0 ? goBack : () => navigate('systemConfig')} onHome={goHome} />
      case 'softwareUpgrade':
        return <SoftwareUpgrade linePressure={state.readings.linePressure} onBack={screenHistory.length > 0 ? goBack : () => navigate('systemConfig')} onHome={goHome} />
      case 'cleanDisplay':
        return <CleanDisplay onBack={screenHistory.length > 0 ? goBack : () => navigate('maintenance')} />
      case 'rebootDisplay':
        return <RebootDisplay onHome={goHome} />
      case 'logFile':
        return <LogFileScreen linePressure={state.readings.linePressure} onBack={screenHistory.length > 0 ? goBack : () => navigate('maintenance')} onHome={goHome} />
      default:
        return <HomeMimic state={state} onBack={goBack} />
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
          } as CSSProperties
        }
      >
      <section className="touch-bezel">
        <div className={`hmi-shell ${isManualScreen ? 'manual-home-shell' : ''}`}>
          {!isManualScreen && <TopStatusBar state={state} title={screenTitle[screen]} isHome={false} canBack={screenHistory.length > 0} onBack={goBack} onHome={goHome} />}
          <main className={`screen-frame ${isManualScreen ? 'manual-home-frame' : ''} ${trainerOpen ? 'trainer-open' : ''}`}>
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
          {!isManualScreen && <BottomNav active={screen} state={state} onNavigate={navigate} />}
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
