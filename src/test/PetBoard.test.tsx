import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { PetBoard } from '../components/pets/PetBoard'
import { createMockPet, createMockUser } from './test-utils'

function renderPetBoard(props: {
  pets?: ReturnType<typeof createMockPet>[]
  user?: ReturnType<typeof createMockUser>
  loading?: boolean
  dispatch?: ReturnType<typeof vi.fn>
  singleStatus?: string
}) {
  return render(
    <MemoryRouter>
      <PetBoard
        pets={props.pets ?? []}
        user={props.user ?? createMockUser()}
        loading={props.loading ?? false}
        dispatch={props.dispatch ?? (() => {})}
        onEdit={() => {}}
        onDelete={() => {}}
        onSchedule={() => {}}
        singleStatus={props.singleStatus}
      />
    </MemoryRouter>
  )
}

describe('PetBoard', () => {
  it('renders all status columns', () => {
    renderPetBoard({})

    expect(screen.getByText('New')).toBeInTheDocument()
    expect(screen.getByText('Meet & Greet')).toBeInTheDocument()
    expect(screen.getByText('Adopted')).toBeInTheDocument()
  })

  it('renders pets in correct columns', () => {
    const pets = [
      createMockPet({ id: '1', name: 'Buddy', status: 'New' }),
      createMockPet({ id: '2', name: 'Max', status: 'Adopted' }),
    ]

    renderPetBoard({ pets })

    expect(screen.getByText('New')).toBeInTheDocument()
    expect(screen.getByText('Adopted')).toBeInTheDocument()
    expect(screen.getByText('Buddy')).toBeInTheDocument()
    expect(screen.getByText('Max')).toBeInTheDocument()
  })

  it('shows loading skeletons when loading', () => {
    renderPetBoard({ loading: true })

    const skeletons = document.querySelectorAll('.skeleton')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('shows empty state message when no pets in column', () => {
    renderPetBoard({})

    const emptyMessages = document.querySelectorAll('.column__empty')
    expect(emptyMessages.length).toBeGreaterThan(0)
  })

  it('dispatches MOVE_PET on drop', () => {
    const user = createMockUser({ role: 'admin' })
    const dispatch = vi.fn()
    const pets = [createMockPet({ id: '1', status: 'New' })]

    renderPetBoard({ pets, user, dispatch })

    const adoptedColumn = screen.getByText('Adopted').closest('.column')!
    const dropEvent = new Event('drop', { bubbles: true }) as any
    dropEvent.dataTransfer = {
      getData: () => JSON.stringify({ petId: '1', sourceStatus: 'New' }),
    }
    dropEvent.preventDefault = vi.fn()

    adoptedColumn.dispatchEvent(dropEvent)

    expect(dispatch).toHaveBeenCalledWith({
      type: 'MOVE_PET',
      payload: { id: '1', status: 'Adopted' },
    })
  })
})
