import type { ControlParameters } from '../types'

export const machineProfile = {
  model: 'SN7509S AC',
  type: 'Oil-injected rotary screw',
  stages: 1,
  cooling: 'Air-cooled',
  motorHp: 100,
  fullLoadOperatingPressure: 125,
  fullLoadCapacity: 457,
  fullLoadPackageKw: 89.7,
  noLoadPackageKw: 22.5,
  normalSeparatorDelta: '2.0 to 3.0 psi',
  ratedPressure: 210,
  fanMotorHp: 3,
  fluidFillGallons: 5,
}

export const defaultControlParameters: ControlParameters = {
  mode: 'AUTOMATIC',
  loadPressure: 115,
  unloadPressure: 130,
  targetPressure: 125,
  modulation: 'Spiral Valve / Variable Displacement',
  unloadTime: 300,
}

export const kwCurve = [
  { capacity: 0, kw: 22.5 },
  { capacity: 55, kw: 60.5 },
  { capacity: 60, kw: 64.6 },
  { capacity: 70, kw: 70 },
  { capacity: 80, kw: 76.7 },
  { capacity: 100, kw: 89.7 },
]
