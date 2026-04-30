'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { Calendar, ChevronRight, GraduationCap, BookOpen, Users } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/layout/dashboard-layout'
import { formationApi, participantApi } from '@/lib/api'
import { getCurrentUsername } from '@/lib/auth'

type FormationItem = {
  id: number
  titre: string
  dateDebut?: string | null
  duree?: number | null
  participantCount?: number | null
}

export default function UserDashboard() {
  const [formations, setFormations] = useState<FormationItem[]>([])
  const [participantsCount, setParticipantsCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [formationsData, participantsData] = await Promise.all([
          formationApi.getAll(),
          participantApi.getAll(),
        ])

        setFormations(Array.isArray(formationsData) ? formationsData : [])
        setParticipantsCount(Array.isArray(participantsData) ? participantsData.length : 0)
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : 'Erreur de chargement')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const today = new Date()

  const upcomingCount = useMemo(() => {
    return formations.filter((formation) => {
      if (!formation.dateDebut) return false
      const start = new Date(`${formation.dateDebut}T00:00:00`)
      return !Number.isNaN(start.getTime()) && start > today
    }).length
  }, [formations, today])

  const ongoingCount = useMemo(() => {
    return formations.filter((formation) => {
      if (!formation.dateDebut) return false
      const start = new Date(`${formation.dateDebut}T00:00:00`)
      if (Number.isNaN(start.getTime())) return false
      const end = new Date(start)
      end.setDate(end.getDate() + Math.max(1, Number(formation.duree || 0)) - 1)
      end.setHours(23, 59, 59, 999)
      return start <= today && end >= today
    }).length
  }, [formations, today])

  const recentFormations = useMemo(() => {
    return [...formations]
      .sort((a, b) => {
        const ad = a.dateDebut ? new Date(`${a.dateDebut}T00:00:00`).getTime() : 0
        const bd = b.dateDebut ? new Date(`${b.dateDebut}T00:00:00`).getTime() : 0
        return bd - ad
      })
      .slice(0, 5)
  }, [formations])

  return (
    <DashboardLayout>
      <div className="flex-1 p-8 space-y-8">
        <section className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 via-green-500/10 to-transparent p-8 shadow-xl">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Espace Formation</p>
          <h1 className="text-4xl font-extrabold text-foreground mt-2">
            Bonjour {getCurrentUsername() || 'Utilisateur'}
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Voici votre page d&apos;accueil: accès rapide, suivi de vos formations, et navigation claire vers les pages métier de l&apos;application.
          </p>
        </section>

        {loading && <div className="text-sm text-muted-foreground">Chargement des données...</div>}
        {error && <div className="text-sm text-destructive">{error}</div>}

        {!loading && !error && (
          <>
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <KpiCard label="Total des formations" value={formations.length} icon={<Calendar className="w-5 h-5" />} tone="emerald" />
              <KpiCard label="Formations en cours" value={ongoingCount} icon={<Users className="w-5 h-5" />} tone="blue" />
              <KpiCard label="Formations à venir" value={upcomingCount} icon={<BookOpen className="w-5 h-5" />} tone="amber" />
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <QuickAccessCard
                href="/dashboard/formateurs"
                title="Formateurs"
                description="Gérez les formateurs de l’application."
                icon={<GraduationCap className="w-5 h-5" />}
              />
              <QuickAccessCard
                href="/dashboard/formations"
                title="Formations"
                description="Consultez et organisez les formations."
                icon={<BookOpen className="w-5 h-5" />}
              />
              <QuickAccessCard
                href="/dashboard/participants"
                title="Participants"
                description="Suivez les participants inscrits."
                icon={<Users className="w-5 h-5" />}
              />
              <div className="rounded-2xl border border-border/40 bg-card/50 p-5">
                <p className="text-sm text-muted-foreground">Participants visibles</p>
                <p className="text-3xl font-bold text-foreground mt-2">{participantsCount}</p>
                <p className="text-xs text-muted-foreground mt-3">Valeur calculée à partir des données backend.</p>
              </div>
            </section>

            <section className="rounded-2xl border border-border/50 bg-card/40 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">Formations Récentes</h2>
                <Link href="/dashboard/formations" className="text-sm text-emerald-400 hover:text-emerald-300">Voir plus</Link>
              </div>
              <div className="space-y-3">
                {recentFormations.map((formation) => (
                  <div key={formation.id} className="rounded-xl border border-border/40 bg-background/70 px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{formation.titre}</p>
                      <p className="text-xs text-muted-foreground">
                        Début: {formation.dateDebut || 'Non renseignee'} • Participants: {formation.participantCount || 0}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                ))}
                {!recentFormations.length && (
                  <p className="text-sm text-muted-foreground">Aucune formation disponible.</p>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

function KpiCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string
  value: number
  icon: React.ReactNode
  tone: 'emerald' | 'blue' | 'amber'
}) {
  const palette = {
    emerald: 'from-emerald-500/20 to-green-500/10 border-emerald-500/35',
    blue: 'from-blue-500/20 to-cyan-500/10 border-blue-500/35',
    amber: 'from-amber-500/20 to-orange-500/10 border-amber-500/35',
  }

  return (
    <div className={`rounded-2xl border bg-gradient-to-br ${palette[tone]} p-5`}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <span className="text-foreground">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-foreground mt-3">{value}</p>
    </div>
  )
}

function QuickAccessCard({
  href,
  title,
  description,
  icon,
}: {
  href: string
  title: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-border/40 bg-card/50 p-5 hover:border-emerald-500/40 hover:bg-card/70 transition-all"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-lg font-bold text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        <span className="text-emerald-400">{icon}</span>
      </div>
      <div className="text-xs text-emerald-400 mt-4 inline-flex items-center gap-1">
        Ouvrir <ChevronRight className="w-3 h-3" />
      </div>
    </Link>
  )
}
