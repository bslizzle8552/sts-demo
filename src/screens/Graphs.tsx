import { useState } from 'react'
import type { AppState } from '../types'

type GraphView = 'menu' | 'temperature' | 'pressure' | 'current'

const graphAssets: Record<GraphView, string> = {
  menu: 'sts-graphs-menu-manual.png',
  temperature: 'sts-temperature-chart-manual.png',
  pressure: 'sts-pressure-chart-manual.png',
  current: 'sts-current-chart-manual.png',
}

export function Graphs({ state, onBack, onHome }: { state: AppState; onBack: () => void; onHome: () => void }) {
  const [view, setView] = useState<GraphView>('menu')
  const asset = `${import.meta.env.BASE_URL}assets/${graphAssets[view]}`.replace(/\/{2,}/g, '/')
  const now = new Date()

  const backAction = view === 'menu' ? onBack : () => setView('menu')

  return (
    <div className={`manual-reference-screen graph-reference-screen graph-${view}-screen`}>
      <img className="manual-reference-image" src={asset} alt="" />
      <button className="manual-info-back" type="button" onClick={backAction} aria-label="Back" />
      <button className="manual-info-home" type="button" onClick={onHome} aria-label="Home" />
      {view === 'menu' ? (
        <>
          <div className="manual-info-pressure">{state.readings.linePressure.toFixed(0)}psi</div>
          <time className="manual-clock manual-info-clock" dateTime={now.toISOString()}>
            <span>{now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' })}</span>
            <span>{now.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}</span>
          </time>
          <button className="graph-hotspot graph-temperature" type="button" onClick={() => setView('temperature')} aria-label="Temperature" />
          <button className="graph-hotspot graph-pressure" type="button" onClick={() => setView('pressure')} aria-label="Pressure" />
          <button className="graph-hotspot graph-current" type="button" onClick={() => setView('current')} aria-label="Current" />
        </>
      ) : (
        <>
          <button className="graph-hotspot graph-pause" type="button" aria-label="Pause chart" />
          <button className="graph-hotspot graph-play" type="button" aria-label="Play chart" />
          <button className="graph-hotspot graph-time-range" type="button" aria-label="Time Range" />
        </>
      )}
    </div>
  )
}
