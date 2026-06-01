import type { ElementType, ButtonHTMLAttributes } from 'react'
import { motion } from 'framer-motion'
import '../../styles/ui.css'

interface ButtonProps {
  children?: React.ReactNode
  icon?: ElementType
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type']
  [key: string]: unknown
}

export function Button({
  children,
  icon: Icon,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <motion.button
      className={`btn btn--${variant} btn--${size} ${className}`}
      disabled={disabled}
      whileTap={{ scale: 0.96 }}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
      {children}
    </motion.button>
  )
}
