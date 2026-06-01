import { useReducer, useEffect, useState, useRef } from 'react'
import { Routes, Route } from 'react-router-dom'
import { reducer, initialState } from './state/reducer'
import { loadFromStorage, usePersistPets, usePersistFilters, usePersistTheme, usePersistBanners } from './hooks/useLocalStorage'
import { getCurrentUser, logout } from './utils/auth'
import { fetchMultipleDogImages, fetchBreeds, fetchBreedImage } from './utils/dogApi'
import { PET_STATUSES } from './utils/constants'
import { ThemeProvider } from './context/ThemeContext'
import { LoginForm } from './components/auth/LoginForm'
import { Header } from './components/layout/Header'
import { PetForm } from './components/pets/PetForm'
import { BoardPage } from './pages/BoardPage'
import { SettingsPage } from './pages/SettingsPage'
import { PetDetailPage } from './pages/PetDetailPage'
import { Modal } from './components/ui/Modal'
import { Toast } from './components/ui/Toast'
import type { Pet, User } from './types'
import './styles/global.css'

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    const stored = loadFromStorage()
    const user = getCurrentUser()
    return {
      ...init,
      pets: stored.pets || generateSamplePets(),
      filters: stored.filters || init.filters,
      theme: stored.theme || init.theme,
      banners: stored.banners || [],
      user,
    }
  })

  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const initializedRef = useRef(false)

  usePersistPets(state.pets)
  usePersistFilters(state.filters)
  usePersistTheme(state.theme)
  usePersistBanners(state.banners)

  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    const init = async () => {
      const breeds = await fetchBreeds()

      const updatedPets = state.pets.map((pet) => {
        if (pet.breed && pet.breedPath) return pet
        const b = breeds ? breeds[Math.floor(Math.random() * breeds.length)] : null
        return b ? { ...pet, breed: b.name, breedPath: b.path } : pet
      })

      try {
        for (const pet of updatedPets) {
          if (pet.photoUrl) continue
          if (pet.breedPath) {
            const img = await fetchBreedImage(pet.breedPath)
            pet.photoUrl = img || ''
          }
        }

        const missing = updatedPets.filter((p) => !p.photoUrl)
        if (missing.length > 0) {
          const images = await fetchMultipleDogImages(missing.length)
          for (let i = 0; i < missing.length; i++) {
            missing[i].photoUrl = images[i] || ''
          }
        }

        dispatch({ type: 'SET_PETS', payload: updatedPets })
      } catch {
        dispatch({ type: 'ADD_TOAST', payload: { message: 'Failed to load some images', type: 'warning' } })
        dispatch({ type: 'SET_PETS', payload: updatedPets })
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [state.user, state.pets])

  const handleLogin = (user: User) => {
    dispatch({ type: 'SET_USER', payload: user })
    setShowLogin(false)
  }

  const handleLogout = () => {
    logout()
    dispatch({ type: 'LOGOUT' })
  }

  const handleAddPet = async (data: Partial<Pet>) => {
    try {
      const images = await fetchMultipleDogImages(1)
      const newPet: Pet = {
        id: String(Date.now()),
        name: data.name || '',
        breed: data.breed || '',
        breedPath: '',
        estimatedAge: Number(data.estimatedAge) || 0,
        status: data.status || PET_STATUSES.NEW,
        photoUrl: images[0],
        createdAt: new Date().toISOString(),
      }
      dispatch({ type: 'ADD_PET', payload: newPet })
      dispatch({
        type: 'ADD_TOAST',
        payload: { message: `${newPet.name} added successfully!`, type: 'success' },
      })
      setShowAddModal(false)
    } catch {
      dispatch({
        type: 'ADD_TOAST',
        payload: { message: 'Failed to add pet', type: 'error' },
      })
    }
  }

  const handleEditPet = (pet: Pet) => {
    dispatch({ type: 'UPDATE_PET', payload: pet })
    dispatch({
      type: 'ADD_TOAST',
      payload: { message: `${pet.name} updated!`, type: 'success' },
    })
  }

  const handleDeletePet = (id: string) => {
    dispatch({ type: 'DELETE_PET', payload: id })
    dispatch({
      type: 'ADD_TOAST',
      payload: { message: 'Pet removed', type: 'info' },
    })
  }

  const handleSchedule = (id: string) => {
    if (!state.user) {
      setShowLogin(true)
      return
    }
    dispatch({ type: 'MOVE_PET', payload: { id, status: PET_STATUSES.MEET_AND_GREET } })
    dispatch({
      type: 'ADD_TOAST',
      payload: { message: 'Meet & greet scheduled!', type: 'success' },
    })
  }

  return (
    <ThemeProvider theme={state.theme} dispatch={dispatch}>
    <div className="app">
      <Header
        user={state.user}
        onLogout={handleLogout}
        onAddPet={() => setShowAddModal(true)}
        onLogin={() => setShowLogin(true)}
      />

      <Routes>
        <Route path="/" element={
          <BoardPage
            state={state}
            dispatch={dispatch}
            loading={loading}
            onEdit={handleEditPet}
            onDelete={handleDeletePet}
            onSchedule={handleSchedule}
          />
        } />
        <Route path="/settings" element={
          <SettingsPage state={state} dispatch={dispatch} />
        } />
        <Route path="/adopt/:petName" element={
          <PetDetailPage
            state={state}
            dispatch={dispatch}
            onSchedule={handleSchedule}
          />
        } />
        <Route path="*" element={
          <main className="main">
            <div className="container">
              <div className="error-state">
                <p className="error-state__message">Page not found</p>
              </div>
            </div>
          </main>
        } />
      </Routes>

      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Pet">
        <PetForm onSubmit={handleAddPet} onCancel={() => setShowAddModal(false)} />
      </Modal>

      <Modal open={showLogin} onClose={() => setShowLogin(false)} title="Login">
        <LoginForm onLogin={handleLogin} />
      </Modal>

      <Toast
        toasts={state.toasts}
        onRemove={(id) => dispatch({ type: 'REMOVE_TOAST', payload: id })}
      />
    </div>
    </ThemeProvider>
  )
}

function generateSamplePets(): Pet[] {
  const names = [
    'Rex', 'Thor', 'Bob', 'Mel', 'Bud', 'Luke', 'Zeus', 'Lucky', 'Nick', 'Max',
    'Nina', 'Lola', 'Luna', 'Meg', 'Belinha', 'Pipoca', 'Amora', 'Maya', 'Kira', 'Sophia',
  ]

  return names.map((name, idx) => ({
    id: String(Date.now() + idx),
    name,
    breed: '',
    breedPath: '',
    estimatedAge: Math.floor(Math.random() * 10) + 1,
    status: PET_STATUSES.NEW,
    photoUrl: '',
    createdAt: new Date(Date.now() - idx * 86400000).toISOString(),
  }))
}
