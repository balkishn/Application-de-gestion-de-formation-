'use client'

import { useEffect, useState } from 'react'
import { CalendarDays, Clock3, GraduationCap, MapPin, Users } from 'lucide-react'
import DataTable from '@/components/admin/data-table'
import FormModal from '@/components/admin/form-modal'
import { domaineApi, formationApi, formateurApi, participantApi } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

type TrainingItem = {
  id: number
  titre: string
  formateurNom?: string | null
  dateDebut?: string | null
  duree?: number | null
  participantCount?: number | null
  lieu?: string | null
  budget?: number | null
  domaineId?: number | null
  formateurId?: number | null
  participantIds?: number[]
}

export function TrainingList() {
  const { toast } = useToast()
  const [trainings, setTrainings] = useState<TrainingItem[]>([])
  const [domaines, setDomaines] = useState<any[]>([])
  const [formateurs, setFormateurs] = useState<any[]>([])
  const [participants, setParticipants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const loadData = async () => {
    try {
      setLoading(true)
      const [formationsData, domainesData, formateursData, participantsData] = await Promise.all([
        formationApi.getAll(),
        domaineApi.getAll().catch(() => []),
        formateurApi.getAll().catch(() => []),
        participantApi.getAll().catch(() => []),
      ])
      const sortedFormations = Array.isArray(formationsData)
        ? [...formationsData].sort((a: any, b: any) => {
            const aTime = a?.dateDebut ? new Date(`${a.dateDebut}T00:00:00`).getTime() : 0
            const bTime = b?.dateDebut ? new Date(`${b.dateDebut}T00:00:00`).getTime() : 0
            return bTime - aTime
          })
        : []
      setTrainings(sortedFormations)
      setDomaines(Array.isArray(domainesData) ? domainesData : [])
      setFormateurs(Array.isArray(formateursData) ? formateursData : [])
      setParticipants(Array.isArray(participantsData) ? participantsData : [])
      setError(null)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleAdd = () => {
    setEditingId(null)
    setShowModal(true)
  }

  const handleEdit = (row: TrainingItem) => {
    setEditingId(Number(row.id))
    setShowModal(true)
  }

  const handleDelete = async (row: TrainingItem) => {
    try {
      await formationApi.remove(Number(row.id))
      await loadData()
      toast({ title: 'Succes', description: 'La formation a ete supprimee avec succes' })
    } catch (requestError) {
      toast({
        title: 'Erreur de suppression',
        description: requestError instanceof Error ? requestError.message : 'Impossible de supprimer cette formation.',
        variant: 'destructive',
      })
    }
  }

  const handleSave = async (data: any) => {
    const payload = {
      titre: data.name,
      duree: Number(data.duration),
      budget: Number(data.budget),
      domaineId: Number(data.domaineId),
      lieu: data.lieu,
      dateDebut: data.startDate,
      formateurId: Number(data.formateurId),
      participantIds: Array.isArray(data.participantIds) ? data.participantIds.map((item: string) => Number(item)) : [],
    }

    try {
      if (editingId) {
        await formationApi.update(editingId, payload)
      } else {
        await formationApi.create(payload)
      }
      setShowModal(false)
      await loadData()
      toast({ title: 'Succes', description: editingId ? 'Formation modifiee avec succes' : 'Formation ajoutee avec succes' })
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Erreur lors de l'enregistrement")
    }
  }

  if (loading) {
    return <div className="text-sm text-muted-foreground">Chargement des formations...</div>
  }

  if (error) {
    return <div className="text-sm text-destructive">{error}</div>
  }

  const columns = [
    {
      key: 'titre',
      label: 'Formation',
      sortable: true,
      render: (value: string, row: TrainingItem) => (
        <div className="space-y-1">
          <div className="font-semibold text-foreground">{value}</div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/12 px-2 py-1 text-emerald-300">
              <MapPin className="h-3 w-3" />
              {row.lieu || 'Lieu a definir'}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/8 px-2 py-1">#{row.id}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'formateurNom',
      label: 'Formateur',
      sortable: true,
      render: (value: string) => (
        <div className="inline-flex items-center gap-2 text-foreground">
          <span className="rounded-full bg-cyan-500/12 p-2 text-cyan-300">
            <GraduationCap className="h-3.5 w-3.5" />
          </span>
          <span className="font-medium">{value || 'Non assigne'}</span>
        </div>
      ),
    },
    {
      key: 'duree',
      label: 'Rythme',
      render: (value: number) => (
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/12 px-3 py-1.5 font-medium text-amber-200">
          <Clock3 className="h-3.5 w-3.5" />
          {value ? `${value} jours` : '-'}
        </div>
      ),
    },
    {
      key: 'participantCount',
      label: 'Participants',
      render: (value: number) => (
        <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/12 px-3 py-1.5 font-medium text-violet-200">
          <Users className="h-3.5 w-3.5" />
          {value || 0}
        </div>
      ),
    },
    {
      key: 'dateDebut',
      label: 'Lancement',
      render: (value: string) => (
        <div className="inline-flex items-center gap-2 text-foreground">
          <CalendarDays className="h-4 w-4 text-emerald-300" />
          <span>{value || '-'}</span>
        </div>
      ),
    },
  ]

  const editingFormation = editingId ? (trainings.find((item) => Number(item.id) === editingId) as any) : null

  return (
    <div className="space-y-4">
      <DataTable
        title="Formations"
        columns={columns}
        data={trainings as any[]}
        onAdd={handleAdd}
        onEdit={handleEdit as any}
        onDelete={handleDelete as any}
      />

      {showModal && (
        <FormModal
          title={editingId ? 'Modifier la formation' : 'Nouvelle formation'}
          fields={[
            { name: 'name', label: 'Nom', type: 'text', required: true },
            { name: 'duration', label: 'Duree (jours)', type: 'number', required: true },
            { name: 'budget', label: 'Budget', type: 'number', required: true },
            {
              name: 'domaineId',
              label: 'Domaine',
              type: 'select',
              required: true,
              options: domaines.map((item) => ({ label: item.libelle, value: String(item.id) })),
            },
            {
              name: 'formateurId',
              label: 'Formateur',
              type: 'select',
              required: true,
              options: formateurs.map((item) => ({
                label: `${item.nom} ${item.prenom}`,
                value: String(item.id),
              })),
            },
            {
              name: 'participantIds',
              label: 'Participants',
              type: 'multiselect',
              required: false,
              options: participants.map((item) => ({
                label: `${item.nom} ${item.prenom}`,
                value: String(item.id),
              })),
            },
            { name: 'lieu', label: 'Lieu', type: 'text', required: false },
            { name: 'startDate', label: 'Date debut', type: 'date', required: false },
          ]}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
          initialData={editingFormation ? {
            name: editingFormation.titre,
            duration: editingFormation.duree,
            budget: editingFormation.budget,
            domaineId: String(editingFormation.domaineId || ''),
            formateurId: String(editingFormation.formateurId || ''),
            participantIds: (editingFormation.participantIds || []).map(String),
            lieu: editingFormation.lieu,
            startDate: editingFormation.dateDebut,
          } : undefined}
        />
      )}
    </div>
  )
}
