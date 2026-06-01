import type { Breed } from '../types'
import { STORAGE_KEYS } from './constants'

const API_BASE = 'https://dog.ceo/api'

function getCachedImages(): string[] {
  try {
    const cached = localStorage.getItem(STORAGE_KEYS.DOG_IMAGES_CACHE)
    return cached ? JSON.parse(cached) : []
  } catch {
    return []
  }
}

function setCachedImages(images: string[]): void {
  localStorage.setItem(STORAGE_KEYS.DOG_IMAGES_CACHE, JSON.stringify(images))
}

export async function fetchRandomDogImage(): Promise<string> {
  try {
    const response = await fetch(`${API_BASE}/breeds/image/random`)
    if (!response.ok) throw new Error('Failed to fetch dog image')
    const data = await response.json()
    if (data.status !== 'success') throw new Error('API error')

    const cached = getCachedImages()
    const updated = [data.message, ...cached].slice(0, 50)
    setCachedImages(updated)

    return data.message
  } catch {
    const cached = getCachedImages()
    if (cached.length > 0) {
      return cached[Math.floor(Math.random() * cached.length)]
    }
    throw new Error('No cached images available')
  }
}

export async function fetchMultipleDogImages(count: number = 10): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE}/breeds/image/random/${count}`)
    if (!response.ok) throw new Error('Failed to fetch dog images')
    const data = await response.json()
    if (data.status !== 'success') throw new Error('API error')

    const cached = getCachedImages()
    const updated = [...data.message, ...cached].slice(0, 100)
    setCachedImages(updated)

    return data.message
  } catch {
    const cached = getCachedImages()
    if (cached.length >= count) {
      return cached.slice(0, count)
    }
    throw new Error('Not enough cached images')
  }
}

export function getCachedImagePool(): string[] {
  return getCachedImages()
}

export async function fetchBreeds(): Promise<Breed[] | null> {
  try {
    const cached = localStorage.getItem('pet_shelter_breeds')
    if (cached) return JSON.parse(cached)

    const response = await fetch(`${API_BASE}/breeds/list/all`)
    if (!response.ok) throw new Error('Failed to fetch breeds')
    const data = await response.json()
    if (data.status !== 'success') throw new Error('API error')

    const breeds: Breed[] = Object.entries(data.message as Record<string, string[]>).flatMap(([breed, subs]) => {
      if (subs && subs.length > 0) {
        return subs.map((sub: string) => ({
          name: `${breed.charAt(0).toUpperCase() + breed.slice(1)} ${sub.charAt(0).toUpperCase() + sub.slice(1)}`,
          path: `${breed}/${sub}`,
        }))
      }
      return [{ name: breed.charAt(0).toUpperCase() + breed.slice(1), path: breed }]
    })

    localStorage.setItem('pet_shelter_breeds', JSON.stringify(breeds))
    return breeds
  } catch {
    return null
  }
}

export async function fetchBreedImage(breedPath: string): Promise<string | null> {
  try {
    const response = await fetch(`${API_BASE}/breed/${breedPath}/images/random`)
    if (!response.ok) throw new Error('Failed to fetch breed image')
    const data = await response.json()
    if (data.status !== 'success') throw new Error('API error')
    return data.message
  } catch {
    return null
  }
}
