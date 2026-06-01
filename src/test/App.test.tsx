import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import App from '../App'
import { STORAGE_KEYS } from '../utils/constants'
import { createMockJWT } from '../utils/auth'

vi.mock('../utils/dogApi', () => ({
  fetchMultipleDogImages: vi.fn().mockResolvedValue(['https://example.com/dog1.jpg']),
  fetchBreeds: vi.fn().mockResolvedValue([
    { name: 'Labrador', path: 'labrador' },
    { name: 'Golden Retriever', path: 'retriever/golden' },
    { name: 'Beagle', path: 'beagle' },
    { name: 'Bulldog', path: 'bulldog' },
    { name: 'Poodle', path: 'poodle' },
  ]),
  fetchBreedImage: vi.fn().mockResolvedValue('https://example.com/dog1.jpg'),
}))

function renderApp() {
  return render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  )
}

describe('App integration', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows login modal when login button is clicked', async () => {
    const user = userEvent.setup()
    renderApp()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: 'Login' }))

    expect(screen.getByText('user@demo.com')).toBeInTheDocument()
    expect(screen.getByText('admin@demo.com')).toBeInTheDocument()
  })

  it('logs in and shows pet board', async () => {
    const user = userEvent.setup()

    renderApp()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: 'Login' }))
    await user.click(screen.getByText('user@demo.com'))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'New' })).toBeInTheDocument()
    })
  })

  it('logs out when logout button is clicked', async () => {
    const user = userEvent.setup()
    const token = createMockJWT('user@demo.com')
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)

    renderApp()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: 'Logout' }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
    })
  })

  it('shows add pet button for admin', async () => {
    const token = createMockJWT('admin@demo.com')
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
    
    renderApp()
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Add Pet' })).toBeInTheDocument()
    })
  })

  it('hides add pet button for user', async () => {
    const token = createMockJWT('user@demo.com')
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
    
    renderApp()
    
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Add Pet' })).not.toBeInTheDocument()
    })
  })

  it('opens add pet modal when add button is clicked', async () => {
    const user = userEvent.setup()
    const token = createMockJWT('admin@demo.com')
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
    
    renderApp()
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Add Pet' })).toBeInTheDocument()
    })
    
    await user.click(screen.getByRole('button', { name: 'Add Pet' }))
    
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Add New Pet')).toBeInTheDocument()
  })

  it('navigates to settings page', async () => {
    const user = userEvent.setup()
    const token = createMockJWT('admin@demo.com')
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
    
    renderApp()
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument()
    })
    
    await user.click(screen.getByRole('button', { name: 'Settings' }))
    
    expect(screen.getByText('Appearance')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Home' })).toBeInTheDocument()
  })

  it('filters pets by search', async () => {
    const user = userEvent.setup()
    const token = createMockJWT('user@demo.com')
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
    
    renderApp()
    
    await waitFor(() => {
      expect(screen.getByLabelText('Search')).toBeInTheDocument()
    })
    
    await user.type(screen.getByLabelText('Search'), 'Buddy')
    
    expect(screen.getByLabelText('Search')).toHaveValue('Buddy')
  })

  it('persists filters to localStorage', async () => {
    const user = userEvent.setup()
    const token = createMockJWT('user@demo.com')
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
    
    renderApp()
    
    await waitFor(() => {
      expect(screen.getByLabelText('Search')).toBeInTheDocument()
    })
    
    await user.type(screen.getByLabelText('Search'), 'Test')
    
    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.FILTERS)!)
      expect(stored.search).toBe('Test')
    })
  })

  it('shows not authorized on settings page for guest', async () => {
    render(
      <MemoryRouter initialEntries={['/settings']}>
        <App />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Not Authorized')).toBeInTheDocument()
    })
  })

  it('shows not authorized on settings page for regular user', async () => {
    const token = createMockJWT('user@demo.com')
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)

    render(
      <MemoryRouter initialEntries={['/settings']}>
        <App />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Not Authorized')).toBeInTheDocument()
    })
  })

  it('shows settings page fully for admin', async () => {
    const token = createMockJWT('admin@demo.com')
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)

    render(
      <MemoryRouter initialEntries={['/settings']}>
        <App />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Appearance')).toBeInTheDocument()
      expect(screen.getByText('Banners')).toBeInTheDocument()
    })
  })
})
