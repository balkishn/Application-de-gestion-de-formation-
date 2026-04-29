'use client'

import { useCallback, useRef, useState } from 'react'
import { AMBER, CARD, MONTHS_FR, MUTED, fmt } from '../helpers'
import { Tooltip } from './primitives'

export function CostChart({
  monthlyCosts,
  expanded = false,
}: {
  monthlyCosts: number[]
  expanded?: boolean
}) {
  const values = monthlyCosts.length === 12 ? monthlyCosts : Array(12).fill(0)
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  const [tipPos, setTipPos] = useState({ x: 0, y: 0 })
  const svgRef = useRef<SVGSVGElement | null>(null)
  const w = expanded ? 700 : 400
  const h = expanded ? 240 : 140
  const pl = expanded ? 48 : 38
  const pb = expanded ? 34 : 24
  const pt = expanded ? 18 : 14
  const pr = expanded ? 20 : 14
  const max = Math.max(...values, 1) * 1.15
  const min = 0
  const pts = values.map((v, i) => [pl + (i / 11) * (w - pl - pr), pt + (1 - (v - min) / (max - min)) * (h - pt - pb)] as const)
  const linePath = pts.map((point, i) => `${i === 0 ? 'M' : 'L'}${point[0].toFixed(1)},${point[1].toFixed(1)}`).join(' ')
  const areaPath = `${linePath} L${pts.at(-1)?.[0] || 0},${h - pb} L${pts[0]?.[0] || 0},${h - pb} Z`

  const handleMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const mx = (e.clientX - rect.left) * (w / rect.width)
    let best = 0
    let bd = Infinity

    pts.forEach(([px], i) => {
      const distance = Math.abs(px - mx)
      if (distance < bd) {
        bd = distance
        best = i
      }
    })

    setHoverIdx(best)
    setTipPos({ x: (pts[best][0] / w) * rect.width, y: (pts[best][1] / h) * rect.height })
  }, [h, pts, w])

  return (
    <div style={{ position: 'relative' }} onMouseLeave={() => setHoverIdx(null)}>
      <Tooltip x={tipPos.x} y={tipPos.y} visible={hoverIdx !== null}>
        {hoverIdx !== null && `${MONTHS_FR[hoverIdx]}: ${values[hoverIdx].toLocaleString()} Dt`}
      </Tooltip>
      <svg ref={svgRef} width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" onMouseMove={handleMove} style={{ cursor: 'crosshair' }}>
        <defs>
          <linearGradient id="costgrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0.3" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
          const yv = Math.round(min + p * (max - min))
          const yp = pt + (1 - p) * (h - pt - pb)
          return (
            <g key={i}>
              <line x1={pl} x2={w - pr} y1={yp} y2={yp} stroke="#d1fae5" strokeWidth={0.8} />
              <text x={pl - 4} y={yp + 3} fill={MUTED} fontSize={7} textAnchor="end">{fmt(yv)}</text>
            </g>
          )
        })}
        <path d={areaPath} fill="url(#costgrad)" />
        <path d={linePath} fill="none" stroke={AMBER} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
        {hoverIdx !== null && <line x1={pts[hoverIdx][0]} x2={pts[hoverIdx][0]} y1={pt} y2={h - pb} stroke={AMBER} strokeWidth={1} strokeDasharray="3 3" opacity={0.6} />}
        {pts.map(([px, py], i) => (
          <circle key={i} cx={px} cy={py} r={hoverIdx === i ? 5 : 3} fill={hoverIdx === i ? AMBER : CARD} stroke={AMBER} strokeWidth={1.5} style={{ transition: 'r .15s' }} />
        ))}
        {MONTHS_FR.map((month, i) => {
          const x = pl + (i / 11) * (w - pl - pr)
          return <text key={i} x={x} y={h - 5} fill={hoverIdx === i ? AMBER : MUTED} fontSize={8} textAnchor="middle" fontWeight={hoverIdx === i ? '700' : '400'}>{month}</text>
        })}
      </svg>
    </div>
  )
}
