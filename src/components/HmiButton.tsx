interface HmiButtonProps {
  label: string
  onClick: () => void
  tone?: 'normal' | 'primary' | 'danger' | 'warning'
  disabled?: boolean
}

export function HmiButton({ label, onClick, tone = 'normal', disabled = false }: HmiButtonProps) {
  return (
    <button type="button" className={`hmi-button ${tone}`} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  )
}
