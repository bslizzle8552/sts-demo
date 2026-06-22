import type { AppState } from '../types'
import { ManualInfoScreen, type ManualInfoField } from './ManualInfoScreen'

interface MachineInformationProps {
  state: AppState
  onBack: () => void
  onHome: () => void
}

export function MachineInformation({ state, onBack, onHome }: MachineInformationProps) {
  const r = state.readings
  const compressorEnabledHours = r.runHours + 13.4
  const fullLoadedHours = Math.max(0, r.loadedHours * 0.84)
  const oilPressure = Math.max(0, r.sumpPressure - 7)
  const oilFilterPressure = Math.max(0, oilPressure - 3)
  const fields: ManualInfoField[] = [
    { key: 'machine-hours', value: `${compressorEnabledHours.toFixed(1)} hrs`, x: 26.7, y: 27.7, width: 16.2 },
    { key: 'enabled-hours', value: `${compressorEnabledHours.toFixed(1)} hrs`, x: 26.7, y: 35.1, width: 16.2 },
    { key: 'motor-running-hours', value: `${r.runHours.toFixed(2)} hrs`, x: 26.7, y: 42.5, width: 16.2 },
    { key: 'loaded-hours', value: `${r.loadedHours.toFixed(2)} hrs`, x: 26.7, y: 49.9, width: 16.2 },
    { key: 'full-loaded-hours', value: `${fullLoadedHours.toFixed(2)} hrs`, x: 26.7, y: 57.3, width: 16.2 },
    { key: 'starts', value: r.starts.toString(), x: 31.8, y: 64.7, width: 11.1 },
    { key: 'loaded-cycles', value: r.loadCycles.toString(), x: 31.8, y: 72.1, width: 11.1 },
    { key: 'discharge-temperature', value: `${r.dischargeTemp.toFixed(0)} F`, x: 73.1, y: 18.1, width: 17.5 },
    { key: 'dry-side-temperature', value: 'N/A', x: 78.1, y: 25.5, width: 12.5 },
    { key: 'sump-pressure', value: `${r.sumpPressure.toFixed(0)} psi`, x: 75.4, y: 32.9, width: 15.2 },
    { key: 'line-pressure', value: `${r.linePressure.toFixed(0)} psi`, x: 75.4, y: 40.3, width: 15.2 },
    { key: 'oil-filter-pressure', value: `${oilFilterPressure.toFixed(0)} psi`, x: 75.4, y: 47.7, width: 15.2 },
    { key: 'oil-pressure', value: `${oilPressure.toFixed(0)} psi`, x: 75.4, y: 55.1, width: 15.2 },
    { key: 'separator-delta', value: `${r.separatorDelta.toFixed(1)} psi`, x: 75.4, y: 62.5, width: 15.2 },
    { key: 'machine-current', value: `${r.machineCurrent.toFixed(1)} A`, x: 75.4, y: 69.9, width: 15.2 },
  ]

  return (
    <ManualInfoScreen
      assetName="sts-machine-info-manual.png"
      fields={fields}
      linePressure={r.linePressure}
      onBack={onBack}
      onHome={onHome}
    />
  )
}
