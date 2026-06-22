import { defaultControlParameters, kwCurve, machineProfile } from '../data/machineProfile'
import type { AppState, DemandLevel, EventRecord, MachineState, Readings, Severity, SimAction } from '../types'

const transitionTimes: Partial<Record<MachineState, { next: MachineState; seconds: number }>> = {
  INITIALIZING: { next: 'MANUALLY STOPPED', seconds: 2 },
  'STARTING 1': { next: 'STARTING 2', seconds: 1 },
  'STARTING 2': { next: 'STARTING 3', seconds: 1 },
  'STARTING 3': { next: 'LOADING', seconds: 1 },
  LOADING: { next: 'LOADED & MODULATING', seconds: 2 },
  UNLOADING: { next: 'RUNNING UNLOADED', seconds: 2 },
  FAULTING: { next: 'FAULTED', seconds: 2 },
}

const demandDraw: Record<DemandLevel, number> = {
  low: 0.32,
  normal: 0.62,
  high: 0.92,
}

const demandProfile: Record<DemandLevel, { slow: number; pulses: number; bursts: number }> = {
  low: { slow: 0.035, pulses: 0.055, bursts: 0.065 },
  normal: { slow: 0.055, pulses: 0.095, bursts: 0.12 },
  high: { slow: 0.045, pulses: 0.075, bursts: 0.1 },
}

export const initialState: AppState = {
  machineState: 'INITIALIZING',
  controls: defaultControlParameters,
  readings: {
    linePressure: 118,
    sumpPressure: 2,
    dischargeTemp: 88,
    sumpTemp: 82,
    fluidTemp: 84,
    ambientTemp: 74,
    packageKw: 0,
    machineCurrent: 0,
    deliveryCfm: 0,
    motorRpm: 0,
    capacity: 0,
    separatorDelta: 0.5,
    starts: 0,
    loadCycles: 0,
    runHours: 0,
    loadedHours: 0,
    spiralValve: 0,
    fanRunning: false,
  },
  flags: {
    demand: 'normal',
    highDischargeTemp: false,
    separatorWarning: false,
    lowLinePressure: false,
    communicationFault: false,
  },
  events: [],
  activeWarnings: [],
  activeFaults: [],
  elapsedInState: 0,
  eventCounter: 0,
  history: [],
  simTime: 0,
  stopRequested: false,
}

export function simulate(state: AppState, action: SimAction): AppState {
  switch (action.type) {
    case 'TICK':
      return tick(state, action.dt)
    case 'START':
      if (state.machineState === 'MANUALLY STOPPED' || state.machineState === 'STANDING BY' || state.machineState === 'RUNNING UNLOADED') {
        return addEvent({ ...transition(state, 'STARTING 1'), stopRequested: false }, 'INFO', 'Start Command', 'Start command accepted')
      }
      return state
    case 'STOP':
      if (isRunning(state.machineState)) {
        return addEvent({ ...transition(state, 'UNLOADING'), stopRequested: true }, 'INFO', 'Stop Command', 'Stop command accepted')
      }
      return state.machineState === 'FAULTED' ? state : addEvent(transition(state, 'MANUALLY STOPPED'), 'INFO', 'Stop Command', 'Machine stopped')
    case 'RESET':
      if (hasEStopFault(state)) {
        return addEvent(state, 'FAULT', 'Reset Rejected', 'E-stop fault is latched')
      }
      if (state.machineState === 'FAULTED' || state.machineState === 'MANUALLY STOPPED') {
        return addEvent(
          {
            ...transition(state, 'MANUALLY STOPPED'),
            activeFaults: [],
            flags: { ...state.flags, communicationFault: false },
            controls: { ...state.controls, mode: 'AUTOMATIC' },
            stopRequested: false,
          },
          'INFO',
          'Fault Cleared',
          'Reset / clear fault accepted',
        )
      }
      return state
    case 'ESTOP':
      if (hasEStopFault(state)) return releaseEStop(state)
      return latchEStop(state)
    case 'SET_CONTROL':
      return addEvent(
        { ...state, controls: { ...state.controls, [action.key]: action.value } },
        'INFO',
        'Control Parameter Changed',
        `${action.key} set`,
        String(action.value),
      )
    case 'SET_DEMAND':
      return addEvent({ ...state, flags: { ...state.flags, demand: action.demand } }, 'INFO', 'Demand Changed', `Demand set to ${action.demand}`)
    case 'TOGGLE_FLAG':
      return handleFlagToggle(state, action.flag)
    case 'CLEAR_ACTIVE':
      if (hasEStopFault(state)) return addEvent(state, 'FAULT', 'Clear Rejected', 'E-stop fault is latched')
      return clearWarnings(state, 'Active Warnings Cleared', 'Trainer warning clear accepted')
    case 'CLEAR_WARNINGS':
      if (isRunning(state.machineState)) return state
      return clearWarnings(state, 'Warnings Cleared', 'Stop button long press')
    case 'CLEAR_HISTORY':
      return { ...state, events: [], eventCounter: 0 }
    case 'TOGGLE_MODE':
      return addEvent(
        { ...state, controls: { ...state.controls, mode: state.controls.mode === 'MANUAL' ? 'AUTOMATIC' : 'MANUAL' } },
        'INFO',
        'Mode Changed',
        `Mode set to ${state.controls.mode === 'MANUAL' ? 'AUTOMATIC' : 'MANUAL'}`,
      )
    default:
      return state
  }
}

