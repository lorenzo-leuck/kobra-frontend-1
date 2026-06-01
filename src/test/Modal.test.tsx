import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from '../components/ui/Modal'

describe('Modal', () => {
  it('renders when open is true', () => {
    render(
      <Modal open={true} onClose={() => {}} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    )
    
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(screen.getByText('Modal content')).toBeInTheDocument()
  })

  it('does not render when open is false', () => {
    render(
      <Modal open={false} onClose={() => {}} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    )
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    const handleClose = vi.fn()
    
    render(
      <Modal open={true} onClose={handleClose} title="Test Modal">
        <p>Content</p>
      </Modal>
    )
    
    await user.click(screen.getByLabelText('Close modal'))
    
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when backdrop is clicked', async () => {
    const user = userEvent.setup()
    const handleClose = vi.fn()
    
    render(
      <Modal open={true} onClose={handleClose} title="Test Modal">
        <p>Content</p>
      </Modal>
    )
    
    const dialog = screen.getByRole('dialog')
    await user.click(dialog)
    
    expect(handleClose).toHaveBeenCalled()
  })
})
