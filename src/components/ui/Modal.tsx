import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'
import '../../styles/ui.css'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const previousFocus = useRef<Element | null>(null)

  useEffect(() => {
    if (open) {
      previousFocus.current = document.activeElement
      dialogRef.current?.showModal()
    } else {
      dialogRef.current?.close()
      if (previousFocus.current instanceof HTMLElement) {
        previousFocus.current.focus()
      }
    }
  }, [open])

  if (!open) return null

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose()
      }}
    >
      <div className="modal__content">
        <div className="modal__header">
          <h2 className="modal__title">{title}</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </dialog>
  )
}
