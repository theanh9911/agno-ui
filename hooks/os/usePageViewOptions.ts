import { useMemo } from 'react'
import { useFetchOSStatus } from '@/hooks/os/useFetchOSStatus'
import { useOSStore } from '@/stores/OSStore'
import { useOSQuery } from '@/api/hooks'

export enum PageViewState {
  DISCONNECTED = 'disconnected',
  INACTIVE = 'inactive',
  AUTH_FAILED = 'auth-failed',
  MISSING_SECURITY_KEY = 'missing-security-key',
  LOADING = 'loading',
  CONTENT = 'content',
  NO_DATABASES = 'no-databases',
  EMPTY = 'empty',
  NOT_FOUND = 'not-found'
}

export interface PageViewOptions {
  additionalChecks?: () => PageViewState | null
}

export interface PageViewResult {
  view: PageViewState
  isTeaser: boolean
}

/**
 * Custom hook to handle OS status checking and view determination
 */
export const usePageViewOptions = (
  options: PageViewOptions = {}
): PageViewResult => {
  const { additionalChecks } = options

  const { currentOS, authStatus } = useOSStore()
  const { data: isOsAvailable, isFetched } = useFetchOSStatus()
  const { data: OSList } = useOSQuery()
  const view = useMemo(() => {
    if (!currentOS || !OSList || OSList?.length === 0)
      return PageViewState.DISCONNECTED

    // Use auth status for loading and auth states (check auth failures first)
    switch (authStatus) {
      case 'loading':
        // Only show loading if we haven't determined OS is unavailable yet
        // This handles new SDK where health passes but config might fail
        if (!isFetched || isOsAvailable) {
          return PageViewState.LOADING
        }
        // If fetched and OS is not available, fall through to INACTIVE
        break
      case 'auth-failed':
        return PageViewState.AUTH_FAILED
      case 'missing-security-key':
        return PageViewState.MISSING_SECURITY_KEY
    }

    // Check for INACTIVE state when OS is not available (after auth checks)
    if (isFetched && !isOsAvailable) return PageViewState.INACTIVE

    // Only check availability after queries are complete

    if (additionalChecks) {
      const additionalResult = additionalChecks()
      if (additionalResult) return additionalResult
    }

    return PageViewState.CONTENT
  }, [
    currentOS,
    OSList,
    authStatus,
    isFetched,
    isOsAvailable,
    additionalChecks
  ])

  const isTeaser = Boolean(
    [
      PageViewState.DISCONNECTED,
      PageViewState.INACTIVE,
      PageViewState.AUTH_FAILED,
      PageViewState.MISSING_SECURITY_KEY
    ].includes(view)
  )

  return {
    view,
    isTeaser
  }
}
