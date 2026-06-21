import type { ScreenId } from '../types'

export interface MenuItem {
  id?: ScreenId
  label: string
  disabled?: boolean
}

interface MenuCategoryProps {
  title: string
  items: MenuItem[]
  setScreen: (screen: ScreenId) => void
}

export function MenuCategory({ title, items, setScreen }: MenuCategoryProps) {
  return (
    <div className="sts-menu-screen">
      <h1>{title}</h1>
      <div className="category-menu-buttons">
        {items.map((item) => (
          <button key={item.label} type="button" disabled={item.disabled} onClick={() => item.id && setScreen(item.id)}>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}
