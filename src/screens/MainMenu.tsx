import type { ScreenId } from '../types'

const mainMenuItems: Array<{ id: ScreenId; label: string }> = [
  { id: 'systemInfo', label: 'System Information' },
  { id: 'systemConfig', label: 'System Configuration' },
  { id: 'maintenance', label: 'Maintenance' },
  { id: 'login', label: 'Log In' },
]

export function MainMenu({ setScreen }: { setScreen: (screen: ScreenId) => void }) {
  return (
    <div className="sts-menu-screen">
      <h1>Main Menu</h1>
      <div className="main-menu-buttons">
        {mainMenuItems.map((item) => (
          <button key={item.id} type="button" onClick={() => setScreen(item.id)}>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}
