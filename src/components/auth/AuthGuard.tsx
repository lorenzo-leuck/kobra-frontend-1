import type { User } from '../../types'

interface AuthGuardProps {
  user: User | null
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AuthGuard({ user, children, fallback }: AuthGuardProps) {
  if (user?.role !== 'admin') {
    return fallback ?? (
      <main className="main">
        <div className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
          <h2>Not Authorized</h2>
          <p>You do not have permission to access this page.</p>
        </div>
      </main>
    )
  }

  return <>{children}</>
}
