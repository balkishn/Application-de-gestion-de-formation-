'use client'

import { DashboardLayout } from '@/components/dashboard/layout/dashboard-layout'
import { TrainerList } from '@/components/dashboard/lists/trainer-list'

export default function FormateursPage() {
  return (
    <DashboardLayout>
      <div className="flex-1 p-8 space-y-6">
        <section className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 via-green-500/10 to-transparent p-8 shadow-xl">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Gestion des formateurs</p>
          <h1 className="text-4xl font-extrabold text-foreground mt-2">Formateurs</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Consultez, préparez et organisez les formateurs disponibles dans votre application de gestion de formation.
          </p>
        </section>

        <TrainerList />
      </div>
    </DashboardLayout>
  )
}
