import { motion } from 'framer-motion'
import { AuthGuard } from '../components/auth/AuthGuard'
import { BannerManager } from '../components/admin/BannerManager'
import { StyleCustomizer } from '../components/theme/StyleCustomizer'
import type { AppAction, AppState } from '../types'

interface SettingsPageProps {
  state: AppState
  dispatch: React.Dispatch<AppAction>
}

export function SettingsPage({ state, dispatch }: SettingsPageProps) {
  return (
    <AuthGuard user={state.user}>
      <motion.main
        key="settings"
        className="main"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.2 }}
      >
        <div className="container">
          <BannerManager banners={state.banners} dispatch={dispatch} />
          <StyleCustomizer />
        </div>
      </motion.main>
    </AuthGuard>
  )
}
