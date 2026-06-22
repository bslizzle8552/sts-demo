import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import type { ReactNode } from 'react'

export interface ManualInfoField {
  key: string
  value: string
  x: number
  y: number
  width: number
  height?: number
  className?: string
}

interface ManualInfoScreenProps {
  assetName: string
  fields: ManualInfoField[]
  linePressure: number
  onBack: () => void
  onHome: () => void
  children?: ReactNode
  className?: string
}

export function ManualInfoScreen({ assetName, fields, linePressure, onBack, onHome, children, className }: ManualInfoScreenProps) {
  const [now, setNow] = useState(() => new Date())
  const asset = `${import.meta.env.BASE_URL}assets/${assetName}`.replace(/\/{2,}/g, '/')

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <div className={`manual-reference-screen manual-info-screen ${className ?? ''}`}>
      <img className="manual-reference-image manual-info-image" src={asset} alt="" />
      {fields.map((field) => (
        <span
          key={field.key}
          className={`manual-info-field ${field.className ?? ''}`}
          style={
            {
              left: `${field.x}%`,
              top: `${field.y}%`,
              width: `${field.width}%`,
              ...(field.height ? { height: `${field.height}%` } : {}),
            } as CSSProperties
          }
        >
          {field.value}
        </span>
      ))}
      {children}
      <button className="manual-info-back" type="button" onClick={onBack} aria-label="Back" />
      <button className="manual-info-home" type="button" onClick={onHome} aria-label="Home" />
      <div className="manual-info-pressure">{linePressure.toFixed(0)}psi</div>
      <time className="manual-clock manual-info-clock" dateTime={now.toISOString()}>
        <span>{now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' })}</span>
        <span>{now.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}</span>
      </time>
    </div>
  )
}
