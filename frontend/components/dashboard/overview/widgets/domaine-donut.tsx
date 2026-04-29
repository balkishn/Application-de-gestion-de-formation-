'use client'

import { useState } from 'react'
import type { DomainBreakdown } from '../types'
import { DIM, DOMAIN_COLORS, G1, G2, MUTED, TEXT } from '../helpers'

export function DomaineDonut({ domains }: { domains: DomainBreakdown[] }) {
  const [hovered, setHovered] = useState<number | null>(null)
  const [expanded, setExpanded] = useState(false)
  const size = expanded ? 220 : 120
  const stroke = expanded ? 28 : 18
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const total = domains.reduce((sum, domain) => sum + domain.pct, 0)
  let offset = 0

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: expanded ? 24 : 10, flexWrap: 'wrap', justifyContent: 'center' }}>
        <div
          style={{ position: 'relative', width: size, height: size, cursor: 'pointer', flexShrink: 0, transition: 'all .3s' }}
          onClick={() => setExpanded((value) => !value)}
          title={expanded ? 'Reduire' : 'Agrandir'}
        >
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            {hovered !== null ? (
              <>
                <span style={{ fontSize: expanded ? 22 : 14, fontWeight: 800, color: DOMAIN_COLORS[hovered] }}>{domains[hovered]?.pct || 0}%</span>
                <span style={{ fontSize: expanded ? 10 : 8, color: MUTED, textAlign: 'center', maxWidth: size * 0.6 }}>{domains[hovered]?.name}</span>
              </>
            ) : (
              <>
                <span style={{ fontSize: expanded ? 12 : 9, color: MUTED }}>Domaines</span>
                <span style={{ fontSize: expanded ? 11 : 8, color: TEXT, fontWeight: 600 }}>{domains.length} total</span>
                <span style={{ fontSize: expanded ? 9 : 7, color: MUTED, marginTop: 2 }}>{expanded ? 'Reduire' : 'Agrandir'}</span>
              </>
            )}
          </div>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={DIM} strokeWidth={stroke} />
            {domains.map((domain, index) => {
              const dash = total > 0 ? (domain.pct / total) * circumference : 0
              const circle = (
                <circle
                  key={index}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={DOMAIN_COLORS[index % DOMAIN_COLORS.length]}
                  strokeWidth={hovered === index ? stroke + 4 : stroke}
                  strokeDasharray={`${dash - 2} ${circumference - dash + 2}`}
                  strokeDashoffset={-offset}
                  strokeLinecap="round"
                  style={{ cursor: 'pointer', transition: 'stroke-width .15s' }}
                  onMouseEnter={() => setHovered(index)}
                  onMouseLeave={() => setHovered(null)}
                />
              )
              offset += dash
              return circle
            })}
          </svg>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: expanded ? 7 : 4 }}>
          {domains.map((domain, index) => (
            <div
              key={index}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'default', opacity: hovered === null || hovered === index ? 1 : 0.45, transition: 'opacity .15s' }}
            >
              <span style={{ width: 8, height: 8, borderRadius: 2, background: DOMAIN_COLORS[index % DOMAIN_COLORS.length], display: 'inline-block', flexShrink: 0 }} />
              <span style={{ fontSize: expanded ? 11 : 9, color: TEXT }}>{domain.name}</span>
              <span style={{ fontSize: expanded ? 11 : 9, fontWeight: 700, color: DOMAIN_COLORS[index % DOMAIN_COLORS.length], marginLeft: 'auto', paddingLeft: 8 }}>{domain.pct}%</span>
            </div>
          ))}
        </div>
      </div>
      {expanded && (
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <button
            onClick={() => setExpanded(false)}
            style={{ background: `${G1}15`, border: `1px solid ${G1}44`, borderRadius: 20, padding: '4px 14px', fontSize: 10, color: G2, cursor: 'pointer', fontWeight: 600 }}
          >
            Reduire
          </button>
        </div>
      )}
    </div>
  )
}
