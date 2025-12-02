import { useInfiniteQuery } from '@tanstack/react-query'
import { getMemories } from '@/api/memory'
import { MemoriesResponse } from '@/types/memory'
import { logError } from '@/utils/error'
import { CACHE_KEYS } from '@/constants'
import { useOSStore } from '@/stores/OSStore'
import { useUser } from '@/api/hooks/queries'
import { useAgentsQuery } from '@/hooks/playground/useAgentsQuery'
import { usePlaygroundQueries } from '@/hooks/playground/usePlaygroundQueries'
import { useFetchOSConfig } from '../os'
import { useFetchOSStatus } from '../os/useFetchOSStatus'
import { SortBy } from '@/types/filter'

const MEMORIES_LIMIT = 11

export default function useFetchPlaygroundMemories() {
  const { currentOS } = useOSStore()
  const endpoint = currentOS?.endpoint_url ?? null
  const OSId = currentOS?.id ?? null
  const { data: user } = useUser()
  const { data: osConfig } = useFetchOSConfig()
  const { data: isOsAvailable } = useFetchOSStatus()

  const { data: agents } = useAgentsQuery()
  const playgroundQueries = usePlaygroundQueries()
  const selectedId = playgroundQueries.selectedId
  //this will change to dbId
  const dbId =
    agents?.find((agent) => agent.id === selectedId)?.db_id ?? undefined
  const table =
    agents?.find((agent) => agent.id === selectedId)?.memory?.memory_table ?? ''
  const user_id = user?.user.username ?? ''

  return useInfiniteQuery({
    queryKey: CACHE_KEYS.APP_MEMORIES({
      OSId,
      dbId: dbId ?? '',
      memoryId: 'all-playground',
      sort_by: SortBy.UPDATED_AT_DESC,
      limit: MEMORIES_LIMIT,
      userId: user_id,
      table: table
    }),
    queryFn: async ({ pageParam = 1 }) => {
      try {
        if (!endpoint) {
          throw new Error('API endpoint not set')
        }

        if (!dbId) {
          throw new Error('Manager route not set')
        }

        const response = await getMemories({
          url: endpoint,
          db_id: dbId,
          limit: MEMORIES_LIMIT,
          page: pageParam,
          sort_by: 'updated_at',
          sort_order: 'desc',
          user_id: user_id,
          table
        })

        return response.body as MemoriesResponse
      } catch (err) {
        logError(err as Error)
        return {
          data: [],
          meta: {
            page: 1,
            limit: MEMORIES_LIMIT,
            total_pages: 1,
            total_count: 0
          }
        }
      }
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.meta) return undefined
      const { page, total_pages } = lastPage.meta
      return page < total_pages ? page + 1 : undefined
    },
    enabled:
      !!isOsAvailable &&
      !!endpoint &&
      !!dbId &&
      !!selectedId &&
      !!osConfig &&
      !!user_id,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: false,
    initialPageParam: 1
  })
}
