import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { PetCard } from '../components/pets/PetCard'
import { createMockPet, createMockUser } from './test-utils'

function renderPetCard(props: {
  pet: ReturnType<typeof createMockPet>
  user: ReturnType<typeof createMockUser>
  onEdit?: () => void
  onDelete?: (id: string) => void
  onSchedule?: () => void
}) {
  return render(
    <MemoryRouter>
      <PetCard
        pet={props.pet}
        user={props.user}
        onEdit={props.onEdit ?? (() => {})}
        onDelete={props.onDelete ?? (() => {})}
        onSchedule={props.onSchedule ?? (() => {})}
      />
    </MemoryRouter>
  )
}

describe('PetCard', () => {
  it('renders pet information', () => {
    const pet = createMockPet({ name: 'Buddy', breed: 'Labrador', estimatedAge: 3 })
    const user = createMockUser()

    renderPetCard({ pet, user })

    expect(screen.getByText('Buddy')).toBeInTheDocument()
    expect(screen.getByText(/Labrador/)).toBeInTheDocument()
    expect(screen.getByText(/3 years/)).toBeInTheDocument()
  })

  it('shows meet and greet button for user on new pets', () => {
    const pet = createMockPet({ status: 'New' })
    const user = createMockUser({ role: 'user' })

    renderPetCard({ pet, user })

    expect(screen.getByRole('button', { name: 'Meet & Greet' })).toBeInTheDocument()
  })

  it('hides meet and greet for adopted pets', () => {
    const pet = createMockPet({ status: 'Adopted' })
    const user = createMockUser({ role: 'user' })

    renderPetCard({ pet, user })

    expect(screen.queryByRole('button', { name: 'Meet & Greet' })).not.toBeInTheDocument()
  })

  it('shows edit and delete buttons for admin role', () => {
    const pet = createMockPet()
    const user = createMockUser({ role: 'admin' })

    renderPetCard({ pet, user })

    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
  })

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup()
    const pet = createMockPet({ id: '1' })
    const mockUser = createMockUser({ role: 'admin' })
    const handleDelete = vi.fn()

    renderPetCard({ pet, user: mockUser, onDelete: handleDelete })

    await user.click(screen.getByRole('button', { name: 'Delete' }))

    expect(handleDelete).toHaveBeenCalledWith('1')
  })

  it('is draggable for admin role', () => {
    const pet = createMockPet()
    const user = createMockUser({ role: 'admin' })

    renderPetCard({ pet, user })

    const card = screen.getByText('Buddy').closest('.card')
    expect(card).toHaveAttribute('draggable', 'true')
  })

  it('is not draggable for user role', () => {
    const pet = createMockPet()
    const user = createMockUser({ role: 'user' })

    renderPetCard({ pet, user })

    const card = screen.getByText('Buddy').closest('.card')
    expect(card).not.toHaveAttribute('draggable', 'true')
  })
})
