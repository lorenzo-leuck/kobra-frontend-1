import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'
import type { Toast as ToastType } from '../../types'
import '../../styles/ui.css'

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

interface ToastProps {
  toasts: ToastType[]
  onRemove: (id: number) => void
}

export function Toast({ toasts, onRemove }: ToastProps) {
  return (
    <div className="toast-container" role="status" aria-live="polite">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  )
}

function ToastItem({
  toast,
  onRemove,
}: {
  toast: ToastType
  onRemove: (id: number) => void
}) {
  const Icon = iconMap[toast.type] || Info

  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 4000)
    return () => clearTimeout(timer)
  }, [toast.id, onRemove])

  return (
    <motion.div
      className={`toast toast--${toast.type || 'info'}`}
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      <Icon size={18} />
      <span className="toast__message">{toast.message}</span>
      <button
        className="toast__close"
        onClick={() => onRemove(toast.id)}
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>
    </motion.div>
  )
}
