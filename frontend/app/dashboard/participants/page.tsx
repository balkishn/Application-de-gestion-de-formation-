'use client'

import { DashboardLayout } from '@/components/dashboard/layout/dashboard-layout'
import { ParticipantList } from '@/components/dashboard/lists/participant-list'

export default function ParticipantsPage() {
  return (
    <DashboardLayout>
      <div className="flex-1 p-8 space-y-6">
        <section className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 via-green-500/10 to-transparent p-8 shadow-xl">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Gestion des participants</p>
          <h1 className="text-4xl font-extrabold text-foreground mt-2">Participants</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Visualisez les participants inscrits et suivez leur progression dans les différentes formations.
          </p>
        </section>

        <ParticipantList />
      </div>
    </DashboardLayout>
  )
}
