'use client'

import { CARD2, DIM, G1, G2, MUTED, TEAL } from '../helpers'

interface BloomProps {
  value: number
  label: string
}

export function Bloom({ value, label }: BloomProps) {
  return (
    <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto' }}>
      <svg width={100} height={100} viewBox="0 0 100 100" style={{ position: 'absolute', animation: 'spin 22s linear infinite' }}>
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2
          const cx = 50 + 22 * Math.cos(a)
          const cy = 50 + 22 * Math.sin(a)
          const color = i % 2 === 0 ? G1 : TEAL
          return <ellipse key={i} cx={cx} cy={cy} rx={18} ry={10} fill={color} opacity={0.28} transform={`rotate(${(i / 8) * 360} ${cx} ${cy})`} />
        })}
      </svg>
      <svg width={100} height={100} viewBox="0 0 100 100" style={{ position: 'absolute' }}>
        <circle cx={50} cy={50} r={27} fill={CARD2} stroke={DIM} strokeWidth={2} />
        <text x={50} y={47} textAnchor="middle" fill={G2} fontSize={13} fontWeight="800">{value || 0}</text>
        <text x={50} y={61} textAnchor="middle" fill={MUTED} fontSize={8}>{label}</text>
      </svg>
    </div>
  )
}
