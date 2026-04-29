'use client'

import type React from 'react'
import { useEffect, useRef } from 'react'
import { G1, TEXT } from '../helpers'

export function Particles() {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const leaves = Array.from({ length: 18 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 2 + Math.random() * 4,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -0.15 - Math.random() * 0.35,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.014,
      alpha: 0.06 + Math.random() * 0.14,
      hue: 115 + Math.random() * 50,
    }))

    let raf = 0

    function draw() {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const t = Date.now()

      leaves.forEach((leaf) => {
        ctx.save()
        ctx.translate(leaf.x, leaf.y)
        ctx.rotate(leaf.rot)
        ctx.globalAlpha = leaf.alpha
        ctx.beginPath()
        ctx.moveTo(0, -leaf.size)
        ctx.bezierCurveTo(leaf.size, -leaf.size * 0.5, leaf.size, leaf.size * 0.5, 0, leaf.size)
        ctx.bezierCurveTo(-leaf.size, leaf.size * 0.5, -leaf.size, -leaf.size * 0.5, 0, -leaf.size)
        ctx.fillStyle = `hsl(${leaf.hue},65%,38%)`
        ctx.fill()
        ctx.restore()

        leaf.x += leaf.vx + Math.sin(t / 2200 + leaf.y * 0.01) * 0.18
        leaf.y += leaf.vy
        leaf.rot += leaf.vr

        if (leaf.y < -20) {
          leaf.y = canvas.height + 20
          leaf.x = Math.random() * canvas.width
        }
      })

      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(raf)
  }, [])

  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
}

export function Card({
  children,
  style = {},
  className,
  onClick,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
  className?: string
  onClick?: () => void
}) {
  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        background: '#ffffff',
        borderRadius: 16,
        padding: '14px 16px',
        border: '1.5px solid #dcfce7',
        boxShadow: '0 2px 16px #16a34a0d,0 1px 3px #00000008',
        position: 'relative',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function Title({ children, accent }: { children: React.ReactNode; accent?: string }) {
  const color = accent || G1
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
      <span style={{ width: 3, height: 12, background: color, borderRadius: 2, display: 'inline-block' }} />
      <span style={{ fontSize: 11, color, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{children}</span>
    </div>
  )
}

export function Tooltip({
  x,
  y,
  children,
  visible,
}: {
  x: number
  y: number
  children: React.ReactNode
  visible: boolean
}) {
  if (!visible) return null

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%,-115%)',
        background: TEXT,
        color: 'white',
        borderRadius: 6,
        padding: '4px 9px',
        fontSize: 10,
        fontWeight: 600,
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        zIndex: 20,
        boxShadow: '0 2px 8px #0003',
      }}
    >
      {children}
    </div>
  )
}
