'use client'

import { useEffect, useState } from 'react'
import DataTable from '@/components/admin/data-table'
import FormModal from '@/components/admin/form-modal'
import { domaineApi } from '@/lib/api'
import { hasAnyRole } from '@/lib/auth'
import { useToast } from '@/hooks/use-toast'

export default function DomainesPage() {
  const { toast } = useToast()
  const [domaines, setDomaines] = useState<any[]>([])
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const canEdit = hasAnyRole(['ADMINISTRATEUR'])

  const loadData = async () => {
    try {
      const domainesData = await domaineApi.getAll()
      setDomaines(domainesData || [])
      setError('')
    } catch (e: any) {
      setError(e?.message || 'Erreur de chargement des domaines')
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
    if (!canEdit) return
    try {
      await domaineApi.remove(Number(row.id))
      await loadData()
      toast({
        title: 'Succès',
        description: 'Le domaine a été supprimé avec succès',
      })
    } catch (e: any) {
      toast({
        title: 'Erreur de suppression',
        description: 'Impossible de supprimer ce domaine car il est utilisé dans d\'autres enregistrements.',
        variant: 'destructive',
      })
    }
  }

  const handleSaveModal = async (data: any) => {
    if (!canEdit) return
    try {
      const payload = { libelle: data.libelle }
      if (editingId) {
        await domaineApi.update(editingId, payload)
      } else {
        await domaineApi.create(payload)
      }
      setShowModal(false)
      await loadData()
    } catch (e: any) {
      setError(e?.message || 'Erreur lors de l\'enregistrement')
    }
  }

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'libelle', label: 'Domaine', sortable: true },
  ]

  return (
    <div className="animate-fadeIn">
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      <DataTable
        title="Domaines"
        columns={columns}
        data={domaines}
        onAdd={canEdit ? handleAdd : () => {}}
        onEdit={canEdit ? handleEdit : () => {}}
        onDelete={canEdit ? handleDelete : () => {}}
        showAdd={canEdit}
        showActions={canEdit}
      />
      {canEdit && showModal && (
        <FormModal
          title={editingId ? 'Modifier le domaine' : 'Nouveau domaine'}
          fields={[
            { name: 'libelle', label: 'Libellé', type: 'text', required: true },
          ]}
          onSave={handleSaveModal}
          onClose={() => setShowModal(false)}
          initialData={editingId ? { libelle: domaines.find((d) => Number(d.id) === editingId)?.libelle } : undefined}
        />
      )}
    </div>
  )
}
