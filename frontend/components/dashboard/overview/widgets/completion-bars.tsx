'use client'

import { useState } from 'react'
import type { CompletionItem, CompletionStatus } from '../types'
import { BLUE, G1, MUTED, TEAL, TEXT, DIM } from '../helpers'

export function CompletionBars({
  items,
  expanded = false,
}: {
  items: CompletionItem[]
  expanded?: boolean
}) {
  const completions = items.length ? items : [{ label: 'Aucune formation', val: 0, status: 'upcoming' as const }]
  const [hovered, setHovered] = useState<number | null>(null)
  const statusSummary: Array<{ status: CompletionStatus; label: string; color: string; count: number }> = [
    {
      status: 'ongoing',
      label: 'En cours',
      color: TEAL,
      count: completions.filter((item) => item.status === 'ongoing').length,
    },
    {
      status: 'upcoming',
      label: 'A venir',
      color: BLUE,
      count: completions.filter((item) => item.status === 'upcoming').length,
    },
    {
      status: 'done',
      label: 'Terminee',
      color: G1,
      count: completions.filter((item) => item.status === 'done').length,
    },
  ]

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: expanded ? 'repeat(3, minmax(0, 1fr))' : 'repeat(3, minmax(0, 1fr))',
          gap: expanded ? 10 : 8,
          marginBottom: expanded ? 16 : 12,
        }}
      >
        {statusSummary.map((entry) => (
          <div
            key={entry.status}
            style={{
              border: `1px solid ${entry.color}33`,
              background: `${entry.color}12`,
              borderRadius: 10,
              padding: expanded ? '10px 12px' : '8px 10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span
                style={{
                  width: expanded ? 10 : 8,
                  height: expanded ? 10 : 8,
                  borderRadius: 999,
                  background: entry.color,
                  display: 'inline-block',
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: expanded ? 11 : 10, color: MUTED }}>{entry.label}</span>
            </div>
            <div style={{ fontSize: expanded ? 18 : 15, fontWeight: 800, color: entry.color }}>{entry.count}</div>
          </div>
        ))}
      </div>

      {completions.map((item, index) => (
        <div key={index} onMouseEnter={() => setHovered(index)} onMouseLeave={() => setHovered(null)} style={{ marginBottom: expanded ? 14 : 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: expanded ? 13 : 11, color: TEXT, marginBottom: 4 }}>
            <span>{item.label}</span>
            <span style={{ fontWeight: 700, color: item.status === 'done' ? G1 : item.status === 'ongoing' ? TEAL : BLUE }}>{item.val}%</span>
          </div>
          <div style={{ background: DIM, borderRadius: 10, height: expanded ? 12 : 8, overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', paddingLeft: 4 }}>
              <div
                style={{
                  height: expanded ? 8 : 4,
                  borderRadius: 6,
                  background: item.status === 'done' ? G1 : item.status === 'ongoing' ? TEAL : BLUE,
                  transition: 'width 1.2s ease',
                  width: `${item.val}%`,
                }}
              />
            </div>
          </div>
          <div style={{ fontSize: expanded ? 10 : 9, color: hovered === index ? TEXT : MUTED, marginTop: expanded ? 4 : 2 }}>
            {item.status === 'done' ? 'Terminee' : item.status === 'ongoing' ? 'En cours' : 'A venir'}
          </div>
        </div>
      ))}
    </div>
  )
}
