import type { Pet, User, AppState } from '../types'
import { reducer, initialState } from '../state/reducer'

export function createMockPet(overrides: Partial<Pet> = {}): Pet {
  return {
    id: '1',
    name: 'Buddy',
    breed: 'Golden Retriever',
    breedPath: 'retriever/golden',
    estimatedAge: 3,
    status: 'New',
    photoUrl: 'https://example.com/dog.jpg',
    createdAt: new Date().toISOString(),
    ...overrides,
  }
}

export function createMockUser(overrides: Partial<User> = {}): User {
  return {
    email: 'user@demo.com',
    role: 'user',
    name: 'Demo User',
    iat: Date.now(),
    exp: Date.now() + 86400000,
    ...overrides,
  }
}

export { render, screen, waitFor, within } from '@testing-library/react'
export { MemoryRouter } from 'react-router-dom'
