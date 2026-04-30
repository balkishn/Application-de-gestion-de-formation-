'use client'

import { useEffect, useState } from 'react'
import DataTable from '@/components/admin/data-table'
import FormModal from '@/components/admin/form-modal'
import { utilisateurApi } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

export default function UtilisateurPage() {
  const { toast } = useToast()
  const [users, setUsers] = useState<any[]>([])
  const [roles, setRoles] = useState<any[]>([])
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const loadData = async () => {
    try {
      const [usersData, rolesData] = await Promise.all([
        utilisateurApi.getAll(),
        utilisateurApi.getRoles().catch(() => []),
      ])
      setUsers(usersData || [])
      setRoles(rolesData || [])
      setError('')
    } catch (e: any) {
      setError(e?.message || 'Erreur de chargement des utilisateurs')
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
      await utilisateurApi.remove(Number(row.id))
      await loadData()
      toast({
        title: 'Succès',
        description: 'L\'utilisateur a été supprimé avec succès',
      })
    } catch (e: any) {
      toast({
        title: 'Erreur de suppression',
        description: e?.message || 'Impossible de supprimer cet utilisateur car il est utilisé dans d\'autres enregistrements.',
        variant: 'destructive',
      })
    }
  }

  const handleSaveModal = async (data: any) => {
    try {
      if (editingId) {
        if (!data.login || !String(data.login).trim()) {
          setError('Le login est obligatoire lors de la modification d\'un utilisateur.')
          return
        }
        await utilisateurApi.update(editingId, { login: data.login, email: data.email })
      } else {
        await utilisateurApi.create({
          email: data.email,
          roleId: Number(data.roleId),
        })
      }
      setShowModal(false)
      await loadData()
    } catch (e: any) {
      setError(e?.message || 'Erreur lors de l\'enregistrement')
    }
  }

  const columns = [
    { key: 'email', label: 'Email', sortable: true },
    { key: 'login', label: 'Login', sortable: true },
    {
      key: 'roleName',
      label: 'Rôle',
      render: (value: string) => (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400">
          {value}
        </span>
      ),
    },
    {
      key: 'isActive',
      label: 'Statut',
      render: (value: boolean) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          value ? 'bg-green-500/20 text-green-400' :
          'bg-gray-500/20 text-gray-400'
        }`}>
          {value ? 'Actif' : 'Inactif'}
        </span>
      ),
    },
    {
      key: 'mustChangePassword',
      label: 'Premiere connexion',
      render: (value: boolean) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          value ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
        }`}>
          {value ? 'En attente' : 'Completee'}
        </span>
      ),
    },
  ]

  return (
    <div className="animate-fadeIn">
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      <DataTable
        title="Utilisateurs"
        columns={columns}
        data={users}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      {showModal && (
        <FormModal
          title={editingId ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
          fields={[
            { name: 'email', label: 'Email', type: 'email', required: true },
            ...(editingId ? [] : [
              { name: 'roleId', label: 'Rôle', type: 'select' as const, options: roles.map((r) => ({ label: r.nom, value: String(r.id) })), required: true },
            ]),
            ...(editingId ? [{ name: 'login', label: 'Login', type: 'text' as const, required: false }] : []),
          ]}
          onSave={handleSaveModal}
          onClose={() => setShowModal(false)}
          initialData={editingId ? {
            login: users.find((u) => Number(u.id) === editingId)?.login,
            email: users.find((u) => Number(u.id) === editingId)?.email,
          } : undefined}
        />
      )}
    </div>
  )
}
