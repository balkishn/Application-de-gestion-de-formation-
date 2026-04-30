'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, ChevronUp, Edit, Plus, Sparkles, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAdminSearchOptional } from '@/components/backoffice/search-context'

interface Column {
  key: string
  label: string
  sortable?: boolean
  render?: (value: any, row: any) => React.ReactNode
}

interface DataTableProps {
  title: string
  columns: Column[]
  data: any[]
  onAdd: () => void
  onEdit: (row: any) => void
  onDelete: (row: any) => void
  showAdd?: boolean
  showActions?: boolean
}

export default function DataTable({
  title,
  columns,
  data,
  onAdd,
  onEdit,
  onDelete,
  showAdd = true,
  showActions = true,
}: DataTableProps) {
  const ROWS_PER_PAGE = 20
  const [sortBy, setSortBy] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [highlightedRowId, setHighlightedRowId] = useState<string | number | null>(null)
  const highlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const rowRefs = useRef<Record<string, HTMLTableRowElement | null>>({})
  const { query, setResults, setOnSelect } = useAdminSearchOptional()

  const getRowIdentifier = (row: any, index: number) => row?.id ?? `row-${index}`

  const normalizeValue = (value: any): string => {
    if (value === null || value === undefined) return ''
    if (typeof value === 'string') return value
    if (typeof value === 'number' || typeof value === 'boolean') return String(value)
    return ''
  }

  const buildSearchText = (row: any) => {
    const columnText = columns.map((col) => normalizeValue(row[col.key])).join(' ')
    const rawText = Object.values(row).map((value) => normalizeValue(value)).join(' ')
    return `${columnText} ${rawText}`.toLowerCase()
  }

  const handleSort = (columnKey: string) => {
    if (sortBy === columnKey) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(columnKey)
      setSortOrder('asc')
    }
  }

  const sortedData = useMemo(() => {
    const result = [...data]
    if (!sortBy) return result

    result.sort((a, b) => {
      const aVal = a[sortBy]
      const bVal = b[sortBy]

      if (aVal === null || aVal === undefined) return 1
      if (bVal === null || bVal === undefined) return -1

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        const compare = aVal.localeCompare(bVal, 'fr', { sensitivity: 'base' })
        return sortOrder === 'asc' ? compare : -compare
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return result
  }, [data, sortBy, sortOrder])

  const searchMatches = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return []
    return sortedData.filter((row) => buildSearchText(row).includes(normalizedQuery)).slice(0, 8)
  }, [query, sortedData])

  const totalPages = Math.max(1, Math.ceil(sortedData.length / ROWS_PER_PAGE))
  const pageStart = (currentPage - 1) * ROWS_PER_PAGE
  const pageData = sortedData.slice(pageStart, pageStart + ROWS_PER_PAGE)

  useEffect(() => {
    setCurrentPage(1)
  }, [data.length])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const nextResults = searchMatches.map((row, idx) => {
      const rowId = String(getRowIdentifier(row, idx))
      const label =
        normalizeValue(
          row.nomEmployeur || row.nomemployeur || row.nom || row.prenom || row.login || row.titre || row.libelle || row.id,
        ) || 'Resultat'
      const subtitle = columns
        .map((col) => normalizeValue(row[col.key]))
        .filter(Boolean)
        .slice(0, 2)
        .join(' | ')

      return { id: rowId, label, subtitle }
    })

    setResults(nextResults)
  }, [query, searchMatches, columns, setResults])

  useEffect(() => {
    return () => {
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current)
      }
      setResults([])
      setOnSelect(null)
    }
  }, [setResults, setOnSelect])

  const jumpToRow = (row: any) => {
    const targetId = row?.id
    const rowIndex = sortedData.findIndex((item, idx) => {
      if (targetId !== undefined && targetId !== null) {
        return item?.id === targetId
      }
      return item === row || getRowIdentifier(item, idx) === getRowIdentifier(row, idx)
    })
    if (rowIndex < 0) return

    const targetPage = Math.floor(rowIndex / ROWS_PER_PAGE) + 1
    const rowId = getRowIdentifier(row, rowIndex)

    setCurrentPage(targetPage)
    setHighlightedRowId(rowId)

    if (highlightTimeoutRef.current) {
      clearTimeout(highlightTimeoutRef.current)
    }

    highlightTimeoutRef.current = setTimeout(() => {
      setHighlightedRowId(null)
    }, 3000)
  }

  useEffect(() => {
    setOnSelect(() => (selectedId: string) => {
      const found = sortedData.find((item, idx) => String(getRowIdentifier(item, idx)) === selectedId)
      if (!found) return
      jumpToRow(found)
    })
  }, [sortedData, setOnSelect])

  useEffect(() => {
    if (highlightedRowId === null) return
    const key = String(highlightedRowId)
    const rowElement = rowRefs.current[key]
    if (rowElement) {
      rowElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [highlightedRowId, currentPage])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-300">
            <Sparkles className="h-3.5 w-3.5" />
            Backoffice data view
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            <p className="mt-1 text-muted-foreground">{data.length} enregistrements</p>
          </div>
        </div>
        <div className="flex w-full items-center justify-between gap-3 md:w-auto md:min-w-[320px]">
          <p className="text-xs text-muted-foreground">
            {sortedData.length === 0
              ? '0 resultat'
              : `${pageStart + 1}-${Math.min(pageStart + ROWS_PER_PAGE, sortedData.length)} / ${sortedData.length}`}
          </p>
          {showAdd && (
            <Button
              onClick={onAdd}
              className="gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:from-green-600 hover:to-emerald-700"
            >
              <Plus className="h-4 w-4" />
              Ajouter
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-emerald-500/15 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] shadow-[0_25px_80px_rgba(0,0,0,0.22)] backdrop-blur-xl">
        <div className="grid gap-3 border-b border-white/10 bg-black/10 px-6 py-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.24em] text-emerald-300/80">Volume</p>
            <p className="mt-2 text-2xl font-bold text-foreground">{sortedData.length}</p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-300/80">Page</p>
            <p className="mt-2 text-2xl font-bold text-foreground">
              {currentPage}/{totalPages}
            </p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.24em] text-amber-300/80">Fenetre</p>
            <p className="mt-2 text-sm font-medium text-foreground">
              {sortedData.length === 0 ? 'Aucun resultat' : `${pageStart + 1} a ${Math.min(pageStart + ROWS_PER_PAGE, sortedData.length)}`}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto px-4 pb-4">
          <table className="w-full border-separate [border-spacing:0_12px]">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className="px-4 py-4 text-left first:pl-6">
                    <button
                      onClick={() => col.sortable && handleSort(col.key)}
                      className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-emerald-300"
                    >
                      {col.label}
                      {col.sortable && sortBy === col.key &&
                        (sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                    </button>
                  </th>
                ))}
                {showActions && <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {pageData.map((row, idx) => {
                const globalIndex = pageStart + idx
                const rowId = getRowIdentifier(row, globalIndex)
                const isHighlighted = highlightedRowId !== null && String(highlightedRowId) === String(rowId)

                return (
                  <tr
                    key={String(rowId)}
                    ref={(element) => {
                      rowRefs.current[String(rowId)] = element
                    }}
                    className="group"
                  >
                    {columns.map((col, columnIndex) => (
                      <td
                        key={col.key}
                        className={`border-y border-white/10 px-4 py-4 text-sm text-muted-foreground transition-all duration-300
                          ${columnIndex === 0 ? 'rounded-l-2xl border-l pl-6' : ''}
                          ${columnIndex === columns.length - 1 && !showActions ? 'rounded-r-2xl border-r pr-6' : ''}
                          ${isHighlighted ? 'bg-emerald-500/18' : 'bg-white/[0.045] group-hover:bg-white/[0.075]'}`}
                      >
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </td>
                    ))}
                    {showActions && (
                      <td
                        className={`rounded-r-2xl border-y border-r border-white/10 px-6 py-4 transition-all duration-300 ${
                          isHighlighted ? 'bg-emerald-500/18' : 'bg-white/[0.045] group-hover:bg-white/[0.075]'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => onEdit(row)}
                            className="rounded-xl border border-blue-400/20 bg-blue-500/10 p-2.5 text-blue-300 transition-colors hover:bg-blue-500/20 hover:text-blue-200"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onDelete(row)}
                            className="rounded-xl border border-red-400/20 bg-red-500/10 p-2.5 text-red-300 transition-colors hover:bg-red-500/20 hover:text-red-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {data.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-lg text-muted-foreground">Aucune donnee disponible</p>
            {showAdd && (
              <Button onClick={onAdd} variant="outline" className="mt-4">
                Creer le premier enregistrement
              </Button>
            )}
          </div>
        )}

        {sortedData.length > 0 && (
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-white/10 bg-black/10 p-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Precedent
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
              .map((page, idx, arr) => {
                const prev = arr[idx - 1]
                const showEllipsis = prev && page - prev > 1
                return (
                  <div key={`page-${page}`} className="flex items-center gap-2">
                    {showEllipsis && <span className="text-xs text-muted-foreground">...</span>}
                    <Button
                      variant={page === currentPage ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={page === currentPage ? 'bg-green-600 text-white hover:bg-green-700' : ''}
                    >
                      {page}
                    </Button>
                  </div>
                )
              })}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Suivant
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
