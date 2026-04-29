'use client'

import { useEffect, useMemo, useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/layout/dashboard-layout'
import { getCurrentEmail, getCurrentRole, getCurrentUserId, getCurrentUsername } from '@/lib/auth'
import { utilisateurApi } from '@/lib/api'

type ProfileData = {
  id: number | null
  username: string
  email: string
  role: string
  login?: string
}

export default function ProfilPage() {
  const [profile, setProfile] = useState<ProfileData>({
    id: getCurrentUserId(),
    username: getCurrentUsername() || 'Utilisateur',
    email: getCurrentEmail() || 'Non renseigne',
    role: getCurrentRole() || 'SIMPLE_UTILISATEUR',
    login: getCurrentUsername() || 'Non renseigne',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true)
        const list = await utilisateurApi.getAll()
        const users = Array.isArray(list) ? list : []

        const userId = getCurrentUserId()
        const email = getCurrentEmail()

        const matched = users.find((item: any) => {
          if (userId && Number(item.id) === userId) return true
          if (email && String(item.email || '').toLowerCase() === email.toLowerCase()) return true
          return false
        })

        if (matched) {
          setProfile({
            id: Number(matched.id) || userId || null,
            username: matched.login || matched.username || getCurrentUsername() || 'Utilisateur',
            email: matched.email || email || 'Non renseigne',
            role: matched.role || matched.roleLibelle || getCurrentRole() || 'SIMPLE_UTILISATEUR',
            login: matched.login || matched.username || 'Non renseigne',
          })
        }
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  const roleLabel = useMemo(() => {
    const normalized = (profile.role || '').toUpperCase()
    if (normalized === 'ADMINISTRATEUR') return 'Administrateur'
    if (normalized === 'RESPONSABLE') return 'Responsable'
    if (normalized === 'SIMPLE_UTILISATEUR') return 'Simple utilisateur'
    return profile.role || 'Simple utilisateur'
  }, [profile.role])

  return (
    <DashboardLayout>
      <div className="flex-1 p-8 space-y-6">
        <section className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 via-green-500/10 to-transparent p-8 shadow-xl">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Espace utilisateur</p>
          <h1 className="text-4xl font-extrabold text-foreground mt-2">Mon profil</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Consultez les informations de votre compte.
          </p>
        </section>

        {loading ? (
          <div className="text-sm text-muted-foreground">Chargement du profil...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InfoCard label="Identifiant" value={profile.id ? String(profile.id) : 'Non renseigne'} />
            <InfoCard label="Login" value={profile.login || 'Non renseigne'} />
            <InfoCard label="Nom affiché" value={profile.username || 'Utilisateur'} />
            <InfoCard label="Email" value={profile.email || 'Non renseigne'} />
            <InfoCard label="Rôle" value={roleLabel} />
          </div>
        )}
      </div>
    </DashboardLayout>
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
