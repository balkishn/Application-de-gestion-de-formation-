export type OverviewData = {
  totalFormations: number
  totalParticipants: number
  totalFormateurs: number
  totalDomaines: number
}

export type FormationItem = {
  id: number
  titre: string
  dateDebut: string
  duree: number
  budget: number
}

export type CompletionStatus = 'done' | 'ongoing' | 'upcoming'

export type CompletionItem = {
  label: string
  val: number
  status: CompletionStatus
}

export type CalendarFormation = {
  id: number
  name: string
  start: Date
  days: number
  status: 'past' | 'ongoing' | 'upcoming'
}

export type MonthlySeries = {
  year: number
  values: number[]
  color: string
  dashed?: boolean
}

export type DomainBreakdown = {
  name: string
  pct: number
}

export type DirectionBreakdown = {
  name: string
  participants: number
}

export type FormationsDerivedData = {
  completionItems: CompletionItem[]
  calendarFormations: CalendarFormation[]
  monthlyCosts: number[]
  monthlySeries: MonthlySeries[]
}
