import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import PublicRouter from './PublicRouter'
import PrivateRouter from './PrivateRouter'
import AuthProvider from '@/providers/AuthProvider'
import OSProvider from '@/providers/OSProvider'
import { BillingProvider } from '@/providers/BillingProvider'
import UpgradeFlowManager from '@/providers/UpgradeFlow/UpgradeFlowManager'
import CancelFlowManager from '@/providers/CancelFlow/CancelFlowManager'
import { DialogProvider } from '@/providers/DialogProvider'
import { RestrictionOverlayProvider } from '@/components/common/RestrictionOverlay'
import { ManualModeProvider } from '@/providers/ManualModeProvider/ManualModeProvider'
import { PUBLIC_ROUTES, AUTHENTICATION_ROUTES } from '@/routes'
import { DatabaseProvider } from '@/providers/DatabaseProvider'
import { NewRelic } from '@/newrelic'

const AppRouter = () => {
  const location = useLocation()
  const currentPath = location.pathname

  // Report current route to New Relic for better traces and grouping
  useEffect(() => {
    try {
      NewRelic.setCurrentRouteName(currentPath)
    } catch {
      // no-op
    }
  }, [currentPath])

  const isAuthRoute = Object.values(AUTHENTICATION_ROUTES).includes(currentPath)
  const isPublicRoute = Object.values(PUBLIC_ROUTES).includes(currentPath)

  const content = isAuthRoute ? (
    <AuthProvider>
      <PublicRouter />
    </AuthProvider>
  ) : isPublicRoute ? (
    <PublicRouter />
  ) : (
    // For private routes, wrap with all auth providers
    <AuthProvider>
      <BillingProvider>
        <OSProvider>
          <ManualModeProvider>
            <DatabaseProvider>
              <RestrictionOverlayProvider>
                <DialogProvider>
                  <PrivateRouter />
                  <UpgradeFlowManager />
                  <CancelFlowManager />
                </DialogProvider>
              </RestrictionOverlayProvider>
            </DatabaseProvider>
          </ManualModeProvider>
        </OSProvider>
      </BillingProvider>
    </AuthProvider>
  )

  return content
}

export default AppRouter
