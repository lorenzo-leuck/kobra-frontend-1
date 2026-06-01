import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Card, Skeleton } from '../components/ui/Card'

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Card className="custom">Content</Card>)
    const card = screen.getByText('Content').closest('.card')
    expect(card).toHaveClass('custom')
  })

  it('is draggable when draggable prop is true', () => {
    render(<Card draggable>Content</Card>)
    const card = screen.getByText('Content').closest('.card')
    expect(card).toHaveAttribute('draggable', 'true')
  })

  it('calls onDragStart when drag starts', () => {
    const handleDragStart = vi.fn()
    render(<Card draggable onDragStart={handleDragStart}>Content</Card>)
    const card = screen.getByText('Content').closest('.card')
    fireEvent.dragStart(card!)
    expect(handleDragStart).toHaveBeenCalled()
  })
})

describe('Skeleton', () => {
  it('renders skeleton lines', () => {
    render(<Skeleton lines={3} />)
    const skeleton = document.querySelector('.skeleton')
    expect(skeleton).toBeInTheDocument()
    expect(document.querySelectorAll('.skeleton__line')).toHaveLength(3)
  })

  it('renders image placeholder', () => {
    render(<Skeleton />)
    expect(document.querySelector('.skeleton__image')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Skeleton className="custom" />)
    const skeleton = document.querySelector('.skeleton')
    expect(skeleton).toHaveClass('custom')
  })
})
