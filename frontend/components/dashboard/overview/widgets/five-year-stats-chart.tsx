'use client'

import { useCallback, useRef, useState } from 'react'
import type { MonthlySeries } from '../types'
import { G1, G2, MUTED, ROSE, TEXT, MONTHS_FR } from '../helpers'

export function FiveYearStatsChart({
  series,
  expanded = false,
}: {
  series: MonthlySeries[]
  expanded?: boolean
}) {
  const safeSeries = series.length ? series : [{ year: new Date().getFullYear(), values: Array(12).fill(0), color: G1 }]
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)
  const yearlyTotals = safeSeries.map((item) => ({
    year: item.year,
    total: item.values.reduce((sum, value) => sum + value, 0),
    color: item.color,
    months: item.values,
  }))
  const w = expanded ? 840 : 500
  const h = expanded ? 300 : 198
  const pl = expanded ? 62 : 54
  const pb = expanded ? 50 : 40
  const pt = expanded ? 18 : 16
  const pr = expanded ? 24 : 20
  const max = Math.max(...yearlyTotals.map((item) => item.total), 1) + 2
  const barStep = (w - pl - pr) / Math.max(yearlyTotals.length, 1)
  const barWidth = Math.max(24, barStep * 0.34)
  const barCenters = yearlyTotals.map((_, i) => pl + barStep * i + barStep / 2)
  const bars = yearlyTotals.map((item, i) => [barCenters[i], pt + (1 - item.total / max) * (h - pt - pb)] as const)
  const previousYearTotal = yearlyTotals.at(-2)?.total ?? null
  const currentYearTotal = yearlyTotals.at(-1)?.total ?? null
  const trendValue = previousYearTotal && currentYearTotal !== null ? Math.round(((currentYearTotal - previousYearTotal) / Math.max(previousYearTotal, 1)) * 100) : null

  const handleMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const mx = (e.clientX - rect.left) * (w / rect.width)
    let best = 0
    let bd = Infinity
    barCenters.forEach((px, i) => {
      const distance = Math.abs(px - mx)
      if (distance < bd) {
        bd = distance
        best = i
      }
    })
    setHoverIdx(best)
  }, [barCenters, w])

  return (
    <div
      style={{
        position: 'relative',
        padding: '12px 12px 8px',
        borderRadius: 16,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(240,250,244,0.9) 100%)',
        border: '1px solid rgba(16, 163, 74, 0.10)',
        boxShadow: '0 10px 30px rgba(16, 163, 74, 0.08)',
      }}
      onMouseLeave={() => setHoverIdx(null)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 10, color: G2, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Statistiques sur 5 ans</div>
          <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>Volume annuel des formations</div>
        </div>
        <div style={{ fontSize: 10, color: MUTED, background: 'rgba(22, 163, 74, 0.08)', border: '1px solid rgba(22, 163, 74, 0.14)', padding: '4px 9px', borderRadius: 999 }}>5 ans</div>
      </div>

      {trendValue !== null && (
        <div style={{ marginBottom: 8, fontSize: 11, color: MUTED, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: trendValue >= 0 ? G1 : ROSE, display: 'inline-block' }} />
          {trendValue >= 0 ? '+' : ''}{trendValue}% vs l'annee precedente
        </div>
      )}

      {hoverIdx !== null && (
        <div
          style={{
            position: 'absolute',
            left: `${(barCenters[hoverIdx] / w) * 100}%`,
            top: 6,
            transform: 'translate(-50%,0)',
            background: 'linear-gradient(180deg, rgba(26, 46, 31, 0.98) 0%, rgba(14, 33, 20, 0.98) 100%)',
            color: 'white',
            borderRadius: 14,
            padding: '10px 12px',
            fontSize: 11,
            fontWeight: 700,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 10,
            boxShadow: '0 14px 30px rgba(0,0,0,0.18)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.8 }}>{yearlyTotals[hoverIdx]?.year}</div>
          <div style={{ fontSize: 18, fontWeight: 900, marginTop: 2, marginBottom: 8, color: '#ffffff' }}>{yearlyTotals[hoverIdx]?.total || 0}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, max-content)', gap: '4px 12px', fontSize: 10, fontWeight: 600, lineHeight: 1.2, alignItems: 'center' }}>
            {MONTHS_FR.map((month, monthIndex) => (
              <div key={month} style={{ display: 'contents' }}>
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>{month}</span>
                <span style={{ color: 'white', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{yearlyTotals[hoverIdx]?.months?.[monthIndex] || 0}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <svg ref={svgRef} width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" onMouseMove={handleMove} style={{ cursor: 'crosshair', overflow: 'visible' }}>
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.98" />
            <stop offset="100%" stopColor="#15803d" stopOpacity="0.98" />
          </linearGradient>
          <linearGradient id="barGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#86efac" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#86efac" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, Math.ceil(max / 3), Math.ceil((max / 3) * 2), max].filter((v, i, arr) => arr.indexOf(v) === i).map((v) => {
          const y = pt + (1 - v / max) * (h - pt - pb)
          return (
            <g key={v}>
              <line x1={pl} x2={w - pr} y1={y} y2={y} stroke="#d7f5df" strokeDasharray="4 4" strokeWidth={0.8} opacity={0.9} />
              <text x={pl - 8} y={y + 3} fill={MUTED} fontSize={8} textAnchor="end" fontWeight={600}>{v}</text>
            </g>
          )
        })}
        {hoverIdx !== null && <line x1={barCenters[hoverIdx]} x2={barCenters[hoverIdx]} y1={pt} y2={h - pb} stroke="#16a34a" strokeWidth={1} strokeDasharray="3 3" opacity={0.24} />}
        {yearlyTotals.map((item, i) => {
          const [x] = bars[i]
          const barH = (item.total / max) * (h - pt - pb)
          const topY = h - pb - barH
          const isHover = hoverIdx === i
          return (
            <g key={item.year}>
              <rect x={x - barWidth / 2 - 1} y={topY - 1} width={barWidth + 2} height={barH + 2} rx={10} fill="url(#barGlow)" opacity={isHover ? 1 : 0.55} />
              <rect
                x={x - barWidth / 2}
                y={topY}
                width={barWidth}
                height={barH}
                rx={8}
                fill="url(#barGradient)"
                opacity={isHover ? 1 : 0.86}
                stroke={isHover ? '#0f5132' : 'rgba(255,255,255,0.35)'}
                strokeWidth={isHover ? 1.5 : 0}
                style={{ cursor: 'pointer', transition: 'opacity .15s, transform .15s', filter: isHover ? 'drop-shadow(0 10px 16px rgba(21, 128, 61, 0.22))' : 'none' }}
                onMouseEnter={() => setHoverIdx(i)}
              />
              <text x={x} y={h - 12} fill={isHover ? TEXT : MUTED} fontSize={9} textAnchor="middle" fontWeight={isHover ? '800' : '600'}>{item.year}</text>
              <text x={x} y={topY - 7} fill={isHover ? G2 : MUTED} fontSize={9} textAnchor="middle" fontWeight={800}>{item.total}</text>
            </g>
          )
        })}
      </svg>
      <div style={{ display: 'flex', gap: 10, marginTop: 8, justifyContent: 'center', fontSize: 10, color: MUTED }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 18, height: 2.5, background: 'linear-gradient(90deg, #34d399 0%, #15803d 100%)', display: 'inline-block', borderRadius: 2 }} />5 ans de statistiques
        </div>
      </div>
    </div>
  )
}
