import { getMemories } from '@/api/memory'
import { MemoriesResponse, SortByValue } from '@/types/memory'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { CACHE_KEYS } from '@/constants'
import { toast } from '@/components/ui/toast'
import { useEffect } from 'react'
import { useOSStore } from '@/stores/OSStore'
import { useMemoryStore } from '@/stores/MemoryStore'
import { useFetchOSStatus } from '../os/useFetchOSStatus'
import { useFetchOSConfig } from '../os'
import { useSortBy } from '@/hooks/useSortBy'
import { useDatabase } from '@/providers/DatabaseProvider'

// Unified hook for getting memories (all or single)
export function useMemoriesQuery() {
  const params = useParams<{ '*'?: string }>()
  // The route is defined as memory/* (splat route), so userId is captured as params['*']
  const userId = params['*']
  const { currentOS } = useOSStore()
  const { getCurrentPagination, updatePaginationFromResponse } =
    useMemoryStore()
  const { data: osConfig } = useFetchOSConfig()
  const { data: isOsAvailable } = useFetchOSStatus()

  const OSId = currentOS?.id ?? null
  const endpoint = currentOS?.endpoint_url ?? null
  const {
    sortBy: sortByVal,
    getSortBy: getSortByVal,
    getSortOrder: getSortOrderVal
  } = useSortBy()
  // Provide defaults for sort if not in URL
  const sortBy = (sortByVal as SortByValue) || 'updated_at_desc'
  const getSortBy = getSortByVal || 'updated_at'
  const getSortOrder = getSortOrderVal || 'desc'
  const { selectedDatabase } = useDatabase()
  const dbId = selectedDatabase.memory?.db?.db_id ?? ''
  const table = selectedDatabase.memory?.table || ''
  const userPagination = getCurrentPagination(userId || '', dbId)
  const { page, limit } = userPagination

  const query = useQuery({
    queryKey: CACHE_KEYS.APP_MEMORIES({
      OSId,
      dbId: dbId,
      memoryId: 'all',
      sort_by: sortBy as SortByValue,
      page,
      limit,
      userId,
      table
    }),
    queryFn: async () => {
      if (!endpoint) {
        throw new Error('API endpoint not set')
      }
      if (!dbId) {
        throw new Error('Database id not set')
      }

      const response = await getMemories({
        url: endpoint ?? '',
        db_id: dbId,
        limit,
        page,
        sort_by: getSortBy,
        sort_order: getSortOrder,
        user_id: userId,
        table: table
      })

      const responseBody = response.body as MemoriesResponse

      if (responseBody?.meta) {
        const paginationData = {
          page: responseBody.meta.page ?? 1,
          limit: responseBody.meta.limit,
          total_pages: responseBody.meta.total_pages ?? null,
          total_count: responseBody.meta.total_count ?? null
        }
        updatePaginationFromResponse(userId!, paginationData, dbId)
      }

      return (
        response.body ?? {
          data: [],
          meta: { page: 1, limit, total_pages: null, total_count: null }
        }
      )
    },
    enabled:
      page > 0 &&
      limit > 0 &&
      !!dbId &&
      !!isOsAvailable &&
      !!endpoint &&
      !!selectedDatabase?.memory &&
      !!osConfig,

    retry: 1
  })

  useEffect(() => {
    if (query.error) {
      toast.error({
        description:
          query.error instanceof Error
            ? query.error.message
            : 'An error occurred while fetching memories',
        id: 'memories-fetch-error'
      })
    }
  }, [query.error])

  // Return consistent shape regardless of endpoint state
  if (!endpoint) {
    return {
      data: null,
      isLoading: false,
      error: null,
      refetch: query.refetch,
      isFetching: false,
      isFetched: false,
      isPending: false,
      isError: false,
      isSuccess: false,
      status: 'success' as const
    }
  }

  return query
}
