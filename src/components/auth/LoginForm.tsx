import { useState } from 'react'
import { Shield, User, PawPrint } from 'lucide-react'
import type { User as UserType } from '../../types'
import { getDemoAccounts, login } from '../../utils/auth'

interface LoginFormProps {
  onLogin: (user: UserType) => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [error, setError] = useState('')
  const accounts = getDemoAccounts()

  const handleLogin = (email: string) => {
    try {
      const user = login(email)
      onLogin(user)
    } catch {
      setError('Login failed. Please try again.')
    }
  }

  return (
    <div className="login">
      <h1 className="login__title">
        <PawPrint size={28} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
        React Pet Shelter
      </h1>
      <p style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
        Select a demo account to continue
      </p>
      {error && (
        <div className="error-state" role="alert">
          <p className="error-state__message">{error}</p>
        </div>
      )}
      <div className="login__accounts">
        {accounts.map((account) => (
          <button
            key={account.email}
            className="login__account"
            onClick={() => handleLogin(account.email)}
          >
            <span className="login__account-email">
              {account.role === 'admin' ? <Shield size={14} /> : <User size={14} />}{' '}
              {account.email}
            </span>
            <span className="login__account-role">
              {account.role} - {account.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
