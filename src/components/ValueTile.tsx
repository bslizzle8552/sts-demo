interface ValueTileProps {
  label: string
  value: string | number
  unit?: string
  tone?: 'normal' | 'warning' | 'fault'
  className?: string
}

export function ValueTile({ label, value, unit, tone = 'normal', className = '' }: ValueTileProps) {
  return (
    <div className={`value-tile ${tone} ${className}`}>
      <span className="value-label">{label}</span>
      <strong>{value}</strong>
      {unit && <span className="value-unit">{unit}</span>}
    </div>
  )
}
