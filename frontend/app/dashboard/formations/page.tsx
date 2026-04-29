'use client'

import { DashboardLayout } from '@/components/dashboard/layout/dashboard-layout'
import { TrainingList } from '@/components/dashboard/lists/training-list'

export default function FormationsPage() {
  return (
    <DashboardLayout>
      <div className="flex-1 p-8 space-y-6">
        <section className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 via-green-500/10 to-transparent p-8 shadow-xl">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Gestion des formations</p>
          <h1 className="text-4xl font-extrabold text-foreground mt-2">Formations</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Suivez les formations, leur état d’avancement et les données utiles pour piloter l’activité.
          </p>
        </section>

        <TrainingList />
      </div>
    </DashboardLayout>
  )
}
