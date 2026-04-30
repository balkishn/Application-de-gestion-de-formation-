'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, LogOut, User } from 'lucide-react'
import { useAdminSearch } from '@/components/backoffice/search-context'
import FormationNotificationCenter from '@/components/notifications/formation-notification-center'
import { clearSession, getCurrentRole, getCurrentUsername } from '@/lib/auth'

export default function AdminTopBar() {
  const router = useRouter()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { query, setQuery, results, onSelect } = useAdminSearch()
  const username = getCurrentUsername() || 'User'
  const role = getCurrentRole() || 'UNKNOWN'

  const handleLogout = () => {
    clearSession()
    router.push('/')
  }

  const handleProfile = () => {
    if (role === 'SIMPLE_UTILISATEUR') {
      router.push('/dashboard/profil')
      return
    }

    if (role === 'RESPONSABLE') {
      router.push('/responsable/profil')
      return
    }

    router.push('/admin/profil')
  }

  return (
    <header className="h-16 bg-gradient-to-r from-card/60 to-card/40 backdrop-blur-xl border-b border-border/30 flex items-center justify-between px-8 sticky top-0 z-30">
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher dans la page..."
            className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-border/50 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
          />

          {query.trim() && (
            <div className="absolute mt-2 w-full rounded-lg border border-border/50 bg-card/95 backdrop-blur shadow-xl max-h-64 overflow-y-auto z-40">
              {results.length > 0 ? (
                results.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => {
                      onSelect?.(result.id)
                      setQuery('')
                    }}
                    className="w-full text-left px-3 py-2 border-b last:border-b-0 border-border/30 hover:bg-secondary/60 transition-colors"
                  >
                    <p className="text-sm text-foreground font-medium">{result.label}</p>
                    {result.subtitle && (
                      <p className="text-xs text-muted-foreground mt-0.5">{result.subtitle}</p>
                    )}
                  </button>
                ))
              ) : (
                <p className="px-3 py-2 text-sm text-muted-foreground">Aucun résultat</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 ml-8">
        <FormationNotificationCenter />

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu)
            }}
            className="flex items-center gap-3 p-2 hover:bg-secondary/50 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
              {username.slice(0, 1).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-foreground hidden sm:inline">{username}</span>
          </button>

          {showUserMenu && (
            <div className="absolute top-12 right-0 w-48 bg-card border border-border rounded-lg shadow-2xl overflow-hidden">
              <div className="p-4 border-b border-border/50">
                <p className="text-sm font-semibold text-foreground">{username}</p>
                <p className="text-xs text-muted-foreground">{role}</p>
              </div>
              <div className="p-2 space-y-1">
                <button onClick={handleProfile} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded transition-colors">
                  <User className="w-4 h-4" />
                  Profil
                </button>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors">
                  <LogOut className="w-4 h-4" />
                  Déconnexion
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