function tick(state: AppState, dt: number): AppState {
  let next = { ...state, simTime: state.simTime + dt, elapsedInState: state.elapsedInState + dt }
  const autoTransition = transitionTimes[next.machineState]

  if (autoTransition && next.elapsedInState >= autoTransition.seconds) {
    next = transition(next, autoTransition.next)
    if (autoTransition.next === 'LOADING') {
      next = addEvent(next, 'INFO', 'Loading', 'Compressor loading')
    }
    if (autoTransition.next === 'LOADED & MODULATING') {
      next = addEvent({ ...next, readings: { ...next.readings, loadCycles: next.readings.loadCycles + 1 } }, 'INFO', 'Load Cycle Completed', 'Loaded and modulating')
    }
  }

  if (next.machineState === 'RUNNING UNLOADED' && next.stopRequested && next.elapsedInState >= 4) {
    next = addEvent(transition(next, 'MANUALLY STOPPED'), 'INFO', 'Stopped', 'Unload stop complete')
  }

  if (
    next.machineState === 'RUNNING UNLOADED' &&
    !next.stopRequested &&
    next.controls.mode === 'AUTOMATIC' &&
    next.elapsedInState >= next.controls.unloadTime &&
    next.readings.linePressure > next.controls.loadPressure
  ) {
    next = addEvent(transition(next, 'STANDING BY'), 'INFO', 'Automatic Stop', 'Unload time expired')
  }

  if (
    next.machineState === 'STANDING BY' &&
    next.controls.mode === 'AUTOMATIC' &&
    next.readings.linePressure <= Math.max(next.controls.restartPressure, next.controls.loadPressure)
  ) {
    next = addEvent({ ...transition(next, 'STARTING 1'), stopRequested: false }, 'INFO', 'Auto Restart', 'Restart pressure reached', `${next.readings.linePressure.toFixed(0)} psi`)
  }

  if (next.machineState === 'RUNNING UNLOADED' && !next.stopRequested && next.readings.linePressure <= next.controls.loadPressure) {
    next = addEvent(transition(next, 'LOADING'), 'INFO', 'Loading', 'Line pressure below load pressure', `${next.readings.linePressure.toFixed(0)} psi`)
  }

  if (
    (next.machineState === 'LOADED & MODULATING' || next.machineState === 'FULLY LOADED') &&
    next.readings.linePressure >= next.controls.unloadPressure + 3 &&
    next.readings.capacity < 18
  ) {
    next = addEvent(transition(next, 'UNLOADING'), 'INFO', 'Unload Pressure Reached', 'Compressor unloading', `${next.readings.linePressure.toFixed(0)} psi`)
  }

  next = { ...next, readings: updateReadings(next, dt) }
  next = updateWarnings(next)
  const historyPoint = {
    time: next.simTime,
    pressure: next.readings.linePressure,
    capacity: next.readings.capacity,
    kw: next.readings.packageKw,
    temp: next.readings.dischargeTemp,
    current: next.readings.machineCurrent,
  }
  return { ...next, history: [...next.history.slice(-59), historyPoint] }
}

