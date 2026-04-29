'use client'

import { useEffect, useState } from 'react'
import DataTable from '@/components/admin/data-table'
import FormModal from '@/components/admin/form-modal'
import { employeurApi, formateurApi } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

type TrainerItem = {
  id: number
  nom: string
  prenom: string
  email: string
  tel?: number | null
  type?: string | null
  employeurNom?: string | null
}

export function TrainerList() {
  const { toast } = useToast()
  const sanitizeErrorMessage = (err: unknown) => {
    const raw = err instanceof Error ? err.message : String(err ?? '')
    const firstLine = raw.split('\n')[0] || ''
    return firstLine.length > 120 ? firstLine.slice(0, 117) + '...' : firstLine
  }
  const [trainers, setTrainers] = useState<TrainerItem[]>([])
  const [employeurs, setEmployeurs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const loadData = async () => {
    try {
      setLoading(true)
      const [formateursData, employeursData] = await Promise.all([
        formateurApi.getAll(),
        employeurApi.getAll().catch(() => []),
      ])
      setTrainers(Array.isArray(formateursData) ? formateursData : [])
      setEmployeurs(Array.isArray(employeursData) ? employeursData : [])
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

  const handleEdit = (row: TrainerItem) => {
    setEditingId(Number(row.id))
    setShowModal(true)
  }

  const handleDelete = async (row: TrainerItem) => {
    try {
      await formateurApi.remove(Number(row.id))
      await loadData()
      toast({ title: 'Succès', description: 'Le formateur a été supprimé avec succès' })
    } catch (requestError) {
      toast({
        title: 'Erreur de suppression',
        description: sanitizeErrorMessage(requestError) || 'Impossible de supprimer ce formateur.',
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
      type: data.type,
      employeurId: data.type === 'EXTERNE' && data.employeurId ? Number(data.employeurId) : null,
    }

    if (payload.type === 'EXTERNE' && !payload.employeurId) {
      toast({
        title: 'Erreur',
        description: "Le nom de l'employeur est obligatoire pour un formateur externe.",
        variant: 'destructive',
      })
      return
    }

    try {
      if (editingId) {
        await formateurApi.update(editingId, payload)
      } else {
        await formateurApi.create(payload)
      }
      setShowModal(false)
      await loadData()
      toast({ title: 'Succès', description: editingId ? 'Formateur modifié avec succès' : 'Formateur ajouté avec succès' })
    } catch (requestError) {
      toast({
        title: 'Erreur',
        description: sanitizeErrorMessage(requestError) || "Erreur lors de l'enregistrement",
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return <div className="text-sm text-muted-foreground">Chargement des formateurs...</div>
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
      render: (value: string, row: TrainerItem) => `${row.prenom} ${row.nom}`,
    },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'tel', label: 'Téléphone' },
    {
      key: 'type',
      label: 'Type',
      render: (value: string) => value || '-',
    },
    {
      key: 'employeurNom',
      label: 'Employeur',
      render: (value: string) => value || '-',
    },
  ]

  const editingTrainer = editingId ? trainers.find((item) => Number(item.id) === editingId) : null

  return (
    <div className="space-y-4">
      <DataTable
        title="Formateurs"
        columns={columns}
        data={trainers}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {showModal && (
        <FormModal
          title={editingId ? 'Modifier le formateur' : 'Nouveau formateur'}
          fields={[
            { name: 'firstName', label: 'Prénom', type: 'text', required: true },
            { name: 'lastName', label: 'Nom', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'phone', label: 'Téléphone', type: 'text', required: true },
            { name: 'type', label: 'Type', type: 'select', options: ['INTERNE', 'EXTERNE'], required: true },
            {
              name: 'employeurId',
              label: 'Nom Employeur (obligatoire pour EXTERNE)',
              type: 'select',
              required: false,
              options: employeurs.map((item) => ({
                label: item.nomemployeur,
                value: String(item.id),
              })),
            },
          ]}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
          initialData={editingTrainer ? {
            firstName: editingTrainer.prenom,
            lastName: editingTrainer.nom,
            email: editingTrainer.email,
            phone: String(editingTrainer.tel || ''),
            type: editingTrainer.type,
            employeurId: String((editingTrainer as any).employeurId || ''),
          } : undefined}
        />
      )}
    </div>
  )
}
