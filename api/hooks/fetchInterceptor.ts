import { signOut } from '@/utils/user/auth'
import { ROUTES, PUBLIC_ROUTES, AUTHENTICATION_ROUTES } from '@/routes'

export interface FetchInterceptorDependencies {
  originalFetch: typeof fetch
  signOut: typeof signOut
  getPathname: () => string
  refreshEndpoint: string
  publicRoutes: string[]
  authRoutes: string[]
}

export class FetchInterceptor {
  private isRefreshing = false

  constructor(private deps: FetchInterceptorDependencies) {}

  private isAuthUrl(url: string): boolean {
    return /\/auth(\/|$)/.test(url)
  }

  private trackFailed(url: string, response: Response, method?: string): void {
    try {
      if (
        !response.ok &&
        !this.isAuthUrl(url) &&
        url !== this.deps.refreshEndpoint
      ) {
        window.newrelic?.addPageAction?.('api_error', {
          url,
          method: method || 'GET',
          status: response.status
        })
      }
    } catch {
      // eslint-disable-next-line no-console
      console.error('Failed to add page action for api_error')
    }
  }

  private shouldSkipRefresh(url: string): boolean {
    const isRefreshEndpoint = url.includes('/auth/refresh')
    const isOnPublicOrAuthRoute = !this.shouldRedirectOnUnauthorized()
    return this.isRefreshing || isRefreshEndpoint || isOnPublicOrAuthRoute
  }

  private shouldRedirectOnUnauthorized(): boolean {
    const currentPath = this.deps.getPathname()
    const publicRoutes = this.deps.publicRoutes
    const authRoutes = this.deps.authRoutes

    // Don't redirect if we're on a public route or auth route where 401s are expected
    return (
      !publicRoutes.includes(currentPath) && !authRoutes.includes(currentPath)
    )
  }

  private isOffline(): boolean {
    return !navigator.onLine
  }

  private async attemptRefresh(): Promise<Response> {
    return this.deps.originalFetch.call(window, this.deps.refreshEndpoint, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  private handleUnauthorized(): void {
    if (this.shouldRedirectOnUnauthorized()) {
      this.deps.signOut(undefined, ROUTES.SignIn)
    }
  }

  async intercept(
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> {
    // Derive URL string for tracking
    const urlString =
      typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.href
          : input.url

    // Check if offline before making any request
    if (this.isOffline()) {
      throw new Error('Offline')
    }

    const response = await this.deps.originalFetch.call(window, input, init)

    // Extract URL for endpoint checking
    const url = urlString

    // Handle 401 responses with refresh logic
    if (response.status === 401 && !this.shouldSkipRefresh(url)) {
      this.isRefreshing = true

      try {
        const refreshResponse = await this.attemptRefresh()

        if (refreshResponse.ok) {
          // Retry the original request
          const retryResponse = await this.deps.originalFetch.call(
            window,
            input,
            init
          )

          // If retry still fails with 401, handle as unauthorized
          if (retryResponse.status === 401) {
            this.handleUnauthorized()
          }
          this.trackFailed(url, retryResponse, init?.method)

          return retryResponse
        } else {
          this.trackFailed(url, response, init?.method)
          this.handleUnauthorized()
          return response
        }
      } catch {
        this.trackFailed(url, response, init?.method)
        this.handleUnauthorized()
        return response
      } finally {
        this.isRefreshing = false
      }
    }

    // Track failed non-auth, non-refresh requests
    this.trackFailed(url, response, init?.method)
    return response
  }
}

export const createFetchInterceptor = (
  overrides?: Partial<FetchInterceptorDependencies>
): FetchInterceptor => {
  const defaultDeps: FetchInterceptorDependencies = {
    originalFetch: window.fetch,
    signOut,
    getPathname: () => window.location.pathname,
    refreshEndpoint: '/api/v1/auth/refresh',
    publicRoutes: Object.values(PUBLIC_ROUTES),
    authRoutes: Object.values(AUTHENTICATION_ROUTES)
  }

  return new FetchInterceptor({ ...defaultDeps, ...overrides })
}
