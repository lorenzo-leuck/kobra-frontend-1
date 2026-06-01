import { Home, PawPrint, Plus, Settings, LogOut, LogIn } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '../ui/Button'
import type { User } from '../../types'

const TITLE = 'React Pet Shelter'

interface HeaderProps {
  user: User | null
  onLogout: () => void
  onAddPet: () => void
  onLogin: () => void
}

export function Header({
  user,
  onLogout,
  onAddPet,
  onLogin,
}: HeaderProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const isAdmin = user?.role === 'admin'
  const isLoggedIn = !!user
  const isSettings = location.pathname === '/settings'

  return (
    <header className="header">
      <div className="container header__content">
        <h1 className="header__title">
          <motion.span
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '0.5rem' }}
          >
            <PawPrint size={24} />
          </motion.span>
          {TITLE}
        </h1>
        <div className="header__actions">
          {isSettings && (
            <Button size="sm" variant="secondary" icon={Home} aria-label="Home" onClick={() => navigate('/')} />
          )}
          {isAdmin && (
            <Button size="sm" variant="secondary" icon={Plus} aria-label="Add Pet" onClick={onAddPet} />
          )}
          {isAdmin && (
            <Button size="sm" variant="secondary" icon={Settings} aria-label="Settings" onClick={() => navigate('/settings')} />
          )}
          {isLoggedIn ? (
            <Button size="sm" variant="secondary" icon={LogOut} aria-label="Logout" onClick={onLogout} />
          ) : (
            <Button size="sm" variant="secondary" icon={LogIn} aria-label="Login" onClick={onLogin} />
          )}
        </div>
      </div>
    </header>
  )
}
