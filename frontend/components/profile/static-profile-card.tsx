'use client'

import { useMemo } from 'react'
import { getCurrentEmail, getCurrentRole, getCurrentUserId, getCurrentUsername } from '@/lib/auth'

type StaticProfileCardProps = {
  scopeLabel: string
}

export default function StaticProfileCard({ scopeLabel }: StaticProfileCardProps) {
  const roleLabel = useMemo(() => {
    const role = (getCurrentRole() || '').toUpperCase()
    if (role === 'ADMINISTRATEUR') return 'Administrateur'
    if (role === 'RESPONSABLE') return 'Responsable'
    if (role === 'SIMPLE_UTILISATEUR') return 'Simple utilisateur'
    return role || 'Utilisateur'
  }, [])

  const userId = getCurrentUserId()
  const username = getCurrentUsername() || 'Non renseigné'
  const email = getCurrentEmail() || 'Non renseigné'

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 via-green-500/10 to-transparent p-8 shadow-xl">
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">{scopeLabel}</p>
        <h1 className="text-4xl font-extrabold text-foreground mt-2">Profil utilisateur</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Consultation des informations du compte connecté.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <InfoCard label="ID utilisateur" value={userId ? String(userId) : 'Non renseigné'} />
        <InfoCard label="Nom d'utilisateur" value={username} />
        <InfoCard label="Email" value={email} />
        <InfoCard label="Rôle" value={roleLabel} />
      </section>
    </div>
  )
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/40 bg-card/50 p-5">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold text-foreground mt-2 break-words">{value}</p>
    </div>
  )
}
