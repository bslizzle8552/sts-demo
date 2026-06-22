import { useEffect, useState } from 'react'
import type { ScreenId } from '../types'

interface MaintenanceMenuProps {
  linePressure: number
  onBack: () => void
  onHome: () => void
  setScreen: (screen: ScreenId) => void
}

const maintenanceTargets: Array<{ id: ScreenId; label: string; className: string }> = [
  { id: 'warnings', label: 'Warnings', className: 'maintenance-warnings' },
  { id: 'recommendedService', label: 'Recommended Service', className: 'maintenance-service' },
  { id: 'history', label: 'Event History', className: 'maintenance-history' },
  { id: 'rebootDisplay', label: 'Reboot Display', className: 'maintenance-reboot' },
  { id: 'cleanDisplay', label: 'Clean Display', className: 'maintenance-clean' },
  { id: 'logFile', label: 'Log File', className: 'maintenance-log' },
]

export function MaintenanceMenu({ linePressure, onBack, onHome, setScreen }: MaintenanceMenuProps) {
  const [now, setNow] = useState(() => new Date())
  const asset = `${import.meta.env.BASE_URL}assets/sts-maintenance-menu-manual.png`.replace(/\/{2,}/g, '/')

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <div className="manual-reference-screen maintenance-menu-screen">
      <img className="manual-reference-image" src={asset} alt="" />
      <button className="manual-info-back" type="button" onClick={onBack} aria-label="Back" />
      <button className="manual-info-home" type="button" onClick={onHome} aria-label="Home" />
      {maintenanceTargets.map((target) => (
        <button
          key={target.id}
          className={`maintenance-menu-hotspot ${target.className}`}
          type="button"
          onClick={() => setScreen(target.id)}
          aria-label={target.label}
        />
      ))}
      <div className="manual-info-pressure">{linePressure.toFixed(0)}psi</div>
      <time className="manual-clock manual-info-clock" dateTime={now.toISOString()}>
        <span>{now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' })}</span>
        <span>{now.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}</span>
      </time>
    </div>
  )
}
