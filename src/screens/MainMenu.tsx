import { useEffect, useState } from 'react'
import type { ScreenId } from '../types'

const mainMenuItems: Array<{ id: ScreenId; label: string }> = [
  { id: 'systemInfo', label: 'System Information' },
  { id: 'systemConfig', label: 'System Configuration' },
  { id: 'maintenance', label: 'Maintenance' },
  { id: 'login', label: 'Log In' },
]

interface MainMenuProps {
  linePressure: number
  onBack: () => void
  onHome: () => void
  setScreen: (screen: ScreenId) => void
}

export function MainMenu({ linePressure, onBack, onHome, setScreen }: MainMenuProps) {
  return (
    <div className="sts-touch-menu">
      <MenuHeader title="Main Menu" onBack={onBack} onHome={onHome} />
      <div className="sts-menu-body main">
        <div className="main-menu-buttons">
        {mainMenuItems.map((item) => (
          <button key={item.id} type="button" onClick={() => setScreen(item.id)}>
            {item.label}
          </button>
        ))}
        </div>
      </div>
      <TouchscreenFooter linePressure={linePressure} />
    </div>
  )
}

export function MenuHeader({ title, onBack, onHome }: { title: string; onBack: () => void; onHome: () => void }) {
  const backIcon = `${import.meta.env.BASE_URL}assets/sts-back-icon.png`.replace(/\/{2,}/g, '/')
  const homeIcon = `${import.meta.env.BASE_URL}assets/sts-home-icon.png`.replace(/\/{2,}/g, '/')

  return (
    <header className="sts-touch-header">
      <button type="button" onClick={onBack} aria-label="Back">
        <img src={backIcon} alt="" />
      </button>
      <h1>{title}</h1>
      <button type="button" onClick={onHome} aria-label="Home">
        <img src={homeIcon} alt="" />
      </button>
    </header>
  )
}

export function TouchscreenFooter({ linePressure }: { linePressure: number }) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <footer className="sts-touch-footer">
      <div className="sts-touch-pressure">{linePressure.toFixed(0)}psi</div>
      <time className="sts-touch-clock" dateTime={now.toISOString()}>
        <span>{now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' })}</span>
        <span>{now.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}</span>
      </time>
    </footer>
  )
}
