interface CapacityBarProps {
  value: number
}

export function CapacityBar({ value }: CapacityBarProps) {
  const percent = Math.max(0, Math.min(100, value))
  return (
    <div className="capacity-wrap">
      <div className="capacity-header">
        <span>Capacity</span>
        <strong>{percent.toFixed(0)}%</strong>
      </div>
      <div className="capacity-track">
        <div className="capacity-fill" style={{ width: `${percent}%` }} />
      </div>
      <div className="capacity-scale">
        <span>0</span>
        <span>55</span>
        <span>80</span>
        <span>100</span>
      </div>
    </div>
  )
}
