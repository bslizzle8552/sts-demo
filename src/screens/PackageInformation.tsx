import { machineProfile } from '../data/machineProfile'

export function PackageInformation() {
  return (
    <div className="info-table">
      <Row label="Full Load Package Input" value={`${machineProfile.fullLoadPackageKw} kW`} />
      <Row label="Zero Flow / No Load Input" value={`${machineProfile.noLoadPackageKw} kW`} />
      <Row label="Air-cooled Fan Motor" value={`${machineProfile.fanMotorHp} HP`} />
      <Row label="Fluid Fill" value={`${machineProfile.fluidFillGallons} gallons`} />
      <Row label="Normal Separator Delta" value={machineProfile.normalSeparatorDelta} />
    </div>
  )
}

function Row({ label, value }: { label: string | number; value: string | number }) {
  return <div><span>{label}</span><strong>{value}</strong></div>
}
