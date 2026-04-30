'use client'

import { useEffect, useState } from 'react'
import DataTable from '@/components/admin/data-table'
import FormModal from '@/components/admin/form-modal'
import { participantApi, profilApi, structureApi } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

type ParticipantItem = {
  id: number
  nom: string
  prenom: string
  email: string
  structureLibelle?: string | null
  profilLibelle?: string | null
}

export function ParticipantList() {
  const { toast } = useToast()
  const sanitizeErrorMessage = (err: unknown) => {
    const raw = err instanceof Error ? err.message : String(err ?? '')
    const firstLine = raw.split('\n')[0] || ''
    return firstLine.length > 120 ? firstLine.slice(0, 117) + '...' : firstLine
  }
  const [participants, setParticipants] = useState<ParticipantItem[]>([])
  const [structures, setStructures] = useState<any[]>([])
  const [profils, setProfils] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const loadData = async () => {
    try {
      setLoading(true)
      const [participantsData, structuresData, profilsData] = await Promise.all([
        participantApi.getAll(),
        structureApi.getAll().catch(() => []),
        profilApi.getAll().catch(() => []),
      ])
      setParticipants(Array.isArray(participantsData) ? participantsData : [])
      setStructures(Array.isArray(structuresData) ? structuresData : [])
      setProfils(Array.isArray(profilsData) ? profilsData : [])
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

  const handleEdit = (row: ParticipantItem) => {
    setEditingId(Number(row.id))
    setShowModal(true)
  }

  const handleDelete = async (row: ParticipantItem) => {
    try {
      await participantApi.remove(Number(row.id))
      await loadData()
      toast({ title: 'Succès', description: 'Le participant a été supprimé avec succès' })
    } catch (requestError) {
      toast({
        title: 'Erreur de suppression',
        description: sanitizeErrorMessage(requestError) || 'Impossible de supprimer ce participant.',
        variant: 'destructive',
      })
    }
  }

  const handleSave = async (data: any) => {
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
      toast({ title: 'Succès', description: editingId ? 'Participant modifié avec succès' : 'Participant ajouté avec succès' })
    } catch (requestError) {
      toast({
        title: 'Erreur',
        description: sanitizeErrorMessage(requestError) || "Erreur lors de l'enregistrement",
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return <div className="text-sm text-muted-foreground">Chargement des participants...</div>
  }

  if (error) {
    return <div className="text-sm text-destructive">{error}</div>
  }

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    {
      key: 'prenom',
      label: 'Nom complet',
      sortable: true,
      render: (value: string, row: ParticipantItem) => `${row.prenom} ${row.nom}`,
    },
    { key: 'structureLibelle', label: 'Structure', sortable: true },
    { key: 'profilLibelle', label: 'Profil', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'tel', label: 'Téléphone' },
  ]

  const editingParticipant = editingId ? (participants.find((item) => Number(item.id) === editingId) as any) : null

  return (
    <div className="space-y-4">
      <DataTable
        title="Participants"
        columns={columns}
        data={participants as any[]}
        onAdd={handleAdd}
        onEdit={handleEdit as any}
        onDelete={handleDelete as any}
      />

      {showModal && (
        <FormModal
          title={editingId ? 'Modifier le participant' : 'Nouveau participant'}
          fields={[
            { name: 'firstName', label: 'Prénom', type: 'text', required: true },
            { name: 'lastName', label: 'Nom', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'phone', label: 'Téléphone', type: 'text', required: true },
            {
              name: 'structureId',
              label: 'Structure',
              type: 'select',
              required: true,
              options: structures.map((item) => ({ label: item.libelle, value: String(item.id) })),
            },
            {
              name: 'profilId',
              label: 'Profil',
              type: 'select',
              required: true,
              options: profils.map((item) => ({ label: item.libelle, value: String(item.id) })),
            },
          ]}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
          initialData={editingParticipant ? {
            firstName: editingParticipant.prenom,
            lastName: editingParticipant.nom,
            email: editingParticipant.email,
            phone: String(editingParticipant.tel || ''),
            structureId: String(editingParticipant.structureId || ''),
            profilId: String(editingParticipant.profilId || ''),
          } : undefined}
        />
      )}
    </div>
  )
}
