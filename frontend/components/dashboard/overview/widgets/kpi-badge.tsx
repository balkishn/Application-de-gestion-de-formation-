'use client'

import { useEffect, useState } from 'react'
import { easeOut, MUTED } from '../helpers'

function useCounter(target: number, dur = 1200) {
  const [v, setV] = useState(0)

  useEffect(() => {
    let start: number | null = null

    const tick = (ts: number) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / dur, 1)
      setV(Math.round(target * easeOut(progress)))
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [target, dur])

  return v
}

interface KPIBadgeProps {
  icon: string
  label: string
  value: number
  sub?: string
  color: string
}

export function KPIBadge({ icon, label, value, sub, color }: KPIBadgeProps) {
  const v = useCounter(value || 0, 1200)

  return (
    <div style={{ background: `${color}0f`, border: `1.5px solid ${color}28`, borderRadius: 14, padding: '13px 10px', textAlign: 'center' }}>
      <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: 20, fontWeight: 800, color, lineHeight: 1 }}>{v.toLocaleString()}</div>
      <div style={{ fontSize: 11, fontWeight: 600, color, marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 9, color: MUTED, marginTop: 2 }}>{sub}</div>}
    </div>
  )
}
