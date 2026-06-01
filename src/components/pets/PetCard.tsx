import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pencil, Trash2, Calendar } from 'lucide-react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { PetForm } from './PetForm'
import { PET_STATUSES } from '../../utils/constants'
import type { Pet, User } from '../../types'

interface PetCardProps {
  pet: Pet
  user: User | null
  onEdit: (pet: Pet) => void
  onDelete: (id: string) => void
  onSchedule: (id: string) => void
}

export function PetCard({ pet, user, onEdit, onDelete, onSchedule }: PetCardProps) {
  const [showEditModal, setShowEditModal] = useState(false)
  const navigate = useNavigate()
  const isAdmin = user?.role === 'admin'

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData(
      'text/plain',
      JSON.stringify({
        petId: pet.id,
        sourceStatus: pet.status,
      }),
    )
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('.card__actions') || target.closest('button')) return
    navigate(`/adopt/${pet.name}`)
  }

  const handleCardKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      navigate(`/adopt/${pet.name}`)
    }
  }

  return (
    <>
      <Card draggable={isAdmin} onDragStart={handleDragStart} onClick={handleCardClick} onKeyDown={handleCardKeyDown} tabIndex={0} role="button">
        <img
          src={pet.photoUrl}
          alt={`${pet.name} the ${pet.breed}`}
          className="card__image"
          loading="lazy"
        />
        <div className="card__content">
          <div className="card__body">
            <h3 className="card__title">{pet.name}</h3>
            <div className="card__meta">
              {pet.breed} &bull; {pet.estimatedAge} years
            </div>
          </div>
          <div className="card__actions">
            {!isAdmin && pet.status === PET_STATUSES.NEW && (
              <Button
                size="sm"
                variant="secondary"
                icon={Calendar}
                aria-label="Meet & Greet"
                onClick={() => onSchedule(pet.id)}
              />
            )}
            {isAdmin && (
              <>
                <Button
                  size="sm"
                  variant="secondary"
                  icon={Pencil}
                  aria-label="Edit"
                  onClick={() => setShowEditModal(true)}
                />
                <Button
                  size="sm"
                  variant="secondary"
                  icon={Trash2}
                  aria-label="Delete"
                  onClick={() => onDelete(pet.id)}
                />
              </>
            )}
          </div>
        </div>
      </Card>

      <Modal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={`Edit ${pet.name}`}
      >
        <PetForm
          pet={pet}
          onSubmit={(data) => {
            onEdit({ ...pet, ...data })
            setShowEditModal(false)
          }}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>
    </>
  )
}
