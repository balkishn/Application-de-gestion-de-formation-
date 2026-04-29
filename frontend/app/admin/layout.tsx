"use client"

import { ReactNode, useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import AdminTopBar from '@/components/backoffice/layout/top-bar'
import AdminSidebar from '@/components/backoffice/layout/sidebar'
import { AdminSearchProvider } from '@/components/backoffice/search-context'
import CompanyFooter from '@/components/public-footer'
import { canAccessAdminPath, getCurrentRole, getDefaultHomeByRole, isAuthenticated } from '@/lib/auth'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/')
      return
    }

    const role = getCurrentRole()
    if (!canAccessAdminPath(pathname, role)) {
      router.replace(getDefaultHomeByRole(role))
      return
    }

    setReady(true)
  }, [pathname, router])

  if (!ready) {
    return <div className="min-h-screen bg-background" />
  }

  return (
    <AdminSearchProvider>
      <div className="min-h-screen bg-background text-foreground">
        {/* Sidebar */}
        <AdminSidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={setIsSidebarCollapsed}
        />

        {/* Main Content with top bar */}
        <div className={`${isSidebarCollapsed ? 'ml-20' : 'ml-72'} transition-all duration-300 flex flex-col min-h-screen`}>
          {/* Top Bar */}
          <AdminTopBar />

          {/* Page Content */}
          <main className="flex-1 overflow-auto bg-background">
            <div className="p-8 max-w-7xl mx-auto">
              {children}
            </div>
          </main>

          <CompanyFooter />
        </div>
      </div>
    </AdminSearchProvider>
  )
}
