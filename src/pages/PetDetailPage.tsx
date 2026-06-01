import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Search } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { PET_STATUSES } from '../utils/constants'
import type { AppState, AppAction } from '../types'

interface PetDetailPageProps {
  state: AppState
  dispatch: React.Dispatch<AppAction>
  onSchedule: (id: string) => void
}

export function PetDetailPage({ state, dispatch, onSchedule }: PetDetailPageProps) {
  const { petName } = useParams<{ petName: string }>()
  const pet = state.pets.find(
    (p) => p.name.toLowerCase() === (petName ?? '').toLowerCase()
  )

  if (!pet) {
    return (
      <motion.main
        key="pet-not-found"
        className="main"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="container">
          <div className="error-state">
            <Search size={48} className="error-state__icon" />
            <p className="error-state__message">Pet not found</p>
            <Link to="/">
              <Button variant="secondary">Back to Home</Button>
            </Link>
          </div>
        </div>
      </motion.main>
    )
  }

  const isAdmin = state.user?.role === 'admin'
  const isUser = !!state.user && !isAdmin

  const handleMoveStatus = (status: string) => {
    dispatch({ type: 'MOVE_PET', payload: { id: pet.id, status } })
    dispatch({
      type: 'ADD_TOAST',
      payload: { message: `${pet.name} moved to ${status}`, type: 'success' },
    })
  }

  return (
    <motion.main
      key="pet-detail"
      className="main"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="container">
        <Link to="/" className="pet-detail__back">
          <ArrowLeft size={18} />
          Back
        </Link>

        <div className="pet-detail">
          <div className="pet-detail__photo">
            <img
              src={pet.photoUrl || undefined}
              alt={`${pet.name} the ${pet.breed}`}
              className="pet-detail__image"
              onError={(e) => {
                const img = e.target as HTMLImageElement
                img.style.display = 'none'
              }}
            />
            {!pet.photoUrl && (
              <div className="pet-detail__image pet-detail__image--placeholder" />
            )}
          </div>

          <div className="pet-detail__info">
            <h2 className="pet-detail__name">{pet.name}</h2>
            <p className="pet-detail__meta">
              {pet.breed} &bull; {pet.estimatedAge} years
            </p>
            <span className={`pet-detail__status pet-detail__status--${pet.status.toLowerCase().replace(/\s+|&/g, '-').replace(/-+/g, '-')}`}>
              {pet.status}
            </span>

            <div className="pet-detail__actions">
              {isUser && pet.status === PET_STATUSES.NEW && (
                <Button
                  icon={Calendar}
                  onClick={() => onSchedule(pet.id)}
                >
                  Meet & Greet
                </Button>
              )}

              {isAdmin && (
                <div className="pet-detail__admin-actions">
                  <p className="pet-detail__actions-label">Move to:</p>
                  <div className="pet-detail__status-buttons">
                    {Object.values(PET_STATUSES).map((status) => (
                      <Button
                        key={status}
                        variant={pet.status === status ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => handleMoveStatus(status)}
                        disabled={pet.status === status}
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.main>
  )
}
