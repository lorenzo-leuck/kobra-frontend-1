import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { StyleCustomizer } from '../components/theme/StyleCustomizer'
import { ThemeProvider } from '../context/ThemeContext'
import type { Theme } from '../types'

const defaultTheme: Theme = {
  primaryColor: '#4f46e5',
  backgroundColor: '#eef4fb',
  textColor: '#111827',
  fontScale: 1,
  cardRadius: 8,
  mode: 'light',
  density: 'comfortable',
}

function renderWithTheme(theme = defaultTheme, dispatch = vi.fn()) {
  return render(
    <ThemeProvider theme={theme} dispatch={dispatch}>
      <StyleCustomizer />
    </ThemeProvider>,
  )
}

describe('StyleCustomizer', () => {
  it('renders theme sections', () => {
    renderWithTheme()
    expect(screen.getByText('Appearance')).toBeInTheDocument()
    expect(screen.getByText('Colors')).toBeInTheDocument()
  })

  it('dispatches SET_THEME on color change', () => {
    const dispatch = vi.fn()
    renderWithTheme(defaultTheme, dispatch)
    const colorInputs = document.querySelectorAll('input[type="color"]')
    fireEvent.change(colorInputs[0], { target: { value: '#ff0000' } })
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_THEME',
      payload: { primaryColor: '#ff0000' },
    })
  })

  it('dispatches SET_THEME on mode change', () => {
    const dispatch = vi.fn()
    renderWithTheme(defaultTheme, dispatch)
    fireEvent.change(screen.getByLabelText('Mode'), { target: { value: 'dark' } })
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_THEME',
      payload: { mode: 'dark' },
    })
  })
})
