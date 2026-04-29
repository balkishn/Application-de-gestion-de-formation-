'use client'

import { useState } from 'react'
import type { CalendarFormation } from '../types'
import { AMBER, BLUE, G1, G2, MUTED, TEXT } from '../helpers'

type DayFormation = CalendarFormation & { isFirst: boolean; dayNum: number }

export function FormationCalendar({
  formations,
  expanded = true,
}: {
  formations: CalendarFormation[]
  expanded?: boolean
}) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selected, setSelected] = useState<number | null>(null)
  const [hoveredInfo, setHoveredInfo] = useState<DayFormation[] | null>(null)
  const monthNames = ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre']
  const dayNames = ['D', 'L', 'M', 'M', 'J', 'V', 'S']
  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((year) => year - 1)
    } else {
      setViewMonth((month) => month - 1)
    }
  }

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((year) => year + 1)
    } else {
      setViewMonth((month) => month + 1)
    }
  }

  const dayMap: Record<number, DayFormation[]> = {}
  formations.forEach((formation) => {
    for (let dayOffset = 0; dayOffset < formation.days; dayOffset++) {
      const currentDate = new Date(formation.start)
      currentDate.setDate(currentDate.getDate() + dayOffset)
      if (currentDate.getFullYear() === viewYear && currentDate.getMonth() === viewMonth) {
        const day = currentDate.getDate()
        if (!dayMap[day]) dayMap[day] = []
        dayMap[day].push({ ...formation, isFirst: dayOffset === 0, dayNum: dayOffset + 1 })
      }
    }
  })

  const cells: Array<number | null> = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let day = 1; day <= daysInMonth; day++) cells.push(day)

  const selectedFormation = selected !== null ? formations.find((formation) => formation.id === selected) : null
  const activeDetail =
    hoveredInfo && hoveredInfo.length
      ? { type: 'hover' as const, data: hoveredInfo }
      : selectedFormation
        ? { type: 'selected' as const, data: selectedFormation }
        : null

  const paddedCells = [...cells]
  while (paddedCells.length < 42) {
    paddedCells.push(null)
  }

  const isToday = (day: number) => day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear()

  const getStatusColor = (status: 'past' | 'ongoing' | 'upcoming') => {
    if (status === 'past') return G1
    if (status === 'ongoing') return AMBER
    return BLUE
  }

  const getStatusAccent = (status: 'past' | 'ongoing' | 'upcoming') => {
    if (status === 'past') return G2
    if (status === 'ongoing') return AMBER
    return BLUE
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: expanded ? 460 : 100, height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <button onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED, fontSize: 14 }}>‹</button>
        <span style={{ fontWeight: 700, color: G2, fontSize: 10 }}>{monthNames[viewMonth]} {viewYear}</span>
        <button onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED, fontSize: 14 }}>›</button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
          gridTemplateRows: 'auto repeat(6, minmax(42px, 1fr))',
          gap: expanded ? 6 : 2,
          marginBottom: 8,
          flex: 1,
          alignContent: 'stretch',
        }}
      >
        {dayNames.map((dayName, index) => (
          <div key={index} style={{ textAlign: 'center', color: MUTED, fontSize: expanded ? 10 : 8, fontWeight: 700, paddingBottom: 4 }}>
            {dayName}
          </div>
        ))}

        {paddedCells.map((day, index) => {
          const formationsForDay = day ? dayMap[day] : null
          const formation = formationsForDay ? formationsForDay[0] : null
          const todayCell = day ? isToday(day) : false
          let background = 'transparent'
          let color = day ? TEXT : 'transparent'
          let border = '1px solid transparent'

          if (formation) {
            const statusColor = getStatusColor(formation.status)
            background = `${statusColor}22`
            color = getStatusAccent(formation.status)
            border = `1px solid ${statusColor}55`
          }

          if (todayCell && !formation) {
            border = `1.5px solid ${G1}`
            color = G1
          }

          return (
            <div
              key={index}
              onClick={() => day && formation && setSelected(selected === formation.id ? null : formation.id)}
              onMouseEnter={() => setHoveredInfo(formationsForDay && formationsForDay.length ? formationsForDay : null)}
              onMouseLeave={() => setHoveredInfo(null)}
              title={formation ? formationsForDay?.map((item) => item.name).join(' | ') : ''}
              style={{
                textAlign: 'center',
                padding: expanded ? '10px 0' : '2px 0',
                borderRadius: 8,
                background: selected && formation && formation.id === selected ? `${getStatusColor(formation.status)}44` : background,
                border,
                color,
                fontSize: expanded ? 14 : 8,
                fontWeight: formation || todayCell ? '700' : '400',
                cursor: formation ? 'pointer' : 'default',
                transition: 'background .12s',
                position: 'relative',
                minHeight: expanded ? 52 : 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {day || ''}
              {formation && formation.isFirst && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    borderRadius: '0 0 3px 3px',
                    background: getStatusColor(formation.status),
                  }}
                />
              )}
            </div>
          )
        })}
      </div>

      <div
        style={{
          marginTop: 6,
          minHeight: expanded ? 78 : 52,
          background: activeDetail
            ? `${activeDetail.type === 'hover' ? getStatusColor(activeDetail.data[0].status) : getStatusColor(activeDetail.data.status)}12`
            : 'transparent',
          border: activeDetail
            ? `1px solid ${activeDetail.type === 'hover' ? getStatusColor(activeDetail.data[0].status) : getStatusColor(activeDetail.data.status)}33`
            : '1px solid transparent',
          borderRadius: 8,
          padding: expanded ? '10px 12px' : '6px 8px',
          fontSize: expanded ? 11 : 9,
          transition: 'background .12s, border-color .12s',
        }}
      >
        {activeDetail ? (
          activeDetail.type === 'hover' ? (
            <>
              <div style={{ fontWeight: 700, color: getStatusAccent(activeDetail.data[0].status), marginBottom: 2 }}>
                {activeDetail.data.length > 1 ? 'Formations du jour' : activeDetail.data[0].name}
              </div>
              {activeDetail.data.map((item) => (
                <div key={`${item.id}-${item.dayNum}`} style={{ color: MUTED }}>
                  {item.name} · Jour {item.dayNum}/{item.days}
                </div>
              ))}
            </>
          ) : (
            <>
              <div style={{ fontWeight: 700, color: getStatusAccent(activeDetail.data.status), marginBottom: 2 }}>
                {activeDetail.data.name}
              </div>
              <div style={{ color: MUTED }}>
                Debut: {activeDetail.data.start.toLocaleDateString('fr-FR')} · Duree: {activeDetail.data.days} jours · Statut:{' '}
                <span style={{ fontWeight: 700, color: getStatusColor(activeDetail.data.status) }}>
                  {activeDetail.data.status === 'past' ? 'Realisee' : activeDetail.data.status === 'ongoing' ? 'En cours' : 'Planifiee'}
                </span>
              </div>
            </>
          )
        ) : (
          <div style={{ color: MUTED }}>
            Survolez ou selectionnez un jour avec formation pour voir le detail ici.
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 'auto', paddingTop: 8, flexWrap: 'wrap' }}>
        {[[G1, 'Passee'], [AMBER, 'En cours'], [BLUE, 'A venir']].map(([color, label]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: expanded ? 10 : 8, color: MUTED }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: color as string, display: 'inline-block' }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}
