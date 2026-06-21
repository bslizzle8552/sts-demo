import type { AppState } from '../types'

export function Graphs({ state }: { state: AppState }) {
  const points = state.history.length ? state.history : [{ time: 0, pressure: state.readings.linePressure, capacity: state.readings.capacity, kw: state.readings.packageKw, temp: state.readings.dischargeTemp }]
  const width = 720
  const height = 300
  const makePath = (key: 'pressure' | 'capacity' | 'kw' | 'temp', max: number) =>
    points
      .map((point, index) => {
        const x = (index / Math.max(1, points.length - 1)) * width
        const y = height - (Math.min(max, point[key]) / max) * height
        return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
      })
      .join(' ')

  return (
    <div className="graph-panel">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Trend graph">
        <rect width={width} height={height} />
        {[0, 1, 2, 3, 4].map((line) => <line key={line} x1="0" x2={width} y1={(line * height) / 4} y2={(line * height) / 4} />)}
        <path className="pressure" d={makePath('pressure', 210)} />
        <path className="capacity" d={makePath('capacity', 100)} />
        <path className="kw" d={makePath('kw', 100)} />
        <path className="temp" d={makePath('temp', 260)} />
      </svg>
      <div className="legend">
        <span className="pressure">Line psig</span>
        <span className="capacity">Capacity %</span>
        <span className="kw">Package kW</span>
        <span className="temp">Temp F</span>
      </div>
    </div>
  )
}