function updateReadings(state: AppState, dt: number): Readings {
  const loaded = state.machineState === 'LOADING' || state.machineState === 'LOADED & MODULATING' || state.machineState === 'FULLY LOADED'
  const running = isRunning(state.machineState)
  const target = state.controls.targetPressure
  const unloaded = state.machineState === 'RUNNING UNLOADED' || state.machineState === 'UNLOADING'
  const stopped = state.machineState === 'MANUALLY STOPPED' || state.machineState === 'INITIALIZING' || state.machineState === 'STANDING BY' || state.machineState === 'FAULTED'
  const demand = effectiveDemand(state)
  const error = target - state.readings.linePressure
  const controllerDemand = effectiveDemand(state, state.simTime - 2.4)
  const normalDemandCapacity = controllerDemand * 100
  const isSpiralModulating = state.controls.modulation.toLowerCase().includes('spiral')
  const controllerTrim = error * 4.4 + Math.sin(state.simTime * 1.7) * 1.4
  const modulatingCapacity = normalDemandCapacity + controllerTrim
  const loadUnloadCapacity = state.readings.linePressure <= state.controls.unloadPressure ? 100 : 0
  const loadingCapacity = state.machineState === 'LOADING' ? 100 : isSpiralModulating ? modulatingCapacity : loadUnloadCapacity
  const targetCapacity = loaded ? clamp(loadingCapacity, isSpiralModulating ? 16 : 0, 100) : 0
  const capacity = approach(state.readings.capacity, targetCapacity, dt * (loaded ? 15 : 30))
  const delivery = loaded ? capacity / 100 : 0
  const pressureRipple = loaded ? Math.sin(state.simTime * 2.9) * 0.045 + Math.sin(state.simTime * 7.1) * 0.018 : 0
  const pressureChange = loaded ? (delivery - demand) * dt * 9.8 + error * dt * 0.035 + pressureRipple : -demand * dt * 0.45
  const linePressure = clamp(state.readings.linePressure + pressureChange, 0, 155)
  const separatorNormal = 2.05 + capacity / 150 + Math.sin(state.simTime * 0.65) * 0.18 + Math.sin(state.simTime * 2.3) * 0.07
  const separatorDelta = state.flags.separatorWarning ? approach(state.readings.separatorDelta, 6.2, dt * 0.7) : loaded ? clamp(separatorNormal, 1.8, 3.2) : approach(state.readings.separatorDelta, stopped ? 0.2 : 0.5, dt * 0.7)
  const sumpTarget = loaded ? linePressure + separatorDelta + 4.5 : unloaded ? Math.max(0, linePressure * 0.35) : Math.max(0, linePressure * 0.08)
  const sumpPressure = approach(state.readings.sumpPressure, sumpTarget, dt * (loaded ? 4 : 8))
  const ambientTemp = 74 + Math.sin(state.simTime * 0.012) * 2.4
  const tempTarget = state.flags.highDischargeTemp ? 245 : loaded ? 166 + capacity * 0.33 : running ? 130 : 92
  const dischargeTemp = approach(state.readings.dischargeTemp, tempTarget, dt * (running ? 4 : 2.2))
  const fluidTempTarget = state.flags.highDischargeTemp ? 218 : loaded ? 140 + capacity * 0.22 : running ? 116 : ambientTemp + 10
  const fluidTemp = approach(state.readings.fluidTemp, fluidTempTarget, dt * (running ? 2.7 : 1.6))
  const sumpTemp = approach(state.readings.sumpTemp, Math.max(fluidTemp + 6, dischargeTemp - 18), dt * 2.6)
  const packageKw = loaded ? interpolateKw(capacity) : unloaded ? approach(state.readings.packageKw || 22.5, 25.5, dt * 3) : 0
  const fullLoadAmps = machineProfile.packageAmpsAirCooled[460]
  const machineCurrent = running ? clamp((packageKw / machineProfile.fullLoadPackageKw) * fullLoadAmps + Math.sin(state.simTime * 1.1) * 1.6, 24, fullLoadAmps * 1.08) : 0
  const deliveryCfm = loaded ? (capacity / 100) * machineProfile.fullLoadCapacity : 0
  const motorRpm = running ? machineProfile.motorRpm + Math.sin(state.simTime * 0.9) * 5 : 0
  const runHours = state.readings.runHours + (running ? dt / 3600 : 0)
  const loadedHours = state.readings.loadedHours + (loaded ? dt / 3600 : 0)

  return {
    ...state.readings,
    linePressure,
    sumpPressure,
    dischargeTemp,
    sumpTemp,
    fluidTemp,
    ambientTemp,
    packageKw,
    machineCurrent,
    deliveryCfm,
    motorRpm,
    capacity,
    separatorDelta,
    runHours,
    loadedHours,
    spiralValve: capacity,
    fanRunning: running && dischargeTemp > 105,
  }
}

