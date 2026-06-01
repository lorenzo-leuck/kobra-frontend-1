import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Select } from '../components/ui/Select'

describe('Select', () => {
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
  ]

  it('renders with label', () => {
    render(<Select label="Choose" options={options} />)
    expect(screen.getByLabelText('Choose')).toBeInTheDocument()
  })

  it('renders all options', () => {
    render(<Select label="Choose" options={options} />)
    expect(screen.getByRole('option', { name: 'Option 1' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Option 2' })).toBeInTheDocument()
  })

  it('displays error message', () => {
    render(<Select label="Choose" options={options} error="Selection required" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Selection required')
  })

  it('applies error styles when error is present', () => {
    render(<Select label="Choose" options={options} error="Error" />)
    const select = screen.getByLabelText('Choose')
    expect(select).toHaveClass('input-group__input--error')
  })

  it('handles selection changes', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    
    render(<Select label="Choose" options={options} onChange={handleChange} />)
    const select = screen.getByLabelText('Choose')
    
    await user.selectOptions(select, 'option2')
    
    expect(handleChange).toHaveBeenCalled()
  })

  it('sets selected value', () => {
    render(<Select label="Choose" options={options} value="option2" onChange={() => {}} />)
    const select = screen.getByLabelText('Choose') as HTMLSelectElement
    expect(select.value).toBe('option2')
  })
})
