import { useCallback, useMemo } from 'react'
import { useRouter, useSearchParams } from '@/utils/navigation'
import { ROUTES } from '@/routes'

import { GitHubState } from '@/types/globals'

export default function useAuth() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const githubRedirectState = useMemo(() => {
    let state = null
    if (searchParams.has('state')) {
      state = JSON.parse(searchParams.get('state')!) as GitHubState
    }
    return state
  }, [searchParams])

  const redirectURL = useMemo(
    () => searchParams.get('callbackUrl') ?? githubRedirectState?.callbackUrl,
    [searchParams, githubRedirectState]
  )

  const sourceParam = useMemo(
    () => searchParams.get('source') ?? githubRedirectState?.source,
    [searchParams, githubRedirectState]
  )

  const redirection_supported = useMemo(
    () => searchParams.get('redirection_supported') ?? false,
    [searchParams]
  )

  const endpointURLParam = useMemo(
    () => searchParams.get('redirecturi') ?? githubRedirectState?.redirecturi,
    [searchParams, githubRedirectState]
  )

  const authSuccess = useMemo(
    () => searchParams.get('cli_auth') === 'success',
    [searchParams]
  )

  const redirectToApp = useCallback(() => {
    // If coming from CLI, redirect to CLI auth handoff page
    if (sourceParam === 'cli' && endpointURLParam != null) {
      router.push(
        `/cli-auth?source=cli&redirecturi=${encodeURIComponent(endpointURLParam || '')}&redirection_supported=${redirection_supported || ''}`
      )
      return
    }

    // Default: go to callback URL or user home
    router.push(redirectURL ?? ROUTES.UserHome)
  }, [
    redirectURL,
    router,
    sourceParam,
    endpointURLParam,
    redirection_supported
  ])

  return {
    redirectToApp,
    authSuccess,
    sourceParam,
    endpointURLParam,
    redirection_supported
  }
}
