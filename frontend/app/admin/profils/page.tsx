'use client'

import { useEffect, useState } from 'react'
import DataTable from '@/components/admin/data-table'
import FormModal from '@/components/admin/form-modal'
import { profilApi } from '@/lib/api'
import { hasAnyRole } from '@/lib/auth'
import { useToast } from '@/hooks/use-toast'

export default function ProfilsPage() {
  const { toast } = useToast()
  const [profils, setProfils] = useState<any[]>([])
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const canEdit = hasAnyRole(['ADMINISTRATEUR'])

  const loadData = async () => {
    try {
      const profilsData = await profilApi.getAll()
      setProfils(profilsData || [])
      setError('')
    } catch (e: any) {
      setError(e?.message || 'Erreur de chargement des profils')
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
      await profilApi.remove(Number(row.id))
      await loadData()
      toast({
        title: 'Succès',
        description: 'Le profil a été supprimé avec succès',
      })
    } catch (e: any) {
      toast({
        title: 'Erreur de suppression',
        description: 'Impossible de supprimer ce profil car il est utilisé dans d\'autres enregistrements.',
        variant: 'destructive',
      })
    }
  }

  const handleSaveModal = async (data: any) => {
    if (!canEdit) return
    try {
      const payload = { libelle: data.libelle }
      if (editingId) {
        await profilApi.update(editingId, payload)
      } else {
        await profilApi.create(payload)
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
        title="Profils"
        columns={columns}
        data={profils}
        onAdd={canEdit ? handleAdd : () => {}}
        onEdit={canEdit ? handleEdit : () => {}}
        onDelete={canEdit ? handleDelete : () => {}}
        showAdd={canEdit}
        showActions={canEdit}
      />
      {canEdit && showModal && (
        <FormModal
          title={editingId ? 'Modifier le profil' : 'Nouveau profil'}
          fields={[
            { name: 'libelle', label: 'Libellé', type: 'text', required: true },
          ]}
          onSave={handleSaveModal}
          onClose={() => setShowModal(false)}
          initialData={editingId ? { libelle: profils.find((p) => Number(p.id) === editingId)?.libelle } : undefined}
        />
      )}
    </div>
  )
}
