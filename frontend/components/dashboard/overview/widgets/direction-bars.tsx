'use client'

import { useState } from 'react'
import type { DirectionBreakdown } from '../types'
import { DOMAIN_COLORS, MUTED, TEXT } from '../helpers'
import { Tooltip } from './primitives'

export function DirectionBars({ directions }: { directions: DirectionBreakdown[] }) {
  const [hov, setHov] = useState<number | null>(null)
  const [tip, setTip] = useState({ x: 0, y: 0, text: '' })
  const w = 340
  const h = 150
  const pl = 40
  const pb = 28
  const pt = 12
  const pr = 10
  const max = Math.max(...directions.map((direction) => direction.participants || 0), 0) + 15
  const bw = ((w - pl - pr) / Math.max(directions.length, 1)) * 0.55

  return (
    <div style={{ position: 'relative' }} onMouseLeave={() => setHov(null)}>
      {hov !== null && <Tooltip x={tip.x} y={tip.y} visible>{tip.text}</Tooltip>}
      <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        {[0, 25, 50, 75, 100].filter((v) => v <= max).map((v) => {
          const y = pt + (1 - v / max) * (h - pt - pb)
          return (
            <g key={v}>
              <line x1={pl} x2={w - pr} y1={y} y2={y} stroke="#d1fae5" strokeWidth={0.8} />
              <text x={pl - 4} y={y + 3} fill={MUTED} fontSize={7} textAnchor="end">{v}</text>
            </g>
          )
        })}
        {directions.map((direction, i) => {
          const cx = pl + i * ((w - pl - pr) / Math.max(directions.length, 1)) + (w - pl - pr) / Math.max(directions.length, 1) / 2
          const barH = ((direction.participants || 0) / max) * (h - pt - pb)
          const isHover = hov === i
          const color = DOMAIN_COLORS[i % DOMAIN_COLORS.length]
          return (
            <g key={i}>
              <rect
                x={cx - bw / 2}
                y={h - pb - barH}
                width={bw}
                height={barH}
                fill={color}
                rx={3}
                opacity={hov === null || isHover ? 0.85 : 0.3}
                style={{ cursor: 'pointer', transition: 'opacity .15s' }}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.ownerSVGElement?.getBoundingClientRect()
                  if (!rect) return
                  setHov(i)
                  setTip({
                    x: (cx / w) * rect.width,
                    y: ((h - pb - barH) / h) * rect.height,
                    text: `${direction.name}: ${direction.participants || 0} participants`,
                  })
                }}
              />
              {isHover && <text x={cx} y={h - pb - barH - 4} textAnchor="middle" fill={color} fontSize={9} fontWeight="700">{direction.participants || 0}</text>}
              <text x={cx} y={h - pb + 10} textAnchor="middle" fill={isHover ? TEXT : MUTED} fontSize={8} fontWeight={isHover ? '700' : '400'}>{direction.name}</text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export function DirectionBarsExpanded({ directions }: { directions: DirectionBreakdown[] }) {
  const [hov, setHov] = useState<number | null>(null)
  const [tip, setTip] = useState({ x: 0, y: 0, text: '' })
  const w = 640
  const h = 260
  const pl = 56
  const pb = 42
  const pt = 18
  const pr = 20
  const max = Math.max(...directions.map((direction) => direction.participants || 0), 10) + 15
  const bw = ((w - pl - pr) / Math.max(directions.length, 1)) * 0.55

  return (
    <div style={{ position: 'relative' }} onMouseLeave={() => setHov(null)}>
      {hov !== null && <Tooltip x={tip.x} y={tip.y} visible>{tip.text}</Tooltip>}
      <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ height: 320 }}>
        {[0, 25, 50, 75, 100].filter((v) => v <= max).map((v) => {
          const y = pt + (1 - v / max) * (h - pt - pb)
          return (
            <g key={v}>
              <line x1={pl} x2={w - pr} y1={y} y2={y} stroke="#d1fae5" strokeWidth={1} />
              <text x={pl - 6} y={y + 4} fill={MUTED} fontSize={10} textAnchor="end">{v}</text>
            </g>
          )
        })}
        {directions.map((direction, i) => {
          const cx = pl + i * ((w - pl - pr) / Math.max(directions.length, 1)) + (w - pl - pr) / Math.max(directions.length, 1) / 2
          const barH = ((direction.participants || 0) / max) * (h - pt - pb)
          const isHover = hov === i
          const color = DOMAIN_COLORS[i % DOMAIN_COLORS.length]
          return (
            <g key={i}>
              <rect
                x={cx - bw / 2}
                y={h - pb - barH}
                width={bw}
                height={barH}
                fill={color}
                rx={4}
                opacity={hov === null || isHover ? 0.9 : 0.35}
                style={{ cursor: 'pointer', transition: 'opacity .15s' }}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.ownerSVGElement?.getBoundingClientRect()
                  if (!rect) return
                  setHov(i)
                  setTip({
                    x: (cx / w) * rect.width,
                    y: ((h - pb - barH) / h) * rect.height,
                    text: `${direction.name}: ${direction.participants || 0} participants`,
                  })
                }}
              />
              <text x={cx} y={h - pb + 16} textAnchor="middle" fill={isHover ? TEXT : MUTED} fontSize={10} fontWeight={isHover ? '700' : '500'}>{direction.name}</text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
