import { useId, type ComponentPropsWithoutRef, type ElementType, type ReactNode } from 'react'
import '../../styles/ui.css'

interface InputProps extends ComponentPropsWithoutRef<'input'> {
  label?: ReactNode
  icon?: ElementType
  error?: string
}

export function Input({ label, icon: Icon, error, className = '', ...props }: InputProps) {
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
        <input
          id={id}
          className={`input-group__input ${Icon ? 'input-group__input--with-icon' : ''} ${error ? 'input-group__input--error' : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
      </div>
      {error && (
        <span id={`${id}-error`} className="input-group__error" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
