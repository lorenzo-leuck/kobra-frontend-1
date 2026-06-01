import { describe, it, expect, beforeEach } from 'vitest'
import { usePersistPets, usePersistFilters, usePersistTheme, loadFromStorage } from '../hooks/useLocalStorage'
import { STORAGE_KEYS } from '../utils/constants'
import { renderHook } from '@testing-library/react'
import { createMockPet } from './test-utils'

describe('useLocalStorage hooks', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('usePersistPets', () => {
    it('persists pets to localStorage', () => {
      const pets = [createMockPet({ id: '1' }), createMockPet({ id: '2' })]
      
      renderHook(() => usePersistPets(pets))
      
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.PETS)!)
      expect(stored).toEqual(pets)
    })

    it('updates localStorage when pets change', () => {
      const pets1 = [createMockPet({ id: '1' })]
      const { rerender } = renderHook(({ pets }) => usePersistPets(pets), {
        initialProps: { pets: pets1 }
      })
      
      const pets2 = [createMockPet({ id: '1' }), createMockPet({ id: '2' })]
      rerender({ pets: pets2 })
      
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.PETS)!)
      expect(stored).toEqual(pets2)
    })
  })

  describe('usePersistFilters', () => {
    it('persists filters to localStorage', () => {
      const filters = { search: 'Buddy', statusFilter: 'all', sort: 'age_asc' as const }
      
      renderHook(() => usePersistFilters(filters))
      
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.FILTERS)!)
      expect(stored).toEqual(filters)
    })
  })

  describe('usePersistTheme', () => {
    it('persists theme to localStorage', () => {
      const theme = { primaryColor: '#ff0000', backgroundColor: '#fff', textColor: '#000', fontScale: 1, cardRadius: 8, mode: 'dark' as const, density: 'comfortable' as const }
      
      renderHook(() => usePersistTheme(theme))
      
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.THEME)!)
      expect(stored).toEqual(theme)
    })
  })

  describe('loadFromStorage', () => {
    it('loads data from localStorage', () => {
      const pets = [createMockPet()]
      const filters = { search: 'test', statusFilter: 'all', sort: 'age_asc' as const }
      const theme = { primaryColor: '#000000' }
      
      localStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(pets))
      localStorage.setItem(STORAGE_KEYS.FILTERS, JSON.stringify(filters))
      localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(theme))
      
      const result = loadFromStorage()
      
      expect(result.pets).toEqual(pets)
      expect(result.filters).toEqual(filters)
      expect(result.theme).toEqual(theme)
    })

    it('returns null for missing data', () => {
      const result = loadFromStorage()
      
      expect(result.pets).toBeNull()
      expect(result.filters).toBeNull()
      expect(result.theme).toBeNull()
    })

    it('handles invalid JSON gracefully', () => {
      localStorage.setItem(STORAGE_KEYS.PETS, 'invalid-json')
      
      const result = loadFromStorage()
      
      expect(result.pets).toBeNull()
    })
  })
})
