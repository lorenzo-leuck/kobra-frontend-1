import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, ArrowUp, ArrowDown } from 'lucide-react'
import { PET_STATUSES, SORT_OPTIONS } from '../utils/constants'
import { BannerCarousel } from '../components/layout/BannerCarousel'
import { PetBoard } from '../components/pets/PetBoard'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import type { AppAction, AppState, Pet } from '../types'

interface BoardPageProps {
  state: AppState
  dispatch: React.Dispatch<AppAction>
  loading: boolean
  onEdit: (pet: Pet) => void
  onDelete: (id: string) => void
  onSchedule: (id: string) => void
}

export function BoardPage({
  state,
  dispatch,
  loading,
  onEdit,
  onDelete,
  onSchedule,
}: BoardPageProps) {
  const [userStatus, setUserStatus] = useState<string>(PET_STATUSES.NEW)

  const filteredPets = state.pets
    .filter((pet) => {
      const matchesSearch =
        pet.name.toLowerCase().includes(state.filters.search.toLowerCase()) ||
        pet.breed.toLowerCase().includes(state.filters.search.toLowerCase())
      const matchesStatus =
        state.filters.statusFilter === 'all' || pet.status === state.filters.statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      return state.filters.sort === SORT_OPTIONS.AGE_DESC
        ? b.estimatedAge - a.estimatedAge
        : a.estimatedAge - b.estimatedAge
    })

  return (
    <motion.main
      key="board"
      className="main main--board"
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.2 }}
    >
      <div className="container">
        {state.user?.role === 'admin' ? (
          <PetBoard
            pets={filteredPets}
            user={state.user}
            loading={loading}
            dispatch={dispatch}
            onEdit={onEdit}
            onDelete={onDelete}
            onSchedule={onSchedule}
            filters={
              <div className="admin-filters">
                <Input
                  icon={Search}
                  aria-label="Search"
                  placeholder="Search by name or breed..."
                  value={state.filters.search}
                  onChange={(e) =>
                    dispatch({ type: 'SET_SEARCH', payload: e.target.value })
                  }
                />
                <Button
                  size="sm"
                  variant="secondary"
                  icon={
                    state.filters.sort === SORT_OPTIONS.AGE_ASC ? ArrowUp : ArrowDown
                  }
                  className="btn--icon"
                  aria-label="Sort by age"
                  onClick={() =>
                    dispatch({
                      type: 'SET_SORT',
                      payload:
                        state.filters.sort === SORT_OPTIONS.AGE_ASC
                          ? SORT_OPTIONS.AGE_DESC
                          : SORT_OPTIONS.AGE_ASC,
                    })
                  }
                />
              </div>
            }
          />
        ) : state.user ? (
          <PetBoard
            pets={filteredPets}
            user={state.user}
            loading={loading}
            singleStatus={userStatus}
            dispatch={dispatch}
            onEdit={onEdit}
            onDelete={onDelete}
            onSchedule={onSchedule}
            banner={<BannerCarousel banners={state.banners} />}
            filters={
              <div className="user-filters">
                <div className="user-filters__row">
                  <Input
                    icon={Search}
                    aria-label="Search"
                    placeholder="Search by name or breed..."
                    value={state.filters.search}
                    onChange={(e) =>
                      dispatch({ type: 'SET_SEARCH', payload: e.target.value })
                    }
                  />
                  <Button
                    size="sm"
                    variant="secondary"
                    icon={
                      state.filters.sort === SORT_OPTIONS.AGE_ASC
                        ? ArrowUp
                        : ArrowDown
                    }
                    aria-label="Sort by age"
                    onClick={() =>
                      dispatch({
                        type: 'SET_SORT',
                        payload:
                          state.filters.sort === SORT_OPTIONS.AGE_ASC
                            ? SORT_OPTIONS.AGE_DESC
                            : SORT_OPTIONS.AGE_ASC,
                      })
                    }
                  />
                </div>
                <div className="user-filters__bar">
                  <div className="segmented-control">
                    {Object.values(PET_STATUSES).map((status) => (
                      <button
                        key={status}
                        className={`segmented-control__item ${userStatus === status ? 'segmented-control__item--active' : ''}`}
                        onClick={() => setUserStatus(status)}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            }
          />
        ) : (
          <PetBoard
            pets={state.pets.filter((p) => p.status === PET_STATUSES.NEW)}
            user={null}
            loading={loading}
            singleStatus={PET_STATUSES.NEW}
            dispatch={dispatch}
            onEdit={onEdit}
            onDelete={onDelete}
            onSchedule={onSchedule}
            banner={<BannerCarousel banners={state.banners} />}
          />
        )}
      </div>
    </motion.main>
  )
}
