import type { ScreenId } from '../types'
import { MenuHeader, TouchscreenFooter } from './MainMenu'

export interface MenuItem {
  id?: ScreenId
  label: string
  disabled?: boolean
}

interface MenuCategoryProps {
  title: string
  items: MenuItem[]
  linePressure: number
  onBack: () => void
  onHome: () => void
  setScreen: (screen: ScreenId) => void
}

export function MenuCategory({ title, items, linePressure, onBack, onHome, setScreen }: MenuCategoryProps) {
  return (
    <div className="sts-touch-menu">
      <MenuHeader title={title} onBack={onBack} onHome={onHome} />
      <div className="sts-menu-body category">
        <div className="category-menu-buttons">
        {items.map((item) => (
          <button key={item.label} type="button" disabled={item.disabled} onClick={() => item.id && setScreen(item.id)}>
            {item.label}
          </button>
        ))}
        </div>
      </div>
      <TouchscreenFooter linePressure={linePressure} />
    </div>
  )
}
