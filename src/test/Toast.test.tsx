import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Toast } from '../components/ui/Toast'

describe('Toast', () => {
  it('renders toasts', () => {
    const toasts = [
      { id: 1, message: 'Success!', type: 'success' as const },
      { id: 2, message: 'Error!', type: 'error' as const },
    ]
    render(<Toast toasts={toasts} onRemove={() => {}} />)
    expect(screen.getByText('Success!')).toBeInTheDocument()
    expect(screen.getByText('Error!')).toBeInTheDocument()
  })

  it('applies correct type class', () => {
    const toasts = [{ id: 1, message: 'Test', type: 'success' as const }]
    render(<Toast toasts={toasts} onRemove={() => {}} />)
    const toast = screen.getByText('Test').closest('.toast')
    expect(toast).toHaveClass('toast--success')
  })

  it('calls onRemove when close button is clicked', async () => {
    const user = userEvent.setup()
    const handleRemove = vi.fn()
    const toasts = [{ id: 1, message: 'Test', type: 'info' as const }]
    render(<Toast toasts={toasts} onRemove={handleRemove} />)
    await user.click(screen.getByLabelText('Dismiss'))
    expect(handleRemove).toHaveBeenCalledWith(1)
  })

  it('auto-removes toast after timeout', async () => {
    vi.useFakeTimers()
    const handleRemove = vi.fn()
    const toasts = [{ id: 1, message: 'Test', type: 'info' as const }]
    render(<Toast toasts={toasts} onRemove={handleRemove} />)
    
    await act(async () => {
      vi.advanceTimersByTime(4000)
    })
    
    expect(handleRemove).toHaveBeenCalledWith(1)
    vi.useRealTimers()
  })
})
