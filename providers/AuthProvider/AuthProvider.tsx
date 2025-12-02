import { useAuthStatus } from '@/api/hooks/queries'
import { usePathname } from '@/utils/navigation'
import { useLayoutEffect, useMemo } from 'react'
import { AUTHENTICATION_ROUTES } from '@/routes'
import useAuth from '@/hooks/useAuth'
import LoadingPage from '@/components/common/LoadingPage/LoadingPage'

const ROUTE_TYPES = {
  AUTHENTICATION: 'authentication',
  PROTECTED: 'protected',
  PUBLIC: 'public'
} as const

const AUTH_ROUTES_SET = new Set(Object.values(AUTHENTICATION_ROUTES))

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const { redirectToApp } = useAuth()

  const routeType = useMemo(() => {
    if (AUTH_ROUTES_SET.has(pathname)) return ROUTE_TYPES.AUTHENTICATION
    return ROUTE_TYPES.PROTECTED
  }, [pathname])

  const { data: authStatus, isLoading } = useAuthStatus()
  const isAuthenticated = authStatus?.authenticated

  // Only handle authenticated users on auth pages
  useLayoutEffect(() => {
    if (isAuthenticated && routeType === ROUTE_TYPES.AUTHENTICATION) {
      redirectToApp()
    }
  }, [isAuthenticated, routeType, redirectToApp])

  // Show loading while checking auth status OR if we don't have auth data yet
  if (isLoading || authStatus === undefined) {
    return <LoadingPage />
  }

  // Show loading while redirecting authenticated users away from auth pages
  if (isAuthenticated && routeType === ROUTE_TYPES.AUTHENTICATION) {
    return <LoadingPage />
  }

  return <>{children}</>
}
