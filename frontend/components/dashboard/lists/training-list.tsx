'use client'

import { useEffect, useState } from 'react'
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
      setTrainings(Array.isArray(formationsData) ? formationsData : [])
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
      toast({ title: 'Succès', description: 'La formation a été supprimée avec succès' })
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
      participantIds: Array.isArray(data.participantIds)
        ? data.participantIds.map((item: string) => Number(item))
        : [],
    }

    try {
      if (editingId) {
        await formationApi.update(editingId, payload)
      } else {
        await formationApi.create(payload)
      }
      setShowModal(false)
      await loadData()
      toast({ title: 'Succès', description: editingId ? 'Formation modifiée avec succès' : 'Formation ajoutée avec succès' })
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Erreur lors de l\'enregistrement')
    }
  }

  if (loading) {
    return <div className="text-sm text-muted-foreground">Chargement des formations...</div>
  }

  if (error) {
    return <div className="text-sm text-destructive">{error}</div>
  }

  const columns = [
    { key: 'titre', label: 'Nom', sortable: true },
    { key: 'formateurNom', label: 'Formateur', sortable: true },
    { key: 'duree', label: 'Durée' },
    { key: 'participantCount', label: 'Participants' },
    {
      key: 'dateDebut',
      label: 'Date début',
      render: (value: string) => value || '-',
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
            { name: 'duration', label: 'Durée (jours)', type: 'number', required: true },
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
            { name: 'startDate', label: 'Date début', type: 'date', required: false },
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
