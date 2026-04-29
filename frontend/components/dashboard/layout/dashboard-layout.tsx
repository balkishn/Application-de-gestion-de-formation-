'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut, Menu, X, Home, GraduationCap, BookOpen, Users, ChevronRight } from 'lucide-react'
import AdminTopBar from '@/components/backoffice/layout/top-bar'
import { AdminSearchProvider } from '@/components/backoffice/search-context'
import PublicFooter from '@/components/public-footer'
import {
  clearSession,
  getCurrentRole,
  getDefaultHomeByRole,
  isAuthenticated,
  isSimpleUserRole,
} from '@/lib/auth'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/')
      return
    }

    const role = getCurrentRole()
    if (!isSimpleUserRole(role)) {
      router.replace(getDefaultHomeByRole(role))
      return
    }

    setReady(true)
  }, [router])

  const navItems = useMemo(
    () => [
      { href: '/dashboard', icon: <Home className="h-5 w-5" />, label: 'Accueil' },
      { href: '/dashboard/formateurs', icon: <GraduationCap className="h-5 w-5" />, label: 'Formateurs' },
      { href: '/dashboard/formations', icon: <BookOpen className="h-5 w-5" />, label: 'Formations' },
      { href: '/dashboard/participants', icon: <Users className="h-5 w-5" />, label: 'Participants' },
    ],
    []
  )

  if (!ready) {
    return <div className="min-h-screen bg-background" />
  }

  return (
    <AdminSearchProvider>
      <div className="relative flex min-h-screen overflow-hidden bg-background">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-green-500/10 blur-3xl" />
        </div>

        <aside
          className={`${
            isSidebarOpen ? 'w-72' : 'w-24'
          } relative z-20 flex flex-col border-r border-border/50 bg-card/50 backdrop-blur-xl transition-all duration-300`}
        >
          <div className="flex items-center justify-between border-b border-border/30 p-6">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-primary"
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          <nav className="flex-1 space-y-2 overflow-y-auto p-4">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                isOpen={isSidebarOpen}
                isActive={pathname === item.href}
              />
            ))}
          </nav>

          <div className="border-t border-border/30 p-4">
            <Button
              className="w-full justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg hover:from-emerald-600 hover:to-green-700"
              onClick={() => {
                clearSession()
                router.replace('/')
              }}
            >
              <LogOut className="h-4 w-4" />
              {isSidebarOpen && 'Deconnexion'}
            </Button>
          </div>
        </aside>

        <div className="relative z-10 flex flex-1 flex-col">
          <AdminTopBar />
          <main className="flex-1 overflow-auto">
            {children}
            <PublicFooter />
          </main>
        </div>
      </div>
    </AdminSearchProvider>
  )
}

interface NavLinkProps {
  href: string
  icon: React.ReactNode
  label: string
  isOpen: boolean
  isActive: boolean
}

function NavLink({ href, icon, label, isOpen, isActive }: NavLinkProps) {
  return (
    <Link href={href}>
      <button
        className={`group flex w-full items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-200 ${
          isActive
            ? 'border-emerald-500/40 bg-gradient-to-r from-emerald-500/25 to-green-500/10 text-foreground'
            : 'border-transparent text-muted-foreground hover:border-emerald-500/30 hover:bg-gradient-to-r hover:from-emerald-500/20 hover:to-green-500/10 hover:text-foreground'
        }`}
      >
        <span className={`flex-shrink-0 ${isActive ? 'text-primary' : 'group-hover:text-primary'}`}>{icon}</span>
        {isOpen && <span className="flex-1 text-left text-sm font-medium">{label}</span>}
        {isOpen && <ChevronRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />}
      </button>
    </Link>
  )
}
