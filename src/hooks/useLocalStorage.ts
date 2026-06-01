import { useEffect } from 'react'
import type { Pet, Filters, Theme, Banner } from '../types'
import { STORAGE_KEYS } from '../utils/constants'

export function loadFromStorage(): { pets: Pet[] | null; filters: Filters | null; theme: Theme | null; banners: Banner[] | null } {
  try {
    const pets = localStorage.getItem(STORAGE_KEYS.PETS)
    const filters = localStorage.getItem(STORAGE_KEYS.FILTERS)
    const theme = localStorage.getItem(STORAGE_KEYS.THEME)
    const banners = localStorage.getItem(STORAGE_KEYS.BANNERS)
    return {
      pets: pets ? JSON.parse(pets) : null,
      filters: filters ? JSON.parse(filters) : null,
      theme: theme ? JSON.parse(theme) : null,
      banners: banners ? JSON.parse(banners) : null,
    }
  } catch {
    return { pets: null, filters: null, theme: null, banners: null }
  }
}

export function usePersistPets(pets: Pet[]): void {
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(pets))
  }, [pets])
}

export function usePersistFilters(filters: Filters): void {
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FILTERS, JSON.stringify(filters))
  }, [filters])
}

export function usePersistTheme(theme: Theme): void {
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(theme))
  }, [theme])
}

export function usePersistBanners(banners: Banner[]): void {
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(banners))
  }, [banners])
}
