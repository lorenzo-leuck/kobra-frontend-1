import { describe, it, expect, beforeEach } from 'vitest'
import {
  createMockJWT,
  parseMockJWT,
  login,
  logout,
  getCurrentUser,
  getDemoAccounts,
} from '../utils/auth'
import { STORAGE_KEYS } from '../utils/constants'

describe('auth utilities', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('createMockJWT', () => {
    it('creates a valid JWT for user@demo.com', () => {
      const token = createMockJWT('user@demo.com')
      expect(token).toBeTruthy()
      expect(token.split('.')).toHaveLength(3)
    })

    it('creates a valid JWT for admin@demo.com', () => {
      const token = createMockJWT('admin@demo.com')
      expect(token).toBeTruthy()
      expect(token.split('.')).toHaveLength(3)
    })

    it('returns null for invalid email', () => {
      const token = createMockJWT('invalid@demo.com')
      expect(token).toBeNull()
    })
  })

  describe('parseMockJWT', () => {
    it('parses a valid JWT', () => {
      const token = createMockJWT('user@demo.com')
      const payload = parseMockJWT(token)
      
      expect(payload).toBeTruthy()
      expect(payload!.email).toBe('user@demo.com')
      expect(payload!.role).toBe('user')
      expect(payload!.name).toBe('Demo User')
    })

    it('returns null for null token', () => {
      expect(parseMockJWT(null!)).toBeNull()
    })

    it('returns null for invalid token', () => {
      expect(parseMockJWT('invalid')).toBeNull()
    })

    it('returns null for expired token', () => {
      const token = createMockJWT('user@demo.com')
      const [header, payload, signature] = token.split('.')
      const decoded = JSON.parse(atob(payload))
      decoded.exp = Date.now() - 1000
      const expiredPayload = btoa(JSON.stringify(decoded))
      const expiredToken = `${header}.${expiredPayload}.${signature}`
      
      expect(parseMockJWT(expiredToken)).toBeNull()
    })
  })

  describe('login', () => {
    it('logs in user and stores token', () => {
      const user = login('user@demo.com')
      
      expect(user).toBeTruthy()
      expect(user.email).toBe('user@demo.com')
      expect(user.role).toBe('user')
      
      const storedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
      expect(storedToken).toBeTruthy()
    })

    it('logs in admin and stores token', () => {
      const user = login('admin@demo.com')
      
      expect(user).toBeTruthy()
      expect(user.email).toBe('admin@demo.com')
      expect(user.role).toBe('admin')
    })

    it('throws error for invalid credentials', () => {
      expect(() => login('invalid@demo.com')).toThrow('Invalid credentials')
    })
  })

  describe('logout', () => {
    it('removes auth token from localStorage', () => {
      login('user@demo.com')
      expect(localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)).toBeTruthy()
      
      logout()
      expect(localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)).toBeNull()
    })
  })

  describe('getCurrentUser', () => {
    it('returns current user when logged in', () => {
      login('user@demo.com')
      const user = getCurrentUser()
      
      expect(user).toBeTruthy()
      expect(user!.email).toBe('user@demo.com')
    })

    it('returns null when not logged in', () => {
      expect(getCurrentUser()).toBeNull()
    })

    it('returns null when token is expired', () => {
      const token = createMockJWT('user@demo.com')
      const [header, payload, signature] = token.split('.')
      const decoded = JSON.parse(atob(payload))
      decoded.exp = Date.now() - 1000
      const expiredPayload = btoa(JSON.stringify(decoded))
      const expiredToken = `${header}.${expiredPayload}.${signature}`
      
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, expiredToken)
      expect(getCurrentUser()).toBeNull()
    })
  })

  describe('getDemoAccounts', () => {
    it('returns list of demo accounts', () => {
      const accounts = getDemoAccounts()
      
      expect(accounts).toHaveLength(2)
      expect(accounts[0].email).toBe('user@demo.com')
      expect(accounts[0].role).toBe('user')
      expect(accounts[1].email).toBe('admin@demo.com')
      expect(accounts[1].role).toBe('admin')
    })
  })
})
