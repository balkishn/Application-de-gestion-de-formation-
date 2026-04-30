'use client'

import { useEffect, useMemo, useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/layout/dashboard-layout'
import { StatisticsCard } from '@/components/dashboard/stats/statistics-card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
  LabelList,
} from 'recharts'
import { TrendingUp, Users, BookOpen, Award } from 'lucide-react'
import { formationApi, formateurApi, participantApi } from '@/lib/api'

type FormationItem = {
  id: number
  titre: string
  formateurNom?: string | null
  participantCount?: number | null
  dateDebut?: string | null
  duree?: number | null
}

type CompletionStatus = 'done' | 'ongoing' | 'upcoming'

function parseDate(value?: string | null) {
  if (!value) return null
  const parsed = new Date(`${value}T00:00:00`)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function computeCompletion(formation: FormationItem) {
  const start = parseDate(formation.dateDebut)
  const duration = Math.max(1, Number(formation.duree || 0))
  if (!start) return 0

  const now = new Date()
  const end = new Date(start)
  end.setDate(end.getDate() + duration - 1)
  end.setHours(23, 59, 59, 999)

  if (end < now) return 100
  if (start > now) return 0

  const elapsed = Math.max(0, Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
  return Math.min(99, Math.round((elapsed * 100) / duration))
}

function getCompletionStatus(formation: FormationItem): CompletionStatus {
  const start = parseDate(formation.dateDebut)
  const duration = Math.max(1, Number(formation.duree || 0))
  if (!start) return 'upcoming'

  const now = new Date()
  const end = new Date(start)
  end.setDate(end.getDate() + duration - 1)
  end.setHours(23, 59, 59, 999)

  if (end < now) return 'done'
  if (start > now) return 'upcoming'
  return 'ongoing'
}

function getCompletionColor(status: CompletionStatus) {
  if (status === 'done') return '#16a34a'
  if (status === 'ongoing') return '#0d9488'
  return '#2563eb'
}

export default function StatisticsPage() {
  const [participantsCount, setParticipantsCount] = useState(0)
  const [formateursCount, setFormateursCount] = useState(0)
  const [formations, setFormations] = useState<FormationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [formationsData, participantsData, formateursData] = await Promise.all([
          formationApi.getAll(),
          participantApi.getAll(),
          formateurApi.getAll(),
        ])

        setFormations(Array.isArray(formationsData) ? formationsData : [])
        setParticipantsCount(Array.isArray(participantsData) ? participantsData.length : 0)
        setFormateursCount(Array.isArray(formateursData) ? formateursData.length : 0)
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : 'Erreur de chargement')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const participantTrendData = useMemo(() => {
    const currentYear = new Date().getFullYear()
    const monthly = Array.from({ length: 12 }, (_, index) => ({
      month: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'][index],
      participants: 0,
    }))

    formations.forEach((formation) => {
      const start = parseDate(formation.dateDebut)
      if (!start || start.getFullYear() !== currentYear) return
      monthly[start.getMonth()].participants += Number(formation.participantCount || 0)
    })

    return monthly
  }, [formations])

  const trainingCompletionData = useMemo(() => {
    return formations
      .map((formation) => ({
        name: formation.titre,
        completed: computeCompletion(formation),
        status: getCompletionStatus(formation),
      }))
      .sort((a, b) => b.completed - a.completed)
      .slice(0, 6)
  }, [formations])

  const summaryRows = useMemo(() => {
    return formations.slice(0, 8).map((formation) => ({
      name: formation.titre,
      trainer: formation.formateurNom || 'Non renseigne',
      participants: formation.participantCount || 0,
      completion: computeCompletion(formation),
    }))
  }, [formations])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex-1 p-8 text-muted-foreground">Chargement des statistiques...</div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex-1 p-8 text-destructive">{error}</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Statistiques et analyses</h1>
          <p className="text-muted-foreground text-lg">Performance du centre et indicateurs des formations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatisticsCard
            title="Total des participants"
            value={String(participantsCount)}
            change="En temps reel"
            icon={Users}
            trend="up"
          />
          <StatisticsCard
            title="Formations actives"
            value={String(formations.length)}
            change="En temps reel"
            icon={BookOpen}
            trend="up"
          />
          <StatisticsCard
            title="Taux de completion"
            value={`${trainingCompletionData.length ? Math.round(trainingCompletionData.reduce((sum, item) => sum + item.completed, 0) / trainingCompletionData.length) : 0}%`}
            change="Calcule"
            icon={Award}
            trend="up"
          />
          <StatisticsCard
            title="Formateurs"
            value={String(formateursCount)}
            change="En temps reel"
            icon={TrendingUp}
            trend="up"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="rounded-2xl border border-border/50 backdrop-blur-xl p-6" style={{ background: 'rgba(15, 40, 24, 0.3)' }}>
            <h2 className="text-lg font-bold text-foreground mb-6">Evolution des participants</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={participantTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="participants"
                  stroke="hsl(var(--primary))"
                  dot={{ fill: 'hsl(var(--primary))' }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl border border-border/50 backdrop-blur-xl p-6" style={{ background: 'rgba(15, 40, 24, 0.3)' }}>
            <h2 className="text-lg font-bold text-foreground mb-6">Completion des formations</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trainingCompletionData} margin={{ top: 16, right: 12, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  formatter={(value) => [`${value}%`, 'Completion']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend />
                <Bar dataKey="completed" radius={[8, 8, 0, 0]} name="Taux de completion">
                  <LabelList dataKey="completed" position="top" formatter={(value: number) => `${value}%`} />
                  {trainingCompletionData.map((entry) => (
                    <Cell key={entry.name} fill={getCompletionColor(entry.status)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border/50 backdrop-blur-xl p-6" style={{ background: 'rgba(15, 40, 24, 0.3)' }}>
          <h2 className="text-lg font-bold text-foreground mb-6">Resume des formations</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Nom de la formation</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Formateur</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Participants</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Taux de completion</th>
                </tr>
              </thead>
              <tbody>
                {summaryRows.map((program, index) => (
                  <tr key={index} className="border-b border-border hover:bg-secondary/30 transition-colors">
                    <td className="py-4 px-4 text-sm text-foreground font-medium">{program.name}</td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">{program.trainer}</td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">{program.participants}</td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-secondary rounded-full h-1.5">
                          <div
                            className="bg-primary h-1.5 rounded-full"
                            style={{ width: `${program.completion}%` }}
                          />
                        </div>
                        {program.completion}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
