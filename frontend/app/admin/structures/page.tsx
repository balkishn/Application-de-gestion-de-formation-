'use client'

import { useEffect, useState } from 'react'
import DataTable from '@/components/admin/data-table'
import FormModal from '@/components/admin/form-modal'
import { structureApi } from '@/lib/api'
import { hasAnyRole } from '@/lib/auth'
import { useToast } from '@/hooks/use-toast'

export default function StructuresPage() {
  const { toast } = useToast()
  const [structures, setStructures] = useState<any[]>([])
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const canEdit = hasAnyRole(['ADMINISTRATEUR'])

  const loadData = async () => {
    try {
      const structuresData = await structureApi.getAll()
      setStructures(structuresData || [])
      setError('')
    } catch (e: any) {
      setError(e?.message || 'Erreur de chargement des structures')
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
      await structureApi.remove(Number(row.id))
      await loadData()
      toast({
        title: 'Succès',
        description: 'La structure a été supprimée avec succès',
      })
    } catch (e: any) {
      toast({
        title: 'Erreur de suppression',
        description: 'Impossible de supprimer cette structure car elle est utilisée dans d\'autres enregistrements.',
        variant: 'destructive',
      })
    }
  }

  const handleSaveModal = async (data: any) => {
    if (!canEdit) return
    try {
      const payload = { libelle: data.libelle }
      if (editingId) {
        await structureApi.update(editingId, payload)
      } else {
        await structureApi.create(payload)
      }
      setShowModal(false)
      await loadData()
    } catch (e: any) {
      setError(e?.message || 'Erreur lors de l\'enregistrement')
    }
  }

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'libelle', label: 'Libellé', sortable: true },
  ]

  return (
    <div className="animate-fadeIn">
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      <DataTable
        title="Structures"
        columns={columns}
        data={structures}
        onAdd={canEdit ? handleAdd : () => {}}
        onEdit={canEdit ? handleEdit : () => {}}
        onDelete={canEdit ? handleDelete : () => {}}
        showAdd={canEdit}
        showActions={canEdit}
      />
      {canEdit && showModal && (
        <FormModal
          title={editingId ? 'Modifier la structure' : 'Nouvelle structure'}
          fields={[
            { name: 'libelle', label: 'Libellé', type: 'text', required: true },
          ]}
          onSave={handleSaveModal}
          onClose={() => setShowModal(false)}
          initialData={editingId ? { libelle: structures.find((s) => Number(s.id) === editingId)?.libelle } : undefined}
        />
      )}
    </div>
  )
}
