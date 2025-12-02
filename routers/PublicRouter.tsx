import { Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import ErrorPage from '@/pages/ErrorPage'
import AgentThinkingLoader from '@/components/common/Playground/MessageAreaWrapper/AgentThinkingLoader'
import ErrorBoundaryShell from '@/components/pages/ErrorBoundaryPage/ErrorBoundaryShell'
import { logError } from '@/utils/error'

import ResetPasswordPage from '@/pages/ResetPassword'
import ForgetPasswordPage from '@/pages/ForgetPasswordPage'
import AuthPage from '@/pages/AuthPage'

const CliAuthPage = lazy(() => import('@/pages/CliAuthPage'))
const JoinOrganizationPage = lazy(
  () => import('@/components/pages/JoinOrganizationPage')
)
const VerifyEmailPage = lazy(() => import('@/pages/VerifyEmail'))
const LegalPage = lazy(() => import('@/components/pages/LegalPage'))

export default function PublicRouter() {
  const location = useLocation()
  return (
    <ErrorBoundary
      FallbackComponent={ErrorBoundaryShell}
      onError={(error) => {
        logError(error)
      }}
      resetKeys={[location.pathname]}
    >
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            <AgentThinkingLoader />
          </div>
        }
      >
        <Routes>
          {/* CLI Auth route */}
          <Route
            path="/cli-auth"
            element={<CliAuthPage />}
            errorElement={<ErrorPage />}
          />

          {/* Join organization route */}
          <Route
            path="/join"
            element={<JoinOrganizationPage />}
            errorElement={<ErrorPage />}
          />

          {/* Authentication routes */}
          <Route
            path="/signin"
            element={<AuthPage type="signin" />}
            errorElement={<ErrorPage />}
          />

          <Route
            path="/signup"
            element={<AuthPage type="signup" />}
            errorElement={<ErrorPage />}
          />

          <Route
            path="/reset-password"
            element={<ResetPasswordPage />}
            errorElement={<ErrorPage />}
          />

          <Route
            path="/forget-password"
            element={<ForgetPasswordPage />}
            errorElement={<ErrorPage />}
          />

          <Route
            path="/verify-email"
            element={<VerifyEmailPage />}
            errorElement={<ErrorPage />}
          />

          {/* Legal routes */}
          <Route
            path="/legal/tos"
            element={<LegalPage type="tos" />}
            errorElement={<ErrorPage />}
          />

          <Route
            path="/legal/privacy"
            element={<LegalPage type="privacy" />}
            errorElement={<ErrorPage />}
          />

          {/* Catch all for public routes - redirect to signin */}
          <Route path="*" element={<AuthPage type="signin" />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}
