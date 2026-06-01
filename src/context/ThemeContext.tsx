import { createContext, useContext, useEffect, type ReactNode } from 'react'
import type { Theme, AppAction } from '../types'

interface ThemeContextValue {
  theme: Theme
  setTheme: (field: keyof Theme, value: string) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({
  children,
  theme,
  dispatch,
}: {
  children: ReactNode
  theme: Theme
  dispatch: React.Dispatch<AppAction>
}) {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme.mode)
    document.documentElement.setAttribute('data-density', theme.density)
    document.documentElement.style.setProperty('--primary', theme.primaryColor)
    document.documentElement.style.setProperty('--bg', theme.backgroundColor)
    document.documentElement.style.setProperty('--text', theme.textColor)
    document.documentElement.style.setProperty('--font-scale', String(theme.fontScale))
    document.documentElement.style.setProperty('--radius', `${theme.cardRadius}px`)
  }, [theme])

  const setTheme = (field: keyof Theme, value: string) => {
    dispatch({ type: 'SET_THEME', payload: { [field]: value } })
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return ctx
}
