import { useOSStore } from '@/stores/OSStore'
import { SDKConfig } from '@/utils/request'

export interface OSInterceptorDependencies {
  originalFetch: typeof fetch
}
/** Remove the health call from passing in interceptor later and
 *  remove the backwards compatibilty code entirely*/
export class OSInterceptor {
  constructor(private deps: OSInterceptorDependencies) {}

  async intercept(
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> {
    const response = await this.deps.originalFetch.call(window, input, init)

    // Get current auth status
    const currentAuthStatus = useOSStore.getState().authStatus

    // Extract URL from different input types
    const url =
      input instanceof Request
        ? input.url
        : input instanceof URL
          ? input.href
          : input.toString()

    // Check if this is a health or config endpoint
    const isHealthEndpoint = url.includes('/health')
    const isConfigEndpoint = url.includes('/config')

    // Handle auth-related errors
    if (response.status === 401) {
      useOSStore.setState({
        authStatus: SDKConfig.SECURITY_KEY
          ? 'auth-failed'
          : 'missing-security-key'
      })
    }
    //TODO:Remove this complex logic later - this supports backwards compatibility with the old SDK
    else if (response.status === 200) {
      if (isHealthEndpoint) {
        // Health success: don't set authenticated yet, stay in loading
        // This handles new SDK where health passes but config might fail
        if (currentAuthStatus === 'loading') {
          // Keep it in loading state, don't change to authenticated
          return response
        }
      } else if (isConfigEndpoint) {
        // Config success: this is the final auth confirmation
        useOSStore.setState({ authStatus: 'authenticated' })
      } else {
        // For other endpoints, set authenticated (existing behavior)
        useOSStore.setState({ authStatus: 'authenticated' })
      }
    }

    return response
  }
}

export const createOSInterceptor = (
  overrides?: Partial<OSInterceptorDependencies>
): OSInterceptor => {
  const defaultDeps: OSInterceptorDependencies = {
    originalFetch: window.fetch
  }

  return new OSInterceptor({ ...defaultDeps, ...overrides })
}
