import { Select } from '../ui/Select'
import { useTheme } from '../../context/ThemeContext'
import type { Theme } from '../../types'

export function StyleCustomizer() {
  const { theme, setTheme } = useTheme()

  const handleChange =
    (field: keyof Theme) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setTheme(field, e.target.value)
    }

  return (
    <div className="theme-customizer">
      <section className="theme-customizer__section">
        <h3 className="theme-customizer__label">Appearance</h3>
        <Select
          label="Mode"
          value={theme.mode}
          onChange={handleChange('mode')}
          options={[
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
          ]}
        />
      </section>

      <section className="theme-customizer__section">
        <h3 className="theme-customizer__label">Colors</h3>
        <div className="theme-customizer__colors">
          <div className="color-input">
            <label>Primary</label>
            <input
              type="color"
              value={theme.primaryColor}
              onChange={handleChange('primaryColor')}
            />
          </div>
          <div className="color-input">
            <label>Background</label>
            <input
              type="color"
              value={theme.backgroundColor}
              onChange={handleChange('backgroundColor')}
            />
          </div>
          <div className="color-input">
            <label>Text</label>
            <input
              type="color"
              value={theme.textColor}
              onChange={handleChange('textColor')}
            />
          </div>
        </div>
      </section>
    </div>
  )
}
