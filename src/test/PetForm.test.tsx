import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PetForm } from '../components/pets/PetForm'
import { createMockPet } from './test-utils'

describe('PetForm', () => {
  it('renders form fields', () => {
    render(<PetForm onSubmit={() => {}} onCancel={() => {}} />)
    
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Breed')).toBeInTheDocument()
    expect(screen.getByLabelText('Estimated Age (years)')).toBeInTheDocument()
    expect(screen.getByLabelText('Status')).toBeInTheDocument()
  })

  it('populates fields when editing', () => {
    const pet = createMockPet({ name: 'Buddy', breed: 'Labrador' })
    
    render(<PetForm pet={pet} onSubmit={() => {}} onCancel={() => {}} />)
    
    expect(screen.getByLabelText('Name')).toHaveValue('Buddy')
    expect(screen.getByLabelText('Breed')).toHaveValue('Labrador')
  })

  it('shows validation errors for empty required fields', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn()
    
    render(<PetForm onSubmit={handleSubmit} onCancel={() => {}} />)
    
    await user.click(screen.getByRole('button', { name: 'Add Pet' }))
    
    expect(screen.getAllByRole('alert').length).toBeGreaterThan(0)
    expect(handleSubmit).not.toHaveBeenCalled()
  })

  it('calls onSubmit with form data when valid', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn()
    
    render(<PetForm onSubmit={handleSubmit} onCancel={() => {}} />)
    
    await user.type(screen.getByLabelText('Name'), 'Buddy')
    await user.type(screen.getByLabelText('Breed'), 'Labrador')
    await user.type(screen.getByLabelText('Estimated Age (years)'), '3')
    
    await user.click(screen.getByRole('button', { name: 'Add Pet' }))
    
    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Buddy',
        breed: 'Labrador',
        estimatedAge: 3,
      })
    )
  })

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup()
    const handleCancel = vi.fn()
    
    render(<PetForm onSubmit={() => {}} onCancel={handleCancel} />)
    
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    
    expect(handleCancel).toHaveBeenCalled()
  })

  it('shows Update button when editing', () => {
    const pet = createMockPet()
    
    render(<PetForm pet={pet} onSubmit={() => {}} onCancel={() => {}} />)
    
    expect(screen.getByRole('button', { name: 'Update Pet' })).toBeInTheDocument()
  })
})
