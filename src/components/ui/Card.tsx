import type { ComponentPropsWithoutRef } from 'react'
import '../../styles/ui.css'

export function Card({
  children,
  className = '',
  draggable = false,
  onDragStart,
  onDragEnd,
  ...props
}: ComponentPropsWithoutRef<'article'> & { draggable?: boolean }) {
  return (
    <article
      className={`card ${className}`}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      {...props}
    >
      {children}
    </article>
  )
}

export function Skeleton({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`skeleton ${className}`} aria-hidden="true">
      <div className="skeleton__image" />
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton__line"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  )
}
