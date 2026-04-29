"use client"

import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminTopBar from '@/components/backoffice/layout/top-bar'
import AdminSidebar from '@/components/backoffice/layout/sidebar'
import { AdminSearchProvider } from '@/components/backoffice/search-context'
import PublicFooter from '@/components/public-footer'
import { getCurrentRole, isAuthenticated } from '@/lib/auth'

export default function ResponsableLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/')
      return
    }

    const role = getCurrentRole()
    if (role === 'SIMPLE_UTILISATEUR') {
      router.replace('/dashboard')
      return
    }

    if (role !== 'RESPONSABLE' && role !== 'ADMINISTRATEUR') {
      router.replace('/dashboard')
      return
    }

    setReady(true)
  }, [router])

  if (!ready) {
    return <div className="min-h-screen bg-background" />
  }

  return (
    <AdminSearchProvider>
      <div className="min-h-screen bg-background text-foreground">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content with top bar */}
        <div className="ml-72 lg:ml-72 md:ml-20 sm:ml-20 flex flex-col min-h-screen">
          {/* Top Bar */}
          <AdminTopBar />

          {/* Page Content */}
          <main className="flex-1 overflow-auto bg-background">
            <div className="p-8 max-w-7xl mx-auto">
              {children}
            </div>
          </main>

          <PublicFooter />
        </div>
      </div>
    </AdminSearchProvider>
  )
}
