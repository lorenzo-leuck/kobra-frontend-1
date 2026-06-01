import type { User } from '../types'
import { STORAGE_KEYS } from './constants'

export function getDemoAccounts(): User[] {
  return [
    { email: 'user@demo.com', role: 'user', name: 'Demo User', iat: 0, exp: 0 },
    { email: 'admin@demo.com', role: 'admin', name: 'Admin User', iat: 0, exp: 0 },
  ]
}

export function createMockJWT(email: string): string | null {
  const account = getDemoAccounts().find((a) => a.email === email)
  if (!account) return null

  const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }))
  const payload = btoa(
    JSON.stringify({
      email: account.email,
      role: account.role,
      name: account.name,
      iat: Date.now(),
      exp: Date.now() + 24 * 60 * 60 * 1000,
    }),
  )
  const signature = btoa('mock-signature')
  return `${header}.${payload}.${signature}`
}

export function parseMockJWT(token: string): User | null {
  try {
    const [, payload] = token.split('.')
    const decoded = JSON.parse(atob(payload!))
    if (Date.now() >= decoded.exp) return null
    return decoded
  } catch {
    return null
  }
}

export function login(email: string): User {
  const token = createMockJWT(email)
  if (!token) throw new Error('Invalid credentials')
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
  const user = parseMockJWT(token)
  if (!user) throw new Error('Invalid credentials')
  return user
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
}

export function getCurrentUser(): User | null {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
  if (!token) return null
  return parseMockJWT(token)
}
