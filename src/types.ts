export type MachineState =
  | 'INITIALIZING'
  | 'MANUALLY STOPPED'
  | 'STARTING 1'
  | 'STARTING 2'
  | 'STARTING 3'
  | 'WAITING FOR BLOWDOWN'
  | 'LOADING'
  | 'LOADED & MODULATING'
  | 'FULLY LOADED'
  | 'UNLOADING'
  | 'RUNNING UNLOADED'
  | 'STANDING BY'
  | 'FAULTING'
  | 'FAULTED'

export type OperatingMode = 'AUTOMATIC' | 'MANUAL' | 'OFF' | 'FAULT' | 'UI COMM'

export type ScreenId =
  | 'mimic'
  | 'analog'
  | 'multigauge'
  | 'menu'
  | 'systemInfo'
  | 'systemConfig'
  | 'maintenance'
  | 'login'
  | 'machine'
  | 'controllerSoftware'
  | 'controls'
  | 'graphs'
  | 'warnings'
  | 'recommendedService'
  | 'history'
  | 'package'
  | 'io'
  | 'digitalDetails'
  | 'analogDetails'
  | 'sensorLogRate'
  | 'spiral'
  | 'displayInfo'
  | 'userPrefs'
  | 'scheduling'
  | 'emode'
  | 'remote'
  | 'ipi'
  | 'timeDate'
  | 'modbus'
  | 'networking'
  | 'currentTransducer'
  | 'analogZeroTrim'
  | 'initialization'
  | 'register'
  | 'signalAddress'
  | 'maxUnload'
  | 'machineProfiles'
  | 'spiralSettings'
  | 'softwareUpgrade'
  | 'cleanDisplay'
  | 'rebootDisplay'
  | 'logFile'

export type HomeScreenId = Extract<ScreenId, 'mimic' | 'analog' | 'multigauge'>

export type Severity = 'INFO' | 'WARNING' | 'FAULT'
export type DemandLevel = 'low' | 'normal' | 'high'

export interface EventRecord {
  id: number
  timestamp: string
  severity: Severity
  name: string
  message: string
  state: MachineState
  value?: string
}

export interface ControlParameters {
  mode: OperatingMode
  loadPressure: number
  unloadPressure: number
  targetPressure: number
  modulation: string
  unloadTime: number
  restartPressure: number
  restartTime: number
  drainInterval: number
  drainTime: number
  costPerKwh: number
}

export interface Readings {
  linePressure: number
  sumpPressure: number
  dischargeTemp: number
  sumpTemp: number
  fluidTemp: number
  ambientTemp: number
  packageKw: number
  machineCurrent: number
  deliveryCfm: number
  motorRpm: number
  capacity: number
  separatorDelta: number
  starts: number
  loadCycles: number
  runHours: number
  loadedHours: number
  spiralValve: number
  fanRunning: boolean
}

export interface SimulationFlags {
  demand: DemandLevel
  highDischargeTemp: boolean
  separatorWarning: boolean
  lowLinePressure: boolean
  communicationFault: boolean
}

export interface AppState {
  machineState: MachineState
  controls: ControlParameters
  readings: Readings
  flags: SimulationFlags
  events: EventRecord[]
  activeWarnings: string[]
  activeFaults: string[]
  elapsedInState: number
  eventCounter: number
  history: Array<{ time: number; pressure: number; capacity: number; kw: number; temp: number; current: number }>
  simTime: number
  stopRequested: boolean
}

export type SimAction =
  | { type: 'TICK'; dt: number }
  | { type: 'START' }
  | { type: 'STOP' }
  | { type: 'RESET' }
  | { type: 'ESTOP' }
  | { type: 'SET_CONTROL'; key: keyof ControlParameters; value: number | string }
  | { type: 'SET_DEMAND'; demand: DemandLevel }
  | { type: 'TOGGLE_FLAG'; flag: keyof Omit<SimulationFlags, 'demand'> }
  | { type: 'CLEAR_ACTIVE' }
  | { type: 'CLEAR_WARNINGS' }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'TOGGLE_MODE' }
