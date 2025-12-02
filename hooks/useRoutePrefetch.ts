import { useCallback } from 'react'
import { handleChunkLoadingError } from '@/utils/error'

type RouteImporter = () => Promise<{ default: React.ComponentType }>

const routeImporters: Record<string, RouteImporter> = {
  '/sessions': () => import('@/pages/SessionsPage'),
  '/chat': () => import('@/pages/PlaygroundPage'),
  '/evaluation': () => import('@/pages/EvaluationPage'),
  '/memory': () => import('@/pages/MemoryPage'),
  '/knowledge': () => import('@/pages/KnowledgePage'),
  '/metrics': () => import('@/pages/UserMetricsPage')
}

const prefetchedRoutes = new Set<string>()

export const useRoutePrefetch = () => {
  const prefetchRoute = useCallback((routePath: string) => {
    if (prefetchedRoutes.has(routePath)) {
      return
    }

    const importer = routeImporters[routePath]
    if (importer) {
      prefetchedRoutes.add(routePath)
      importer().catch((error) => {
        // Handle chunk loading errors during prefetch
        if (error instanceof Error && !handleChunkLoadingError(error)) {
          // Only remove from prefetched routes if it's not a chunk error
          // (chunk errors will trigger a page refresh)
          prefetchedRoutes.delete(routePath)
        }
      })
    }
  }, [])

  const prefetchAllRoutes = useCallback(() => {
    Object.keys(routeImporters).forEach(prefetchRoute)
  }, [prefetchRoute])

  return { prefetchRoute, prefetchAllRoutes }
}
