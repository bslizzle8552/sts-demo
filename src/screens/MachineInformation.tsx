import { machineProfile } from '../data/machineProfile'

export function MachineInformation() {
  return (
    <div className="info-table">
      <Row label="Model" value={machineProfile.model} />
      <Row label="Type" value={machineProfile.type} />
      <Row label="Stages" value={machineProfile.stages} />
      <Row label="Cooling" value={machineProfile.cooling} />
      <Row label="Motor" value={`${machineProfile.motorHp} HP`} />
      <Row label="Rated Pressure" value={`${machineProfile.ratedPressure} psig`} />
      <Row label="Full Load Pressure" value={`${machineProfile.fullLoadOperatingPressure} psig`} />
      <Row label="Full Load Capacity" value={`${machineProfile.fullLoadCapacity} ACFM`} />
    </div>
  )
}

function Row({ label, value }: { label: string; value: string | number }) {
  return <div><span>{label}</span><strong>{value}</strong></div>
}
