import { useId, type ComponentPropsWithoutRef, type ElementType, type ReactNode } from 'react'
import '../../styles/ui.css'

interface SelectProps extends ComponentPropsWithoutRef<'select'> {
  label?: ReactNode
  icon?: ElementType
  options?: { value: string; label: string }[]
  error?: string
}

export function Select({
  label,
  icon: Icon,
  options = [],
  error,
  className = '',
  ...props
}: SelectProps) {
  const id = useId()
  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label htmlFor={id} className="input-group__label">
          {label}
        </label>
      )}
      <div className="input-group__wrapper">
        {Icon && <Icon size={16} className="input-group__icon" />}
        <select
          id={id}
          className={`input-group__input input-group__select ${Icon ? 'input-group__input--with-icon' : ''} ${error ? 'input-group__input--error' : ''}`}
          aria-invalid={!!error}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <span className="input-group__error" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
