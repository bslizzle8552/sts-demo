import type { MenuItem } from '../screens/MenuCategory'

export const systemInformationItems: MenuItem[] = [
  { id: 'io', label: 'I/O Status' },
  { id: 'machine', label: 'Machine Information' },
  { id: 'controllerSoftware', label: 'Controller & Software' },
  { id: 'graphs', label: 'Graphs' },
  { id: 'package', label: 'Package Information' },
  { label: 'Sequencing', disabled: true },
  { id: 'spiral', label: 'Spiral Valve Status' },
  { id: 'digitalDetails', label: 'Digital I/O Details' },
  { id: 'analogDetails', label: 'Analog Details' },
  { id: 'displayInfo', label: 'Display Information' },
  { id: 'sensorLogRate', label: 'Sensor Log Rate' },
]

export const systemConfigurationItems: MenuItem[] = [
  { id: 'currentTransducer', label: 'Current Transducer Settings' },
  { id: 'controls', label: 'Control Parameter' },
  { id: 'userPrefs', label: 'User Preferences' },
  { label: 'Sequence Settings', disabled: true },
  { id: 'scheduling', label: 'Scheduling' },
  { id: 'emode', label: 'E-Mode' },
  { id: 'remote', label: 'Remote' },
  { id: 'ipi', label: 'IPI Setting' },
  { id: 'timeDate', label: 'Time & Date' },
  { id: 'modbus', label: 'Modbus Settings' },
  { id: 'networking', label: 'Networking' },
  { id: 'maxUnload', label: 'Max Unload Settings' },
  { id: 'analogZeroTrim', label: 'Analog Zero Trim' },
  { id: 'initialization', label: 'Initialization' },
  { id: 'machineProfiles', label: 'Machine Profiles' },
  { id: 'register', label: 'Register' },
  { id: 'signalAddress', label: 'Signal Address Function' },
  { id: 'spiralSettings', label: 'Spiral Valve Settings' },
  { id: 'softwareUpgrade', label: 'Software Upgrade' },
]
