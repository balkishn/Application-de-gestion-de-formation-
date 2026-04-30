'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

type SelectOption = string | { label: string; value: string }

interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'number' | 'date' | 'select' | 'multiselect' | 'textarea'
  required?: boolean
  options?: SelectOption[]
  placeholder?: string
}

interface FormModalProps {
  title: string
  fields: FormField[]
  onSave: (data: any) => void
  onClose: () => void
  initialData?: Record<string, any>
}

export default function FormModal({ title, fields, onSave, onClose, initialData }: FormModalProps) {
  const [formData, setFormData] = useState<Record<string, any>>(initialData || {})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [multiSearch, setMultiSearch] = useState<Record<string, string>>({})

  const handleChange = (name: string, value: any) => {
    setFormData({ ...formData, [name]: value })
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    fields.forEach(field => {
      const value = formData[field.name]
      if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
        newErrors[field.name] = `${field.label} est requis`
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSave(formData)
  }

  const getOptionValue = (opt: SelectOption) => (typeof opt === 'string' ? opt : opt.value)
  const getOptionLabel = (opt: SelectOption) => (typeof opt === 'string' ? opt : opt.label)

  const toggleMultiValue = (fieldName: string, value: string) => {
    const currentValues: string[] = Array.isArray(formData[fieldName]) ? formData[fieldName] : []
    const exists = currentValues.includes(value)
    const nextValues = exists
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value]
    handleChange(fieldName, nextValues)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 p-4 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col animate-scaleIn my-4 sm:my-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col min-h-0">
          <div className="p-6 space-y-4 overflow-y-auto min-h-0">
            {fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {field.label}
                  {field.required && <span className="text-red-400 ml-1">*</span>}
                </label>
                {field.type === 'select' ? (
                  <select
                    value={formData[field.name] || ''}
                    onChange={(e) => {
                      handleChange(field.name, e.target.value)
                    }}
                    className="w-full px-4 py-2 bg-secondary/50 border border-border/50 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                  >
                    <option value="">Sélectionner...</option>
                    {field.options?.map((opt) => {
                      const value = getOptionValue(opt)
                      const label = getOptionLabel(opt)
                      return (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      )
                    })}
                  </select>
                ) : field.type === 'multiselect' ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={multiSearch[field.name] || ''}
                      onChange={(e) => setMultiSearch({ ...multiSearch, [field.name]: e.target.value })}
                      placeholder={`Rechercher ${field.label.toLowerCase()}...`}
                      className="w-full px-4 py-2 bg-secondary/50 border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                    />
                    <div className="max-h-48 overflow-y-auto rounded-lg border border-border/50 bg-secondary/30 p-2 space-y-1">
                      {(field.options || [])
                        .filter((opt) => {
                          const label = getOptionLabel(opt).toLowerCase()
                          const search = (multiSearch[field.name] || '').toLowerCase().trim()
                          return !search || label.includes(search)
                        })
                        .map((opt) => {
                          const value = getOptionValue(opt)
                          const label = getOptionLabel(opt)
                          const selected = Array.isArray(formData[field.name]) && formData[field.name].includes(value)

                          return (
                            <label
                              key={value}
                              className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-secondary/60 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={selected}
                                onChange={() => toggleMultiValue(field.name, value)}
                                className="h-4 w-4 accent-green-500"
                              />
                              <span className="text-sm text-foreground">{label}</span>
                            </label>
                          )
                        })}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {Array.isArray(formData[field.name]) ? formData[field.name].length : 0} sélectionné(s)
                    </p>
                  </div>
                ) : field.type === 'textarea' ? (
                  <textarea
                    value={formData[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    rows={4}
                    className="w-full px-4 py-2 bg-secondary/50 border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                  />
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-2 bg-secondary/50 border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                  />
                )}
                {errors[field.name] && (
                  <p className="text-xs text-red-400 mt-1">{errors[field.name]}</p>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 p-6 pt-4 border-t border-border/50 bg-card">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
            >
              Enregistrer
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
