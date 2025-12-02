import { APIError } from '@/api/errors/APIError'

import { NewRelic } from '@/newrelic'

const shouldIgnoreErrorStatusCodes = [401, 403, 404]

const isOffline = (): boolean => {
  return !navigator.onLine
}

// Track if we've already handled a chunk loading error to prevent multiple refreshes
let chunkErrorHandled = false

/**
 * Detects if an error is a chunk loading error (usually happens after deployments)
 */
export const isChunkLoadingError = (error: Error): boolean => {
  // Only treat explicit chunk loader errors as chunk loading errors to avoid
  // false positives that could cause reload loops during API/network failures
  return error.name === 'ChunkLoadError'
}

/**
 * Handles chunk loading errors by refreshing the page to load new chunks
 */
export const handleChunkLoadingError = (error: Error): boolean => {
  if (!isChunkLoadingError(error) || chunkErrorHandled) {
    return false
  }

  chunkErrorHandled = true
  // Refresh the page after a short delay
  setTimeout(() => {
    window.location.reload()
  }, 100)

  return true
}

const shouldIgnoreError = (error: Error | APIError) => {
  let shouldIgnore = false
  const isNetworkError =
    error.name === 'TypeError' && error.message === 'Failed to fetch'

  if (
    isNetworkError ||
    (error instanceof APIError &&
      shouldIgnoreErrorStatusCodes.includes(error?.statusCode))
  ) {
    shouldIgnore = true
  }

  return shouldIgnore
}

export const logError = (error: Error | APIError) => {
  // Handle chunk loading errors first
  if (handleChunkLoadingError(error as Error)) {
    return
  }

  // Check if offline first - don't log errors when offline since NetworkStatusProvider handles offline status
  if (isOffline()) {
    return
  }

  if (shouldIgnoreError(error)) {
    return
  }

  const customAttributes: Record<string, string | number | boolean> = {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    pathname: window.location.pathname,
    online: navigator.onLine,
    viewport: `${window.innerWidth}x${window.innerHeight}`
  }

  if (error instanceof APIError) {
    customAttributes.apiError = true
    customAttributes.apiStatusCode = error.statusCode

    // Extract API context if available
    if (error.context && typeof error.context === 'object') {
      try {
        const context = error.context as Record<string, unknown>
        if (context.url) customAttributes.apiEndpoint = String(context.url)
        if (context.method) customAttributes.apiMethod = String(context.method)
        if (context.body)
          customAttributes.apiRequestBody = JSON.stringify(context.body)
      } catch {
        // Ignore serialization errors
      }
    }
  }

  NewRelic.noticeError(error, customAttributes)
}

/**
 * Extracts additional context from the current application state
 */
const getErrorContext = (): Record<string, string | number | boolean> => {
  try {
    return {
      url: window.location.href,
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      online: navigator.onLine,
      viewport: `${window.innerWidth}x${window.innerHeight}`
    }
  } catch {
    // Return empty object with correct type on error
    return {} as Record<string, string | number | boolean>
  }
}

/**
 * Sets up global error handlers for:
 * - Chunk loading errors (auto-refresh on deployment)
 * - Unhandled promise rejections (async errors, event handlers)
 * - Global JavaScript errors (synchronous errors outside React)
 */
export const setupGlobalErrorHandlers = () => {
  // Handle unhandled promise rejections (common for dynamic imports, async event handlers, etc.)
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason

    // Handle chunk loading errors first (with page refresh)
    if (error instanceof Error && handleChunkLoadingError(error)) {
      event.preventDefault()
      return
    }

    // Log all other unhandled promise rejections to New Relic
    // This captures errors from async event handlers, promise chains, etc.
    if (error instanceof Error) {
      const context = getErrorContext()
      const customAttributes = {
        errorSource: 'unhandledRejection',
        ...context
      }

      NewRelic.noticeError(error, customAttributes)
      // eslint-disable-next-line no-console
      console.error('Unhandled promise rejection:', error)
    }
  })

  // Handle global JavaScript errors (synchronous errors outside React)
  window.addEventListener('error', (event) => {
    // Handle chunk loading errors first (with page refresh)
    if (event.error instanceof Error && handleChunkLoadingError(event.error)) {
      event.preventDefault()
      return
    }

    // Log all other global errors to New Relic
    // This captures synchronous errors in event handlers, setTimeout, etc.
    if (event.error instanceof Error) {
      const context = getErrorContext()
      const customAttributes = {
        errorSource: 'globalError',
        errorFilename: event.filename || '',
        errorLine: event.lineno || 0,
        errorColumn: event.colno || 0,
        ...context
      }

      NewRelic.noticeError(event.error, customAttributes)
    }
  })
}

/**
 * Extracts a user-friendly error message from an API error object.
 * Falls back to the provided default if not found.
 */
export const extractAPIErrorMessage = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any,
  fallback: string
): string => {
  if (error && typeof error === 'object') {
    // Case 1: Error message in body.detail
    if (error.body?.detail && typeof error.body.detail === 'string') {
      return error.body.detail
    }
    // Case 2: Error message in nested detail object
    if (error.body?.detail && typeof error.body.detail === 'object') {
      return error.body.detail?.detail
    }
  }
  return fallback
}
