import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PackageOpen } from 'lucide-react'
import { PetCard } from './PetCard'
import { Skeleton } from '../ui/Card'
import { PET_STATUSES } from '../../utils/constants'
import type { Pet, User, AppAction } from '../../types'

const CARD_ENTER_DURATION_S = 0.6
const CARD_EXIT_DURATION_S = 0.4
const CARD_STAGGER_DELAY_S = 0.08

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * CARD_STAGGER_DELAY_S, duration: CARD_ENTER_DURATION_S, ease: 'easeOut' },
  }),
  exit: { opacity: 0, scale: 0.95, transition: { duration: CARD_EXIT_DURATION_S, ease: 'easeIn' } },
}

interface PetBoardProps {
  pets: Pet[]
  user: User | null
  loading: boolean
  dispatch: React.Dispatch<AppAction>
  onEdit: (pet: Pet) => void
  onDelete: (id: string) => void
  onSchedule: (id: string) => void
  singleStatus?: string
  banner?: React.ReactNode
  filters?: React.ReactNode
}

export function PetBoard({
  pets,
  user,
  loading,
  dispatch,
  onEdit,
  onDelete,
  onSchedule,
  singleStatus,
  banner,
  filters,
}: PetBoardProps) {
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)
  const isAdmin = user?.role === 'admin'

  const handleDragOver = (e: React.DragEvent, status: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverColumn(status)
  }

  const handleDragLeave = () => {
    setDragOverColumn(null)
  }

  const handleDrop = (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault()
    setDragOverColumn(null)

    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'))
      if (data.petId && data.sourceStatus !== targetStatus) {
        dispatch({
          type: 'MOVE_PET',
          payload: { id: data.petId, status: targetStatus },
        })
      }
    } catch {
      console.error('Drop error')
    }
  }

  const petsByStatus: Record<string, Pet[]> = Object.values(PET_STATUSES).reduce(
    (acc, status) => {
      acc[status] = pets.filter((pet) => pet.status === status)
      return acc
    },
    {} as Record<string, Pet[]>,
  )

  if (loading) {
    if (singleStatus) {
      return (
        <div className="grid grid--cards">
          {banner}
          {filters && <div style={{ gridColumn: '1 / -1' }}>{filters}</div>}
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      )
    }
    return (
      <div className="grid grid--board">
        {banner}
        {filters && <div style={{ gridColumn: '1 / -1' }}>{filters}</div>}
        {Object.values(PET_STATUSES).map((status) => (
          <div key={status} className="column">
            <h2 className="column__header">{status}</h2>
            <div className="column__content">
              <Skeleton />
              <Skeleton />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (singleStatus) {
    const statusPets = petsByStatus[singleStatus] || []
    return (
      <div className="grid grid--cards">
        {banner}
        {filters && <div style={{ gridColumn: '1 / -1' }}>{filters}</div>}
        <AnimatePresence mode="popLayout">
          {statusPets.map((pet, i) => (
            <motion.div
              key={pet.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              custom={i}
              layout
            >
              <PetCard
                pet={pet}
                user={user}
                onEdit={onEdit}
                onDelete={onDelete}
                onSchedule={onSchedule}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        {statusPets.length === 0 && (
          <div className="error-state" style={{ gridColumn: '1 / -1' }}>
            <PackageOpen size={48} className="error-state__icon" />
            <p className="error-state__message">No pets in {singleStatus}</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid--board">
      {banner}
      {filters && <div style={{ gridColumn: '1 / -1' }}>{filters}</div>}
      {Object.values(PET_STATUSES).map((status) => (
        <div
          key={status}
          className={`column ${dragOverColumn === status ? 'column--drag-over' : ''}`}
          onDragOver={isAdmin ? (e) => handleDragOver(e, status) : undefined}
          onDragLeave={isAdmin ? handleDragLeave : undefined}
          onDrop={isAdmin ? (e) => handleDrop(e, status) : undefined}
        >
          <h2 className="column__header">{status}</h2>
          <div className="column__content">
            <AnimatePresence mode="popLayout">
              {petsByStatus[status].map((pet, i) => (
                <motion.div
                  key={pet.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  custom={i}
                  layout
                >
                  <PetCard
                    pet={pet}
                    user={user}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onSchedule={onSchedule}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
            {petsByStatus[status].length === 0 && (
              <div className="column__empty">
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
