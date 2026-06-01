import { useState, useRef } from 'react'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import { PET_STATUSES } from '../../utils/constants'
import type { Pet } from '../../types'

interface PetFormProps {
  pet?: Pet
  onSubmit: (data: Partial<Pet>) => void
  onCancel: () => void
}

interface FormData {
  name: string
  breed: string
  estimatedAge: string
  status: string
}

export function PetForm({ pet, onSubmit, onCancel }: PetFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: pet?.name || '',
    breed: pet?.breed || '',
    estimatedAge: pet?.estimatedAge?.toString() || '',
    status: pet?.status || PET_STATUSES.NEW,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const formRef = useRef<HTMLFormElement>(null)

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.breed.trim()) newErrors.breed = 'Breed is required'
    if (!formData.estimatedAge || Number(formData.estimatedAge) < 0) {
      newErrors.estimatedAge = 'Valid age is required'
    }
    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0]
      const el = formRef.current?.querySelector<HTMLInputElement | HTMLSelectElement>(
        `[name="${firstErrorField}"]`,
      )
      el?.focus()
      return false
    }
    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit({
        ...formData,
        estimatedAge: Number(formData.estimatedAge),
      })
    }
  }

  const handleChange =
    (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData({ ...formData, [field]: e.target.value })
      if (errors[field]) {
        const next = { ...errors }
        delete next[field]
        setErrors(next)
      }
    }

  return (
    <form ref={formRef} className="form" onSubmit={handleSubmit} noValidate>
      <Input
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange('name')}
        error={errors.name}
        required
      />
      <Input
        label="Breed"
        name="breed"
        value={formData.breed}
        onChange={handleChange('breed')}
        error={errors.breed}
        required
      />
      <Input
        label="Estimated Age (years)"
        name="estimatedAge"
        type="number"
        min="0"
        step="0.5"
        value={formData.estimatedAge}
        onChange={handleChange('estimatedAge')}
        error={errors.estimatedAge}
        required
      />
      <Select
        label="Status"
        name="status"
        value={formData.status}
        onChange={handleChange('status')}
        options={Object.values(PET_STATUSES).map((status) => ({
          value: status,
          label: status,
        }))}
      />
      <div className="form__actions">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{pet ? 'Update' : 'Add'} Pet</Button>
      </div>
    </form>
  )
}