function effectiveDemand(state: AppState, atTime = state.simTime) {
  const base = demandDraw[state.flags.demand] + (state.flags.lowLinePressure ? 0.22 : 0)
  const profile = demandProfile[state.flags.demand]
  const t = Math.max(0, atTime)
  const slowPlantDrift = profile.slow * (Math.sin(t * 0.21) + 0.55 * Math.sin(t * 0.47 + 1.7))
  const dutyLoads =
    profile.pulses * periodicLoad(t, 19, 5.5, 0.7) -
    profile.pulses * 0.55 * periodicLoad(t + 9, 31, 7, 0.35)
  const blowgunBursts =
    profile.bursts * burstLoad(t, 4.6, 0.62, 0.62) +
    profile.bursts * 0.75 * burstLoad(t + 2.3, 7.8, 0.9, 0.74)
  const filterAndHeaderNoise = 0.018 * Math.sin(t * 1.15 + 0.4) + 0.011 * Math.sin(t * 3.8)

  return clamp(base + slowPlantDrift + dutyLoads + blowgunBursts + filterAndHeaderNoise, 0.18, 1.08)
}

function periodicLoad(time: number, period: number, duration: number, rampSeconds: number) {
  const phase = positiveModulo(time, period)
  if (phase >= duration) return 0
  const rampIn = clamp(phase / rampSeconds, 0, 1)
  const rampOut = clamp((duration - phase) / rampSeconds, 0, 1)
  return Math.min(rampIn, rampOut)
}

function burstLoad(time: number, period: number, duration: number, threshold: number) {
  const cycle = Math.floor(time / period)
  const phase = positiveModulo(time, period)
  const chance = pseudoRandom(cycle)
  if (chance < threshold || phase > duration) return 0
  const burstSize = 0.65 + pseudoRandom(cycle + 101) * 0.7
  return burstSize * Math.sin((phase / duration) * Math.PI)
}

function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453
  return x - Math.floor(x)
}

function positiveModulo(value: number, divisor: number) {
  return ((value % divisor) + divisor) % divisor
}

function updateWarnings(state: AppState): AppState {
  let next = state
  const warnings = new Set(state.activeWarnings)

  if (state.readings.separatorDelta > 5.5) warnings.add('Separator differential high')
  if (state.flags.lowLinePressure && state.readings.linePressure < 90) warnings.add('Low line pressure')
  if (state.readings.dischargeTemp > 210) warnings.add('High discharge temperature warning')

  if (!state.activeWarnings.includes('Separator differential high') && warnings.has('Separator differential high')) {
      next = addEvent(next, 'WARNING', 'Warning Injected', 'Separator differential warning', `${next.readings.separatorDelta.toFixed(1)} psi`)
  }
  if (!state.activeWarnings.includes('Low line pressure') && warnings.has('Low line pressure')) {
    next = addEvent(next, 'WARNING', 'Warning Injected', 'Low line pressure warning', `${next.readings.linePressure.toFixed(0)} psi`)
  }
  if (state.readings.dischargeTemp > 230 && next.machineState !== 'FAULTING' && next.machineState !== 'FAULTED') {
    next = tripFault(next, 'High discharge temperature fault', `${next.readings.dischargeTemp.toFixed(0)} F`)
  }
  if (state.flags.communicationFault && next.machineState !== 'FAULTING' && next.machineState !== 'FAULTED') {
    next = tripFault(next, 'UI communication fault')
  }

  return { ...next, activeWarnings: Array.from(warnings) }
}

