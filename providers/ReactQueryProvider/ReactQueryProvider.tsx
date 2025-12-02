import { useEffect, useRef, useState, type FC } from 'react'
import {
  QueryClient,
  QueryClientProvider,
  MutationCache,
  QueryCache,
  type Query
} from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { getDays } from '@/utils/date'
import { NewRelic } from '@/newrelic'

import { type ReactQueryProviderProps } from './types'
import { getLocalStorageKey } from '@/constants'

/**
 * Enriches errors from queries/mutations with context for better New Relic traces
 */
/**
 * Determines if a query error should be ignored and not logged to New Relic
 */
const shouldIgnoreQueryError = (
  error: Error,
  query: Query<unknown, Error>
): boolean => {
  // Ignore if query has meta.ignoreErrorLogging set to true
  if (query.meta?.ignoreErrorLogging === true) {
    return true
  }

  // Ignore "data is undefined" - this is not an error
  if (error.message?.includes('data is undefined')) {
    return true
  }

  // Ignore API errors with specific status codes (404, 401)
  if (
    error.message?.includes('404') ||
    error.message?.includes('401') ||
    error.message?.includes('not found')
  ) {
    return true
  }

  // Ignore errors when user is offline
  if (!navigator.onLine) {
    return true
  }

  // Ignore "Missing queryFn" errors (configuration issue, not runtime error)
  if (error.message?.includes('Missing queryFn')) {
    return true
  }

  return false
}

const enrichErrorWithContext = (
  error: Error,
  queryKey?: unknown,
  mutationKey?: unknown,
  type: 'query' | 'mutation' = 'query',
  retryCount?: number,
  failureReason?: string
) => {
  const customAttributes: Record<string, string | number | boolean> = {
    reactQueryType: type,
    timestamp: new Date().toISOString(),
    errorSource: type === 'query' ? 'reactQuery' : 'reactMutation'
  }

  // Extract query key information to identify the source
  if (queryKey) {
    try {
      const keyString = JSON.stringify(queryKey)
      customAttributes.queryKey = keyString

      // Try to extract meaningful identifiers from the query key
      if (Array.isArray(queryKey) && queryKey.length > 0) {
        customAttributes.queryName = String(queryKey[0])
      }
    } catch {
      customAttributes.queryKey = String(queryKey)
    }
  }

  if (mutationKey) {
    try {
      customAttributes.mutationKey = JSON.stringify(mutationKey)
      if (Array.isArray(mutationKey) && mutationKey.length > 0) {
        customAttributes.mutationName = String(mutationKey[0])
      }
    } catch {
      customAttributes.mutationKey = String(mutationKey)
    }
  }

  // Add retry and failure context
  if (retryCount !== undefined) {
    customAttributes.retryCount = retryCount
  }

  if (failureReason) {
    customAttributes.failureReason = failureReason
  }

  // Report to New Relic
  NewRelic.noticeError(error, customAttributes)
}

const ReactQueryProvider: FC<ReactQueryProviderProps> = ({ children }) => {
  // Create queryClient inside component to avoid sharing between SSR and client
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error, query) => {
            // Only log significant query errors to New Relic
            if (
              error instanceof Error &&
              !shouldIgnoreQueryError(error, query as Query<unknown, Error>)
            ) {
              const failureReason =
                query.state.fetchFailureReason instanceof Error
                  ? query.state.fetchFailureReason.message
                  : undefined

              enrichErrorWithContext(
                error,
                query.queryKey,
                undefined,
                'query',
                query.state.fetchFailureCount,
                failureReason
              )
            }
          }
        }),
        mutationCache: new MutationCache({
          onError: (error, _variables, _context, mutation) => {
            // Log all mutation errors to New Relic with context
            if (error instanceof Error) {
              const failureReason =
                mutation.state.failureReason instanceof Error
                  ? mutation.state.failureReason.message
                  : undefined

              enrichErrorWithContext(
                error,
                undefined,
                mutation.options.mutationKey,
                'mutation',
                mutation.state.failureCount,
                failureReason
              )
            }
          }
        }),
        defaultOptions: {
          queries: {
            gcTime: getDays(1),
            refetchOnReconnect: false
          }
        }
      })
  )

  const hasRefetched = useRef(false)

  // Create persister only on client side
  const [localStorageCachePersister] = useState(() => {
    if (typeof window !== 'undefined') {
      return createSyncStoragePersister({
        storage: window.localStorage,
        key: getLocalStorageKey(`reactQueryCache`)
      })
    }
    return null
  })

  useEffect(() => {
    // Refetch logic after client hydration
    if (!hasRefetched.current) {
      const timer = setTimeout(() => {
        queryClient.refetchQueries({
          predicate: () => true,
          exact: false
        })
        hasRefetched.current = true
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [queryClient])

  // Use appropriate provider based on client state
  if (!localStorageCachePersister) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: localStorageCachePersister,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => {
            // Only persist if meta.persist is true AND query is successful
            return (
              query.meta?.persist === true && query.state.status === 'success'
            )
          }
        }
      }}
    >
      {children}
    </PersistQueryClientProvider>
  )
}

export default ReactQueryProvider
