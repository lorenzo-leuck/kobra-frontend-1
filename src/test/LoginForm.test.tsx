import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '../components/auth/LoginForm'

describe('LoginForm', () => {
  it('renders demo accounts', () => {
    render(<LoginForm onLogin={() => {}} />)
    
    expect(screen.getByText('user@demo.com')).toBeInTheDocument()
    expect(screen.getByText('admin@demo.com')).toBeInTheDocument()
  })

  it('calls onLogin when account is clicked', async () => {
    const user = userEvent.setup()
    const handleLogin = vi.fn()
    
    render(<LoginForm onLogin={handleLogin} />)
    
    await user.click(screen.getByText('user@demo.com'))
    
    expect(handleLogin).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'user@demo.com',
        role: 'user',
      })
    )
  })

  it('displays error message on login failure', async () => {
    const user = userEvent.setup()
    const handleLogin = vi.fn().mockImplementation(() => {
      throw new Error('Login failed')
    })
    
    render(<LoginForm onLogin={handleLogin} />)
    
    await user.click(screen.getByText('user@demo.com'))
    
    expect(screen.getByRole('alert')).toHaveTextContent('Login failed')
  })
})
