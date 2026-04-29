'use client'

import { createContext, useContext, useMemo, useState } from 'react'

export interface AdminSearchResult {
  id: string
  label: string
  subtitle?: string
}

interface AdminSearchContextValue {
  query: string
  setQuery: (value: string) => void
  results: AdminSearchResult[]
  setResults: (value: AdminSearchResult[]) => void
  onSelect: ((id: string) => void) | null
  setOnSelect: (handler: ((id: string) => void) | null) => void
}

const AdminSearchContext = createContext<AdminSearchContextValue | null>(null)

const fallbackContext: AdminSearchContextValue = {
  query: '',
  setQuery: () => {},
  results: [],
  setResults: () => {},
  onSelect: null,
  setOnSelect: () => {},
}

export function AdminSearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<AdminSearchResult[]>([])
  const [onSelect, setOnSelect] = useState<((id: string) => void) | null>(null)

  const value = useMemo(
    () => ({ query, setQuery, results, setResults, onSelect, setOnSelect }),
    [query, results, onSelect],
  )

  return <AdminSearchContext.Provider value={value}>{children}</AdminSearchContext.Provider>
}

export function useAdminSearch() {
  const context = useContext(AdminSearchContext)
  if (!context) {
    throw new Error('useAdminSearch must be used inside AdminSearchProvider')
  }
  return context
}

export function useAdminSearchOptional() {
  const context = useContext(AdminSearchContext)
  return context ?? fallbackContext
}
