import { useState, useEffect, useCallback } from 'react'
import { statistiquesApi } from '@/lib/api'

interface DashboardData {
  overview: {
    totalFormations: number
    totalParticipants: number
    totalFormateurs: number
    totalDomaines: number
    totalBudget: number
  }
  formationsParDomaine: Array<{ label: string; value: number }>
  participantsParStructure: Array<{ label: string; value: number }>
}

interface CacheEntry {
  data: DashboardData
  timestamp: number
  version: string
}

const CACHE_KEY = 'dashboard_cache'
const CACHE_VERSION = 'v1'
const CACHE_DURATION = 5 * 60 * 1000

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getCachedData = useCallback((): DashboardData | null => {
    if (typeof window === 'undefined') return null

    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (!cached) return null

      const entry: CacheEntry = JSON.parse(cached)
      if (entry.version !== CACHE_VERSION) {
        localStorage.removeItem(CACHE_KEY)
        return null
      }

      if (Date.now() - entry.timestamp > CACHE_DURATION) {
        localStorage.removeItem(CACHE_KEY)
        return null
      }

      return entry.data
    } catch {
      localStorage.removeItem(CACHE_KEY)
      return null
    }
  }, [])

  const setCachedData = useCallback((newData: DashboardData) => {
    if (typeof window === 'undefined') return

    try {
      const entry: CacheEntry = {
        data: newData,
        timestamp: Date.now(),
        version: CACHE_VERSION,
      }
      localStorage.setItem(CACHE_KEY, JSON.stringify(entry))
    } catch {
      // Ignore local cache write errors.
    }
  }, [])

  const fetchDashboardData = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true)
      setError(null)

      if (!forceRefresh) {
        const cached = getCachedData()
        if (cached) {
          setData(cached)
          setLoading(false)
          return
        }
      }

      const result = await statistiquesApi.dashboardData()
      if (!result) {
        throw new Error('Invalid response format')
      }

      setCachedData(result)
      setData(result)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load dashboard data'
      setError(message)

      const cached = getCachedData()
      if (cached) {
        setData(cached)
      }
    } finally {
      setLoading(false)
    }
  }, [getCachedData, setCachedData])

  useEffect(() => {
    fetchDashboardData(false)
  }, [fetchDashboardData])

  const refresh = useCallback(() => {
    fetchDashboardData(true)
  }, [fetchDashboardData])

  const clearCache = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CACHE_KEY)
    }
  }, [])

  return {
    data,
    loading,
    error,
    refresh,
    clearCache,
  }
}

export function useSyncDashboardCache() {
  const [shouldRefresh, setShouldRefresh] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CACHE_KEY && e.newValue !== e.oldValue) {
        setShouldRefresh(true)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return shouldRefresh
}
