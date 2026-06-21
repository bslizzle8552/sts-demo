import type { ScreenId } from '../types'

interface BottomNavProps {
  active: ScreenId
  onNavigate: (screen: ScreenId) => void
}

const nav: Array<{ id: ScreenId; label: string }> = [
  { id: 'mimic', label: 'Mimic' },
  { id: 'analog', label: 'Analog' },
  { id: 'multigauge', label: 'Gauges' },
  { id: 'menu', label: 'Menu' },
]

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <nav className="bottom-nav">
      {nav.map((item) => (
        <button key={item.id} type="button" className={active === item.id ? 'active' : ''} onClick={() => onNavigate(item.id)}>
          {item.label}
        </button>
      ))}
    </nav>
  )
}
