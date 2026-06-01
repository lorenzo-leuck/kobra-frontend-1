import { describe, it, expect } from 'vitest'
import { reducer, initialState } from '../state/reducer'
import { createMockPet } from './test-utils'

describe('reducer', () => {
  describe('SET_PETS', () => {
    it('sets pets array', () => {
      const pets = [createMockPet({ id: '1' }), createMockPet({ id: '2' })]
      const state = reducer(initialState, { type: 'SET_PETS', payload: pets })
      
      expect(state.pets).toEqual(pets)
    })
  })

  describe('ADD_PET', () => {
    it('adds a new pet', () => {
      const pet = createMockPet({ id: '1' })
      const state = reducer(initialState, { type: 'ADD_PET', payload: pet })
      
      expect(state.pets).toHaveLength(1)
      expect(state.pets[0]).toEqual(pet)
    })

    it('adds pet to existing pets', () => {
      const pet1 = createMockPet({ id: '1' })
      const pet2 = createMockPet({ id: '2' })
      const stateWithPet = { ...initialState, pets: [pet1] }
      
      const state = reducer(stateWithPet, { type: 'ADD_PET', payload: pet2 })
      
      expect(state.pets).toHaveLength(2)
      expect(state.pets[1]).toEqual(pet2)
    })
  })

  describe('UPDATE_PET', () => {
    it('updates an existing pet', () => {
      const pet = createMockPet({ id: '1', name: 'Buddy' })
      const stateWithPet = { ...initialState, pets: [pet] }
      
      const updatedPet = { ...pet, name: 'Max' }
      const state = reducer(stateWithPet, { type: 'UPDATE_PET', payload: updatedPet })
      
      expect(state.pets[0].name).toBe('Max')
    })

    it('does not modify other pets', () => {
      const pet1 = createMockPet({ id: '1', name: 'Buddy' })
      const pet2 = createMockPet({ id: '2', name: 'Max' })
      const stateWithPets = { ...initialState, pets: [pet1, pet2] }
      
      const updatedPet = { ...pet1, name: 'Charlie' }
      const state = reducer(stateWithPets, { type: 'UPDATE_PET', payload: updatedPet })
      
      expect(state.pets[0].name).toBe('Charlie')
      expect(state.pets[1].name).toBe('Max')
    })
  })

  describe('DELETE_PET', () => {
    it('deletes a pet by id', () => {
      const pet1 = createMockPet({ id: '1' })
      const pet2 = createMockPet({ id: '2' })
      const stateWithPets = { ...initialState, pets: [pet1, pet2] }
      
      const state = reducer(stateWithPets, { type: 'DELETE_PET', payload: '1' })
      
      expect(state.pets).toHaveLength(1)
      expect(state.pets[0].id).toBe('2')
    })
  })

  describe('MOVE_PET', () => {
    it('moves pet to new status', () => {
      const pet = createMockPet({ id: '1', status: 'New' })
      const stateWithPet = { ...initialState, pets: [pet] }
      
      const state = reducer(stateWithPet, {
        type: 'MOVE_PET',
        payload: { id: '1', status: 'Adopted' }
      })
      
      expect(state.pets[0].status).toBe('Adopted')
    })
  })

  describe('SET_SEARCH', () => {
    it('updates search filter', () => {
      const state = reducer(initialState, { type: 'SET_SEARCH', payload: 'Buddy' })
      
      expect(state.filters.search).toBe('Buddy')
    })
  })

  describe('SET_STATUS_FILTER', () => {
    it('updates status filter', () => {
      const state = reducer(initialState, {
        type: 'SET_STATUS_FILTER',
        payload: 'Adopted'
      })
      
      expect(state.filters.statusFilter).toBe('Adopted')
    })
  })

  describe('SET_SORT', () => {
    it('updates sort option', () => {
      const state = reducer(initialState, { type: 'SET_SORT', payload: 'oldest' })
      
      expect(state.filters.sort).toBe('oldest')
    })
  })

  describe('SET_THEME', () => {
    it('updates theme properties', () => {
      const state = reducer(initialState, {
        type: 'SET_THEME',
        payload: { primaryColor: '#ff0000', mode: 'dark' }
      })
      
      expect(state.theme.primaryColor).toBe('#ff0000')
      expect(state.theme.mode).toBe('dark')
    })

    it('preserves other theme properties', () => {
      const state = reducer(initialState, {
        type: 'SET_THEME',
        payload: { primaryColor: '#ff0000' }
      })
      
      expect(state.theme.backgroundColor).toBe(initialState.theme.backgroundColor)
    })
  })

  describe('SET_USER', () => {
    it('sets user', () => {
      const user = { email: 'user@demo.com', role: 'user' as const, name: 'Demo User', iat: 0, exp: 0 }
      const state = reducer(initialState, { type: 'SET_USER', payload: user })
      
      expect(state.user).toEqual(user)
    })
  })

  describe('LOGOUT', () => {
    it('clears user', () => {
      const stateWithUser = {
        ...initialState,
        user: { email: 'user@demo.com', role: 'user' as const, name: 'Demo User', iat: 0, exp: 0 }
      }
      
      const state = reducer(stateWithUser, { type: 'LOGOUT' })
      
      expect(state.user).toBeNull()
    })
  })

  describe('ADD_TOAST', () => {
    it('adds a toast', () => {
      const state = reducer(initialState, {
        type: 'ADD_TOAST',
         payload: { message: 'Success!', type: 'success' as const }
      })
      
      expect(state.toasts).toHaveLength(1)
      expect(state.toasts[0].message).toBe('Success!')
      expect(state.toasts[0].type).toBe('success')
      expect(state.toasts[0].id).toBeTruthy()
    })
  })

  describe('REMOVE_TOAST', () => {
    it('removes a toast by id', () => {
      const stateWithToast = {
        ...initialState,
        toasts: [{ id: 1, message: 'Test', type: 'info' as const }]
      }
      
      const state = reducer(stateWithToast, { type: 'REMOVE_TOAST', payload: 1 })
      
      expect(state.toasts).toHaveLength(0)
    })
  })

  describe('unknown action', () => {
    it('returns current state', () => {
      const state = reducer(initialState, { type: 'UNKNOWN' } as any)
      
      expect(state).toEqual(initialState)
    })
  })
})
