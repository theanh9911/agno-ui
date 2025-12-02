import { useState, useCallback, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { PRIVATE_ROUTES } from '@/routes'
import { logError } from '@/utils/error'
import { useInvalidateOSStatus } from '@/hooks/os/useInvalidateOSStatus'
import { useSessionsRefresh } from './useSessionsRefresh'
import { useMemoryRefresh, useMemoryRefresh2 } from './useMemoryRefresh'
import { useKnowledgeRefresh } from './useKnowledgeRefresh'
import { useKnowledgeRefresh2 } from './useKnowledgeRefresh'
import { useEvaluationRefresh } from './useEvaluationRefresh'
import { useMetricsRefresh } from './useMetricsRefresh'
import { useOSConfigRefresh } from './useOSConfigRefresh'
import { usePlaygroundRefresh } from './usePlaygroundRefresh'
import { useTracesRefresh } from './useTracesRefresh'

export interface UseGlobalRefreshReturn {
  refresh: () => Promise<void>
  isLoading: boolean
}

const getInvalidationType = (pathname: string) => {
  if (pathname === PRIVATE_ROUTES.UserHome) return 'osConfig'
  if (pathname.startsWith(PRIVATE_ROUTES.UserSessions)) return 'sessions'
  if (pathname.startsWith(PRIVATE_ROUTES.UserMemory)) return 'memory'
  if (pathname.startsWith(PRIVATE_ROUTES.UserKnowledge)) return 'knowledge'
  if (pathname.startsWith('/v2knowledge')) return 'knowledge2'
  if (pathname.startsWith('/v2memory')) return 'memory2'
  if (pathname.startsWith(PRIVATE_ROUTES.UserEvaluation)) return 'evaluation'
  if (pathname === PRIVATE_ROUTES.UserMetrics) return 'metrics'
  if (pathname.startsWith(PRIVATE_ROUTES.UserChat)) return 'playground'
  if (pathname.startsWith(PRIVATE_ROUTES.UserTraces)) return 'traces'
  return null
}

export const useGlobalRefresh = (): UseGlobalRefreshReturn => {
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)
  const { invalidateOSStatus } = useInvalidateOSStatus()
  const sessionsRefresh = useSessionsRefresh()
  const memoryRefresh = useMemoryRefresh()
  const knowledgeRefresh = useKnowledgeRefresh()
  const knowledgeRefresh2 = useKnowledgeRefresh2()
  const memoryRefresh2 = useMemoryRefresh2()
  const evaluationRefresh = useEvaluationRefresh()
  const metricsRefresh = useMetricsRefresh()
  const osConfigRefresh = useOSConfigRefresh()
  const playgroundRefresh = usePlaygroundRefresh()
  const tracesRefresh = useTracesRefresh()
  const invalidationType = useMemo(
    () => getInvalidationType(location.pathname),
    [location.pathname]
  )

  // refresh handler registry
  const refreshHandlers = useMemo(
    () => ({
      sessions: sessionsRefresh,
      memory: memoryRefresh,
      knowledge: knowledgeRefresh,
      knowledge2: knowledgeRefresh2,
      evaluation: evaluationRefresh,
      metrics: metricsRefresh,
      osConfig: osConfigRefresh,
      playground: playgroundRefresh,
      traces: tracesRefresh,
      memory2: memoryRefresh2
    }),
    [
      sessionsRefresh,
      memoryRefresh,
      knowledgeRefresh,
      evaluationRefresh,
      metricsRefresh,
      osConfigRefresh,
      playgroundRefresh,
      tracesRefresh,
      memoryRefresh,
      memoryRefresh2
    ]
  )

  const refresh = useCallback(async () => {
    setIsLoading(true)
    try {
      // Always invalidate OS status regardless of route
      const promises: Promise<void>[] = [invalidateOSStatus()]
      // Add route-specific refresh if available
      if (invalidationType) {
        const handler = refreshHandlers[invalidationType]
        if (handler) {
          promises.push(handler())
        }
      }
      await Promise.all(promises)
    } catch {
      logError(
        new Error(
          `Error performing global refresh for route: ${location.pathname}`
        )
      )
    } finally {
      setIsLoading(false)
    }
  }, [invalidationType, refreshHandlers, location.pathname, invalidateOSStatus])

  return {
    refresh,
    isLoading
  }
}
