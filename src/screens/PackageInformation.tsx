import { machineProfile } from '../data/machineProfile'
import { ManualInfoScreen, type ManualInfoField } from './ManualInfoScreen'

interface PackageInformationProps {
  linePressure: number
  onBack: () => void
  onHome: () => void
}

export function PackageInformation({ linePressure, onBack, onHome }: PackageInformationProps) {
  const initialized = new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })
  const fields: ManualInfoField[] = [
    { key: 'model', value: machineProfile.model, x: 54.4, y: 24.2, width: 18.2 },
    { key: 'hp', value: machineProfile.motorHp.toString(), x: 54.4, y: 30.1, width: 18.2 },
    { key: 'pressure', value: `${machineProfile.fullLoadOperatingPressure} psi`, x: 54.4, y: 35.9, width: 18.2 },
    { key: 'hz', value: machineProfile.frequencyHz.toString(), x: 54.4, y: 41.8, width: 18.2 },
    { key: 'modulation', value: machineProfile.modulationCode, x: 54.4, y: 47.7, width: 18.2 },
    { key: 'cooling', value: 'Air Cooled', x: 54.4, y: 53.6, width: 18.2 },
    { key: 'starter', value: machineProfile.starter, x: 54.4, y: 59.5, width: 18.2 },
    { key: 'volts', value: machineProfile.voltage.toString(), x: 54.4, y: 65.4, width: 18.2 },
    { key: 'dryer', value: 'No', x: 54.4, y: 71.3, width: 18.2 },
    { key: 'initialization-date', value: initialized, x: 54.4, y: 77.2, width: 18.2 },
  ]

  return (
    <ManualInfoScreen
      assetName="sts-package-info-manual.png"
      fields={fields}
      linePressure={linePressure}
      onBack={onBack}
      onHome={onHome}
    />
  )
}
