'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function UsersRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/dashboard/formateurs')
  }, [router])

  return <div className="min-h-screen bg-background" />
}