function handleFlagToggle(state: AppState, flag: 'highDischargeTemp' | 'separatorWarning' | 'lowLinePressure' | 'communicationFault'): AppState {
  const enabled = !state.flags[flag]
  let next = { ...state, flags: { ...state.flags, [flag]: enabled } }
  const label = flag.replace(/([A-Z])/g, ' $1').toLowerCase()
  const severity = enabled && flag === 'communicationFault' ? 'FAULT' : enabled ? 'WARNING' : 'INFO'
  next = addEvent(next, severity, enabled ? (severity === 'FAULT' ? 'Fault Injected' : 'Warning Injected') : 'Trainer Injection Cleared', `${enabled ? 'Injected' : 'Cleared'} ${label}`)
  if (flag === 'communicationFault' && enabled) return tripFault(next, 'UI communication fault')
  return next
}

function tripFault(state: AppState, message: string, value?: string): AppState {
  if (state.machineState === 'FAULTING' || state.machineState === 'FAULTED') return state
  return addEvent(
    {
      ...transition(state, 'FAULTING'),
      controls: { ...state.controls, mode: 'FAULT' },
      activeFaults: state.activeFaults.includes(message) ? state.activeFaults : [...state.activeFaults, message],
      stopRequested: false,
    },
    'FAULT',
    'Fault Injected',
    message,
    value,
  )
}

function latchEStop(state: AppState): AppState {
  const eventState = addEvent(state, 'FAULT', 'E-stop Pressed', 'Emergency stop button pressed')
  const faultedState =
    eventState.machineState === 'FAULTED' || eventState.machineState === 'FAULTING'
      ? eventState
      : transition(eventState, 'FAULTING')

  return addEvent(
    {
      ...faultedState,
      controls: { ...faultedState.controls, mode: 'FAULT' },
      activeFaults: faultedState.activeFaults.includes('Emergency stop active')
        ? faultedState.activeFaults
        : [...faultedState.activeFaults, 'Emergency stop active'],
      stopRequested: false,
    },
    'FAULT',
    'Fault Injected',
    'Emergency stop active',
  )
}

function clearWarnings(state: AppState, name: string, message: string): AppState {
  return addEvent(
    {
      ...state,
      activeWarnings: [],
      flags: {
        ...state.flags,
        highDischargeTemp: false,
        separatorWarning: false,
        lowLinePressure: false,
      },
    },
    'INFO',
    name,
    message,
  )
}

function releaseEStop(state: AppState): AppState {
  return addEvent(
    {
      ...state,
      activeFaults: state.activeFaults.filter((fault) => fault !== 'Emergency stop active'),
      stopRequested: false,
    },
    'INFO',
    'E-stop Released',
    'Emergency stop button released',
  )
}

function hasEStopFault(state: AppState) {
  return state.activeFaults.includes('Emergency stop active')
}

function transition(state: AppState, machineState: MachineState): AppState {
  const starts = state.machineState === 'MANUALLY STOPPED' && machineState === 'STARTING 1' ? state.readings.starts + 1 : state.readings.starts
  return { ...state, machineState, elapsedInState: 0, readings: { ...state.readings, starts } }
}

function addEvent(state: AppState, severity: Severity, name: string, message: string, value?: string): AppState {
  const event: EventRecord = {
    id: state.eventCounter + 1,
    timestamp: new Date().toLocaleTimeString(),
    severity,
    name,
    message,
    state: state.machineState,
    value,
  }
  return { ...state, eventCounter: event.id, events: [event, ...state.events].slice(0, 80) }
}

function isRunning(state: MachineState) {
  return !['INITIALIZING', 'MANUALLY STOPPED', 'STANDING BY', 'FAULTED'].includes(state)
}

function interpolateKw(capacity: number) {
  const cap = clamp(capacity, 0, 100)
  const upper = kwCurve.find((point) => point.capacity >= cap) ?? kwCurve[kwCurve.length - 1]
  const lower = [...kwCurve].reverse().find((point) => point.capacity <= cap) ?? kwCurve[0]
  if (upper.capacity === lower.capacity) return upper.kw
  const ratio = (cap - lower.capacity) / (upper.capacity - lower.capacity)
  return lower.kw + (upper.kw - lower.kw) * ratio
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function approach(value: number, target: number, step: number) {
  if (Math.abs(target - value) <= step) return target
  return value + Math.sign(target - value) * step
}
