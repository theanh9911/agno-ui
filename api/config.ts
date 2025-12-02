import { OpenAPI } from './generated/core/OpenAPI'
import { createFetchInterceptor } from './fetchInterceptor'
import { createOSInterceptor } from './osInterceptor'
import { useOSStore } from '@/stores/OSStore'

// Helper function to determine if a URL matches a configured OS endpoint
const isConfiguredOSEndpoint = (url: string): boolean => {
  try {
    const { currentOS } = useOSStore.getState()

    // If no OS is configured, it can't be an OS endpoint
    if (!currentOS?.endpoint_url) {
      return false
    }

    return url.startsWith(currentOS.endpoint_url)
  } catch {
    return false
  }
}

// Configure the generated API client
const configureAPI = () => {
  // Set base URL from environment or default
  OpenAPI.BASE =
    import.meta.env.VITE_AGNO_API_URL || 'http://localhost:7090/api/v1'

  // Configure credentials
  OpenAPI.WITH_CREDENTIALS = true
  OpenAPI.CREDENTIALS = 'include'

  // Set up dynamic headers
  OpenAPI.HEADERS = async () => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }

    return headers
  }

  const backendApiUrl =
    import.meta.env.VITE_AGNO_API_URL || 'http://localhost:7090/api/v1'

  // Create both interceptors before overriding fetch
  const interceptor = createFetchInterceptor()
  const osInterceptor = createOSInterceptor()
  const originalFetch = window.fetch

  // Override fetch to only intercept backend API calls and OS endpoints
  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    const url =
      input instanceof Request
        ? input.url
        : input instanceof URL
          ? input.href
          : input.toString()

    // Only intercept calls to the backend API (VITE_AGNO_API_URL)
    if (url.startsWith(backendApiUrl)) {
      return interceptor.intercept(input, init)
    }

    // For OS endpoints, use OS interceptor (skip health endpoint)
    // if (url.includes('/health')) {
    //   return originalFetch.call(window, input, init)
    // }

    // Only use OS interceptor for configured OS endpoints
    if (isConfiguredOSEndpoint(url)) {
      return osInterceptor.intercept(input, init)
    }

    // For all other requests (external services, analytics, etc.), use original fetch
    return originalFetch.call(window, input, init)
  }
}

export default configureAPI
