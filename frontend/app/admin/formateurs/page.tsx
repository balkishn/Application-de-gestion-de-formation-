'use client'

import { useEffect, useState } from 'react'
import DataTable from '@/components/admin/data-table'
import FormModal from '@/components/admin/form-modal'
import { employeurApi, formateurApi } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

export default function Formateurs() {
  const { toast } = useToast()
  const [formateurs, setFormateurs] = useState<any[]>([])
  const [employeurs, setEmployeurs] = useState<any[]>([])
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
      const [formateursData, employeursData] = await Promise.all([
        formateurApi.getAll(),
        employeurApi.getAll(),
      ])
      setFormateurs(formateursData || [])
      setEmployeurs(employeursData || [])
      setError('')
    } catch (e: any) {
      setError(e?.message || 'Erreur de chargement des formateurs')
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
      await formateurApi.remove(Number(row.id))
      await loadData()
      toast({
        title: 'Succès',
        description: 'Le formateur a été supprimé avec succès',
      })
    } catch (e: any) {
      toast({
        title: 'Erreur de suppression',
        description: getShortError(e, 'Suppression impossible pour ce formateur.'),
        variant: 'destructive',
      })
    }
  }

  const handleSaveModal = async (data: any) => {
    if (data.type === 'EXTERNE' && !data.employeurId) {
      toast({
        title: 'Erreur',
        description: "Le nom de l'employeur est obligatoire pour un formateur externe.",
        variant: 'destructive',
      })
      return
    }

    const payload = {
      nom: data.lastName,
      prenom: data.firstName,
      email: data.email,
      tel: Number(data.phone),
      type: data.type,
      employeurId: data.type === 'EXTERNE' && data.employeurId ? Number(data.employeurId) : null,
    }

    try {
      if (editingId) {
        await formateurApi.update(editingId, payload)
      } else {
        await formateurApi.create(payload)
      }
      setShowModal(false)
      await loadData()
      toast({
        title: 'Succès',
        description: editingId ? 'Formateur modifié avec succès' : 'Formateur ajouté avec succès',
      })
    } catch (e: any) {
      toast({
        title: 'Erreur',
        description: getShortError(e, "Erreur lors de l'enregistrement du formateur."),
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
    { key: 'email', label: 'Email', sortable: true },
    { key: 'tel', label: 'Téléphone' },
    {
      key: 'type',
      label: 'Type',
      render: (value: string) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          value === 'INTERNE' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'employeurNom',
      label: 'Employeur',
      render: (value: string, row: any) => value || row.nomemployeur || '-',
    },
  ]

  return (
    <div className="animate-fadeIn">
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      <DataTable
        title="Formateurs"
        columns={columns}
        data={formateurs}
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
            { name: 'employeurId', label: 'Nom Employeur (obligatoire pour EXTERNE)', type: 'select', options: employeurs.map((e) => ({ label: e.nomemployeur, value: String(e.id) })), required: false },
          ]}
          onSave={handleSaveModal}
          onClose={() => setShowModal(false)}
          initialData={editingId ? {
            firstName: formateurs.find((f) => Number(f.id) === editingId)?.prenom,
            lastName: formateurs.find((f) => Number(f.id) === editingId)?.nom,
            email: formateurs.find((f) => Number(f.id) === editingId)?.email,
            phone: String(formateurs.find((f) => Number(f.id) === editingId)?.tel || ''),
            type: formateurs.find((f) => Number(f.id) === editingId)?.type,
            employeurId: formateurs.find((f) => Number(f.id) === editingId)?.type === 'EXTERNE'
              ? String(formateurs.find((f) => Number(f.id) === editingId)?.employeurId || '')
              : '',
          } : undefined}
        />
      )}
    </div>
  )
}
