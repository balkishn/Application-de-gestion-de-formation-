'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  Users,
  UserCheck,
  UserCog,
  Layers,
  Shield,
  Building2,
  Briefcase,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { hasAnyRole } from '@/lib/auth'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { id: 'formations', label: 'Formations', icon: BookOpen, href: '/admin/formations' },
  { id: 'participants', label: 'Participants', icon: Users, href: '/admin/participants' },
  { id: 'formateurs', label: 'Formateurs', icon: UserCheck, href: '/admin/formateurs' },
  { id: 'utilisateurs', label: 'Utilisateurs', icon: UserCog, href: '/admin/utilisateurs' },
  { id: 'domaines', label: 'Domaines', icon: Layers, href: '/admin/domaines' },
  { id: 'profils', label: 'Profils', icon: Shield, href: '/admin/profils' },
  { id: 'structures', label: 'Structures', icon: Building2, href: '/admin/structures' },
  { id: 'employeurs', label: 'Employeurs', icon: Briefcase, href: '/admin/employeurs' },
]

interface AdminSidebarProps {
  isCollapsed?: boolean
  onToggleCollapse?: (collapsed: boolean) => void
}

export default function AdminSidebar({
  isCollapsed: isCollapsedProp,
  onToggleCollapse,
}: AdminSidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false)
  const pathname = usePathname()
  const isAdmin = hasAnyRole(['ADMINISTRATEUR'])
  const isCollapsed = isCollapsedProp ?? internalCollapsed

  const handleToggle = () => {
    const next = !isCollapsed
    if (typeof isCollapsedProp === 'boolean') {
      onToggleCollapse?.(next)
      return
    }
    setInternalCollapsed(next)
    onToggleCollapse?.(next)
  }

  const visibleItems = navItems.filter((item) => {
    if (item.id === 'domaines') return isAdmin
    return true
  })

  return (
    <aside
      className={`${
        isCollapsed ? 'w-20' : 'w-72'
      } fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border/30 bg-gradient-to-b from-card/60 to-card/30 backdrop-blur-xl transition-all duration-300`}
    >
      <div className="flex items-center justify-between border-b border-border/50 p-4">
        <button
          onClick={handleToggle}
          className="rounded-lg p-2 transition-colors hover:bg-secondary/50"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto p-4">
        {visibleItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link key={item.id} href={item.href}>
              <button
                className={`group flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200 ${
                  isActive
                    ? 'border border-green-500/50 bg-gradient-to-r from-green-500/30 to-emerald-500/20 text-green-400 shadow-lg shadow-green-500/20'
                    : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                    {isActive && <div className="h-2 w-2 rounded-full bg-green-400" />}
                  </>
                )}
              </button>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
