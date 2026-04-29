import type {
  CalendarFormation,
  DirectionBreakdown,
  DomainBreakdown,
  FormationItem,
  FormationsDerivedData,
} from './types'

export const BG = '#f0faf4'
export const CARD = '#ffffff'
export const CARD2 = '#f6fef9'
export const G1 = '#16a34a'
export const G2 = '#15803d'
export const TEAL = '#0d9488'
export const AMBER = '#d97706'
export const BLUE = '#2563eb'
export const ROSE = '#e11d48'
export const TEXT = '#1a2e1f'
export const DIM = '#d1fae5'
export const MUTED = '#6b7a6e'

export const DOMAIN_COLORS = [G1, TEAL, AMBER, BLUE, ROSE, '#7c3aed', '#0891b2', '#b45309']
export const MONTHS_FR = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec']

export function parseFormationStart(dateDebut?: string | null) {
  if (!dateDebut) return null
  const parsed = new Date(`${dateDebut}T00:00:00`)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

export function fmt(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(0)}k` : `${n}`
}

export function buildDomainBreakdown(items: Array<{ label: string; value: number }> = []): DomainBreakdown[] {
  const total = items.reduce((sum, item) => sum + (item.value || 0), 0)
  return items.map((item) => ({
    name: item.label,
    pct: total > 0 ? Math.round((item.value / total) * 100) : 0,
  }))
}

export function buildDirectionBreakdown(items: Array<{ label: string; value: number }> = []): DirectionBreakdown[] {
  return items.map((item) => ({
    name: item.label,
    participants: item.value || 0,
  }))
}

export function deriveFormationsData(allFormations: FormationItem[], currentYear: number): FormationsDerivedData {
  const now = new Date()
  const windowStart = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0)
  const windowEnd = new Date(now.getFullYear(), now.getMonth() + 2, 0, 23, 59, 59, 999)

  const normalized = allFormations
    .map((formation) => {
      const start = parseFormationStart(formation.dateDebut)
      const days = Math.max(1, Number(formation.duree || 0))
      if (!start) return null

      const end = new Date(start)
      end.setDate(end.getDate() + days - 1)
      end.setHours(23, 59, 59, 999)

      let status: CalendarFormation['status'] = 'upcoming'
      if (end < now) {
        status = 'past'
      } else if (start <= now) {
        status = 'ongoing'
      }

      return {
        id: formation.id,
        name: formation.titre,
        start,
        days,
        end,
        budget: Number(formation.budget || 0),
        status,
      }
    })
    .filter(Boolean) as Array<CalendarFormation & { end: Date; budget: number }>

  const completionWindowFormations = normalized.filter((formation) => formation.start <= windowEnd && formation.end >= windowStart)

  const completionItems = completionWindowFormations
    .map((formation) => {
      if (formation.status === 'past') {
        return { label: formation.name, val: 100, status: 'done' as const }
      }
      if (formation.status === 'upcoming') {
        return { label: formation.name, val: 0, status: 'upcoming' as const }
      }

      const elapsed = Math.max(0, Math.floor((now.getTime() - formation.start.getTime()) / (1000 * 60 * 60 * 24)))
        const percent = Math.min(99, Math.round((elapsed * 100) / formation.days))
        return { label: formation.name, val: percent, status: 'ongoing' as const }
    })
    .sort((a, b) => {
      if (a.status === b.status) {
        return b.val - a.val
      }

      const statusOrder = { ongoing: 0, upcoming: 1, done: 2 }
      return statusOrder[a.status] - statusOrder[b.status]
    })

  const monthlyCosts = Array(12).fill(0)
  normalized.forEach((formation) => {
    if (formation.start.getFullYear() === currentYear) {
      monthlyCosts[formation.start.getMonth()] += formation.budget
    }
  })

  const monthlySeries = Array.from({ length: 5 }, (_, index) => {
    const year = currentYear - index
    const values = Array(12).fill(0)

    normalized.forEach((formation) => {
      if (formation.start.getFullYear() === year) {
        values[formation.start.getMonth()] += 1
      }
    })

    return {
      year,
      values,
      color: DOMAIN_COLORS[index % DOMAIN_COLORS.length],
      dashed: index > 0,
    }
  })

  return {
    completionItems,
    calendarFormations: normalized.map(({ id, name, start, days, status }) => ({ id, name, start, days, status })),
    monthlyCosts,
    monthlySeries,
  }
}
