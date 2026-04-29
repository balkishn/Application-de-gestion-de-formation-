'use client'

import { useEffect, useState } from 'react'
import DataTable from '@/components/admin/data-table'
import FormModal from '@/components/admin/form-modal'
import { domaineApi, formationApi, formateurApi, participantApi } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

export default function FormationsPage() {
  const { toast } = useToast()
  const [formations, setFormations] = useState<any[]>([])
  const [domaines, setDomaines] = useState<any[]>([])
  const [formateurs, setFormateurs] = useState<any[]>([])
  const [participants, setParticipants] = useState<any[]>([])
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const loadData = async () => {
    try {
      const [formationsData, domainesData, formateursData, participantsData] = await Promise.all([
        formationApi.getAll(),
        domaineApi.getAll().catch(() => []),
        formateurApi.getAll(),
        participantApi.getAll().catch(() => []),
      ])
      setFormations(formationsData || [])
      setDomaines(domainesData || [])
      setFormateurs(formateursData || [])
      setParticipants(participantsData || [])
      setError('')
    } catch (e: any) {
      setError(e?.message || 'Erreur de chargement des formations')
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleAdd = () => {
    setEditingId(null)
    setShowModal(true)
  }

  const handleEdit = (row: any) => {
    setEditingId(row.id)
    setShowModal(true)
  }

  const handleDelete = async (row: any) => {
    try {
      await formationApi.remove(Number(row.id))
      await loadData()
      toast({
        title: 'Succès',
        description: 'La formation a été supprimée avec succès',
      })
    } catch (e: any) {
      toast({
        title: 'Erreur de suppression',
        description: e?.message || 'Impossible de supprimer cette formation car elle est utilisée dans d\'autres enregistrements.',
        variant: 'destructive',
      })
    }
  }

  const handleSaveModal = async (data: any) => {
    const payload = {
      titre: data.name,
      duree: Number(data.duration),
      budget: Number(data.budget),
      domaineId: Number(data.domaineId),
      lieu: data.lieu,
      dateDebut: data.startDate,
      formateurId: Number(data.formateurId),
      participantIds: Array.isArray(data.participantIds)
        ? data.participantIds.map((id: string) => Number(id))
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
    } catch (e: any) {
      setError(e?.message || 'Erreur lors de l\'enregistrement')
    }
  }

  const columns = [
    { key: 'titre', label: 'Nom', sortable: true },
    { key: 'formateurNom', label: 'Instructeur', sortable: true },
    { key: 'duree', label: 'Durée' },
    { key: 'participantCount', label: 'Participants' },
    {
      key: 'dateDebut',
      label: 'Date début',
      render: (value: string) => value || '-',
    },
  ]

  return (
    <div className="animate-fadeIn">
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      <DataTable
        title="Formations"
        columns={columns}
        data={formations}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      {showModal && (
        <FormModal
          title={editingId ? 'Modifier la formation' : 'Nouvelle formation'}
          fields={[
            { name: 'name', label: 'Nom', type: 'text', required: true },
            { name: 'duration', label: 'Durée (jours)', type: 'number', required: true },
            { name: 'budget', label: 'Budget', type: 'number', required: true },
            { name: 'domaineId', label: 'Domaine', type: 'select', options: domaines.map((d) => ({ label: d.libelle, value: String(d.id) })), required: true },
            { name: 'formateurId', label: 'Formateur', type: 'select', options: formateurs.map((f) => ({ label: `${f.nom} ${f.prenom}`, value: String(f.id) })), required: true },
            { name: 'participantIds', label: 'Participants', type: 'multiselect', options: participants.map((p) => ({ label: `${p.nom} ${p.prenom}`, value: String(p.id) })), required: false },
            { name: 'lieu', label: 'Lieu', type: 'text', required: false },
            { name: 'startDate', label: 'Date début', type: 'date', required: false },
          ]}
          onSave={handleSaveModal}
          onClose={() => setShowModal(false)}
          initialData={editingId ? {
            name: formations.find((f) => Number(f.id) === editingId)?.titre,
            duration: formations.find((f) => Number(f.id) === editingId)?.duree,
            budget: formations.find((f) => Number(f.id) === editingId)?.budget,
            domaineId: String(formations.find((f) => Number(f.id) === editingId)?.domaineId || ''),
            formateurId: String(formations.find((f) => Number(f.id) === editingId)?.formateurId || ''),
            participantIds: (formations.find((f) => Number(f.id) === editingId)?.participantIds || []).map(String),
            lieu: formations.find((f) => Number(f.id) === editingId)?.lieu,
            startDate: formations.find((f) => Number(f.id) === editingId)?.dateDebut,
          } : undefined}
        />
      )}
    </div>
  )
}
