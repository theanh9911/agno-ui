import { Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense, ReactNode } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import ErrorPage from '@/pages/ErrorPage'
import MainLayout from '@/layouts/MainLayout'
import AgentThinkingLoader from '@/components/common/Playground/MessageAreaWrapper/AgentThinkingLoader'
import ErrorBoundaryShell from '@/components/pages/ErrorBoundaryPage/ErrorBoundaryShell'
import { logError } from '@/utils/error'
import OnboardingPage from '@/components/pages/OnboardingPage/OnboardingPage'
import { useUser } from '@/api/hooks/queries'
import LoadingPage from '@/components/common/LoadingPage/LoadingPage'
import HomePage from '@/components/pages/HomePage/HomePage'

const SessionsPage = lazy(() => import('@/pages/SessionsPage'))
const PlaygroundPage = lazy(() => import('@/pages/PlaygroundPage'))
const EvaluationPage = lazy(() => import('@/pages/EvaluationPage'))
const MemoryPage = lazy(() => import('@/pages/MemoryPage'))
const KnowledgePage = lazy(() => import('@/pages/KnowledgePage'))
const KnowledgePageV2 = lazy(
  () => import('@/pages/KnowledgePage/knowledgePageV2')
)
const MemoryPageV2 = lazy(() => import('@/pages/memory/MemoryPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))
const UserMetricsPage = lazy(() => import('@/pages/UserMetricsPage'))
const TracesPage = lazy(() => import('@/pages/traces/TracesPage'))
const CancelPlanPage = lazy(() => import('@/pages/CancelPlan'))
const ConfigPage = lazy(() => import('@/components/pages/ConfigPage'))

const useOrganizationCheck = () => {
  const { data, isLoading } = useUser()
  const organizations = data?.organizations
  const hasNoOrganizations =
    !organizations ||
    !Array.isArray(organizations) ||
    organizations.length === 0

  return { isLoading, hasNoOrganizations }
}

interface ConditionalWrapperProps {
  children: ReactNode
}

const ConditionalWrapper = ({ children }: ConditionalWrapperProps) => {
  const { isLoading, hasNoOrganizations } = useOrganizationCheck()

  if (isLoading) {
    return <LoadingPage />
  }

  if (hasNoOrganizations) {
    return <OnboardingPage />
  }

  return <>{children}</>
}

export default function PrivateRouter() {
  const location = useLocation()
  return (
    <ErrorBoundary
      FallbackComponent={ErrorBoundaryShell}
      onError={(error) => logError(error)}
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
          {/* Cancel plan route - private but without MainLayout */}
          <Route
            path="cancel-plan"
            element={
              <ConditionalWrapper>
                <CancelPlanPage />
              </ConditionalWrapper>
            }
          />

          {/* Main app routes - conditionally rendered */}
          <Route
            path="/"
            element={
              <ConditionalWrapper>
                <MainLayout />
              </ConditionalWrapper>
            }
            errorElement={<ErrorPage />}
          >
            <Route index element={<HomePage />} />
            <Route path="config" element={<ConfigPage />} />
            <Route path="metrics" element={<UserMetricsPage />} />
            <Route path="sessions/*" element={<SessionsPage />} />
            <Route path="chat/*" element={<PlaygroundPage />} />
            <Route path="evaluation/*" element={<EvaluationPage />} />
            <Route path="knowledge/*" element={<KnowledgePage />} />
            <Route path="v2knowledge/*" element={<KnowledgePageV2 />}>
              <Route path=":id" element={<KnowledgePageV2 />} />
            </Route>
            <Route path="memory/*" element={<MemoryPage />} />
            <Route path="v2memory/*" element={<MemoryPageV2 />} />
            <Route path="traces/*" element={<TracesPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}
