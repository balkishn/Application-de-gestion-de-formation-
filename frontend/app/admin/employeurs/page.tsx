'use client'

import { useEffect, useState } from 'react'
import DataTable from '@/components/admin/data-table'
import FormModal from '@/components/admin/form-modal'
import { employeurApi } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

export default function EmployeursPage() {
  const { toast } = useToast()
  const [employeurs, setEmployeurs] = useState<any[]>([])
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const loadData = async () => {
    try {
      const data = await employeurApi.getAll()
      setEmployeurs(data || [])
      setError('')
    } catch (e: any) {
      setError(e?.message || 'Erreur de chargement des employeurs')
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
      await employeurApi.remove(Number(row.id))
      await loadData()
      toast({
        title: 'Succès',
        description: 'L\'employeur a été supprimé avec succès',
      })
    } catch (e: any) {
      toast({
        title: 'Erreur de suppression',
        description: 'Impossible de supprimer cet employeur car il est utilisé dans d\'autres enregistrements.',
        variant: 'destructive',
      })
    }
  }

  const handleSaveModal = async (data: any) => {
    const payload = { nomemployeur: data.nomEmployeur }
    try {
      if (editingId) {
        await employeurApi.update(editingId, payload)
      } else {
        await employeurApi.create(payload)
      }
      setShowModal(false)
      await loadData()
    } catch (e: any) {
      setError(e?.message || 'Erreur lors de l\'enregistrement')
    }
  }

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    {
      key: 'nomEmployeur',
      label: 'Nom Employeur',
      sortable: true,
      render: (value: string, row: any) => value || row.nomemployeur || '-',
    },
  ]

  return (
    <div className="animate-fadeIn">
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      <DataTable
        title="Employeurs"
        columns={columns}
        data={employeurs}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      {showModal && (
        <FormModal
          title={editingId ? 'Modifier l\'employeur' : 'Nouvel employeur'}
          fields={[
            { name: 'nomEmployeur', label: 'Nom Employeur', type: 'text', required: true },
          ]}
          onSave={handleSaveModal}
          onClose={() => setShowModal(false)}
          initialData={editingId ? { nomEmployeur: employeurs.find((e) => Number(e.id) === editingId)?.nomemployeur } : undefined}
        />
      )}
    </div>
  )
}
