import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '../components/ui/Input'

describe('Input', () => {
  it('renders with label', () => {
    render(<Input label="Name" />)
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
  })

  it('renders without label', () => {
    render(<Input placeholder="Enter name" />)
    expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument()
  })

  it('displays error message', () => {
    render(<Input label="Name" error="Name is required" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Name is required')
  })

  it('applies error styles when error is present', () => {
    render(<Input label="Name" error="Error" />)
    const input = screen.getByLabelText('Name')
    expect(input).toHaveClass('input-group__input--error')
  })

  it('sets aria-invalid when error is present', () => {
    render(<Input label="Name" error="Error" />)
    const input = screen.getByLabelText('Name')
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('links error message to input with aria-describedby', () => {
    render(<Input label="Name" error="Error" />)
    const input = screen.getByLabelText('Name')
    const errorId = input.getAttribute('aria-describedby')!
    expect(errorId).toBeTruthy()
    expect(document.getElementById(errorId)).toHaveTextContent('Error')
  })

  it('handles value changes', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    
    render(<Input label="Name" onChange={handleChange} />)
    const input = screen.getByLabelText('Name')
    
    await user.type(input, 'John')
    
    expect(handleChange).toHaveBeenCalled()
  })

  it('applies custom className', () => {
    render(<Input label="Name" className="custom" />)
    const container = screen.getByLabelText('Name').closest('.input-group')
    expect(container).toHaveClass('custom')
  })
})
