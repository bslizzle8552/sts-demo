import type { MenuItem } from '../screens/MenuCategory'

export const systemInformationItems: MenuItem[] = [
  { id: 'io', label: 'I/O Status' },
  { id: 'machine', label: 'Machine Information' },
  { label: 'Controller & Software', disabled: true },
  { id: 'graphs', label: 'Graphs' },
  { id: 'package', label: 'Package Information' },
  { label: 'Sequencing', disabled: true },
  { id: 'spiral', label: 'Spiral Valve Status' },
  { label: 'VFD Data', disabled: true },
  { label: 'Fan VFD Data', disabled: true },
  { label: 'Digital I/O Details', disabled: true },
  { label: 'Analog Details', disabled: true },
  { label: 'Display Information', disabled: true },
  { label: 'Sensor Log Rate', disabled: true },
]

export const systemConfigurationItems: MenuItem[] = [
  { label: 'Current Transducer Settings', disabled: true },
  { id: 'controls', label: 'Control Parameter' },
  { label: 'User Preferences', disabled: true },
  { label: 'Sequence Settings', disabled: true },
  { label: 'Scheduling', disabled: true },
  { label: 'E-Mode', disabled: true },
  { label: 'Remote', disabled: true },
  { label: 'IPI Setting', disabled: true },
  { label: 'Time & Date', disabled: true },
  { label: 'Modbus Settings', disabled: true },
  { label: 'Networking', disabled: true },
  { label: 'Peak Cut', disabled: true },
  { label: 'Max Unload Settings', disabled: true },
  { label: 'Analog Zero Trim', disabled: true },
  { label: 'Initialization', disabled: true },
  { label: 'Machine Profiles', disabled: true },
  { label: 'Register', disabled: true },
  { label: 'Signal Address Function', disabled: true },
  { label: 'Spiral Valve Settings', disabled: true },
  { label: 'VFD Package Settings', disabled: true },
  { label: 'VFD Fan Settings', disabled: true },
  { label: 'Software Upgrade', disabled: true },
  { label: 'Water Regulation Setting', disabled: true },
]

export const maintenanceItems: MenuItem[] = [
  { id: 'warnings', label: 'Warnings' },
  { label: 'Recommended', disabled: true },
  { id: 'history', label: 'Event History' },
  { label: 'Reboot Display', disabled: true },
  { label: 'Clean Display', disabled: true },
  { label: 'Log File', disabled: true },
]
