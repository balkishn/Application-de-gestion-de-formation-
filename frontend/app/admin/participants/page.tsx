'use client'

import { useEffect, useState } from 'react'
import DataTable from '@/components/admin/data-table'
import FormModal from '@/components/admin/form-modal'
import { participantApi, profilApi, structureApi } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

export default function ParticipantsPage() {
  const { toast } = useToast()
  const [participants, setParticipants] = useState<any[]>([])
  const [structures, setStructures] = useState<any[]>([])
  const [profils, setProfils] = useState<any[]>([])
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const getShortError = (error: unknown, fallback: string) => {
    const message = error instanceof Error ? error.message : String(error ?? '')
    const compact = message.split('\n')[0].trim()
    return compact ? (compact.length > 120 ? `${compact.slice(0, 117)}...` : compact) : fallback
  }

  const loadData = async () => {
    try {
      const [participantsData, structuresData, profilsData] = await Promise.all([
        participantApi.getAll(),
        structureApi.getAll(),
        profilApi.getAll(),
      ])
      setParticipants(participantsData || [])
      setStructures(structuresData || [])
      setProfils(profilsData || [])
      setError('')
    } catch (e: any) {
      setError(e?.message || 'Erreur de chargement des participants')
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
      await participantApi.remove(Number(row.id))
      await loadData()
      toast({
        title: 'Succès',
        description: 'Le participant a été supprimé avec succès',
      })
    } catch (e: any) {
      toast({
        title: 'Erreur de suppression',
        description: getShortError(e, 'Suppression impossible pour ce participant.'),
        variant: 'destructive',
      })
    }
  }

  const handleSaveModal = async (data: any) => {
    const payload = {
      nom: data.lastName,
      prenom: data.firstName,
      email: data.email,
      tel: Number(data.phone),
      structureId: Number(data.structureId),
      profilId: Number(data.profilId),
    }

    try {
      if (editingId) {
        await participantApi.update(editingId, payload)
      } else {
        await participantApi.create(payload)
      }
      setShowModal(false)
      await loadData()
      toast({
        title: 'Succès',
        description: editingId ? 'Participant modifié avec succès' : 'Participant ajouté avec succès',
      })
    } catch (e: any) {
      toast({
        title: 'Erreur',
        description: getShortError(e, "Erreur lors de l'enregistrement du participant."),
        variant: 'destructive',
      })
    }
  }

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    {
      key: 'prenom',
      label: 'Nom Complet',
      render: (value: string, row: any) => `${row.prenom} ${row.nom}`,
      sortable: true,
    },
    { key: 'structureLibelle', label: 'Structure', sortable: true },
    { key: 'profilLibelle', label: 'Profil', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'tel', label: 'Téléphone' },
  ]

  return (
    <div className="animate-fadeIn">
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      <DataTable
        title="Participants"
        columns={columns}
        data={participants}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      {showModal && (
        <FormModal
          title={editingId ? 'Modifier le participant' : 'Nouveau participant'}
          fields={[
            { name: 'firstName', label: 'Prénom', type: 'text', required: true },
            { name: 'lastName', label: 'Nom', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'phone', label: 'Téléphone', type: 'text', required: true },
            { name: 'structureId', label: 'Structure', type: 'select', options: structures.map((s) => ({ label: s.libelle, value: String(s.id) })), required: true },
            { name: 'profilId', label: 'Profil', type: 'select', options: profils.map((p) => ({ label: p.libelle, value: String(p.id) })), required: true },
          ]}
          onSave={handleSaveModal}
          onClose={() => setShowModal(false)}
          initialData={editingId ? {
            firstName: participants.find((p) => Number(p.id) === editingId)?.prenom,
            lastName: participants.find((p) => Number(p.id) === editingId)?.nom,
            email: participants.find((p) => Number(p.id) === editingId)?.email,
            phone: String(participants.find((p) => Number(p.id) === editingId)?.tel || ''),
            structureId: String(participants.find((p) => Number(p.id) === editingId)?.structureId || ''),
            profilId: String(participants.find((p) => Number(p.id) === editingId)?.profilId || ''),
          } : undefined}
        />
      )}
    </div>
  )
}
