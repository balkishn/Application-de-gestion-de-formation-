'use client'

import { useEffect, useRef, useState } from 'react'
import { Bell, CalendarDays, MapPin, BellRing, CheckCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { notificationsApi } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { getCurrentRole } from '@/lib/auth'

type FormationNotification = {
  id: number
  formationId: number
  formationTitre: string
  formationDateDebut: string
  formationLieu?: string | null
  formationDuree?: number | null
  message: string
  createdAt: string
}

const STORAGE_KEY = 'formation-notification-seen-ids'

function readSeenIds() {
  if (typeof window === 'undefined') {
    return new Set<string>()
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set<string>()
    const parsed = JSON.parse(raw)
    return new Set<string>(Array.isArray(parsed) ? parsed.map(String) : [])
  } catch {
    return new Set<string>()
  }
}

function saveSeenIds(ids: Set<string>) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)))
}

function formatDate(dateValue?: string | null) {
  if (!dateValue) return 'Non renseignée'
  const parsed = new Date(`${dateValue}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return dateValue
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(parsed)
}

export default function FormationNotificationCenter() {
  const router = useRouter()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<FormationNotification[]>([])
  const [open, setOpen] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const initializedRef = useRef(false)
  const seenIdsRef = useRef<Set<string>>(readSeenIds())
  const role = getCurrentRole()

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(window.Notification.permission)
    }

    let cancelled = false

    const loadNotifications = async () => {
      try {
        const data = await notificationsApi.getRecent()
        if (cancelled) return

        const nextNotifications = Array.isArray(data) ? data : []
        setNotifications(nextNotifications)

        const currentIds = new Set(nextNotifications.map((item) => String(item.id)))
        if (!initializedRef.current) {
          seenIdsRef.current = currentIds
          saveSeenIds(seenIdsRef.current)
          initializedRef.current = true
          return
        }

        const newItems = nextNotifications.filter((item) => !seenIdsRef.current.has(String(item.id)))
        if (newItems.length === 0) return

        newItems.forEach((item) => {
          toast({
            title: 'Formation qui commence aujourd\'hui',
            description: `${item.formationTitre} - ${item.message}`,
          })

          if (typeof window !== 'undefined' && 'Notification' in window && window.Notification.permission === 'granted') {
            new window.Notification('Formation qui commence aujourd\'hui', {
              body: `${item.formationTitre}\n${item.message}`,
              icon: '/icon.svg',
            })
          }
        })

        newItems.forEach((item) => seenIdsRef.current.add(String(item.id)))
        saveSeenIds(seenIdsRef.current)
      } catch {
        // Silent by design to avoid interrupting user navigation if notifications cannot be fetched.
      }
    }

    loadNotifications()
    const interval = window.setInterval(loadNotifications, 60000)

    return () => {
      cancelled = true
      window.clearInterval(interval)
    }
  }, [toast])

  const requestSystemPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) return
    const nextPermission = await window.Notification.requestPermission()
    setPermission(nextPermission)
  }

  const markAllSeen = () => {
    const nextSeen = new Set(seenIdsRef.current)
    notifications.forEach((item) => nextSeen.add(String(item.id)))
    seenIdsRef.current = nextSeen
    saveSeenIds(seenIdsRef.current)
  }

  const hasNotifications = notifications.length > 0

  const openTarget = role === 'SIMPLE_UTILISATEUR' ? '/dashboard/formations' : '/admin/formations'

  return (
    <div className="relative">
      <button
        onClick={() => {
          setOpen((current) => !current)
          if (!open) markAllSeen()
        }}
        className="relative flex items-center gap-2 p-2 hover:bg-secondary/50 rounded-lg transition-colors"
        aria-label="Notifications de formation"
      >
        <Bell className="w-5 h-5 text-foreground" />
        {hasNotifications && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center">
            {notifications.length > 9 ? '9+' : notifications.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-[22rem] max-w-[90vw] rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden z-50">
          <div className="p-4 border-b border-border/50 flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-foreground flex items-center gap-2">
                <BellRing className="w-4 h-4 text-emerald-400" />
                Notifications formations
              </p>
              <p className="text-xs text-muted-foreground">Alertes du jour et formations à lancer</p>
            </div>
            {permission !== 'granted' && (
              <button
                onClick={requestSystemPermission}
                className="text-xs rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 px-3 py-1 hover:bg-emerald-500/20 transition-colors"
              >
                Activer
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-auto">
            {notifications.length === 0 ? (
              <div className="p-5 text-sm text-muted-foreground">Aucune notification disponible.</div>
            ) : (
              notifications.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setOpen(false)
                    router.push(openTarget)
                  }}
                  className="w-full text-left p-4 border-b border-border/40 hover:bg-secondary/60 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                      <CheckCheck className="h-4 w-4" />
                    </div>
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-foreground truncate">{item.formationTitre}</p>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">{formatDate(item.formationDateDebut)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-5">{item.message}</p>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays className="w-3 h-3" />
                          Début: {formatDate(item.formationDateDebut)}
                        </span>
                        {item.formationLieu && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {item.formationLieu}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}