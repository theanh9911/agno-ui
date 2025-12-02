import { getAllMemoryUsers } from '@/api/memory'
import { MemoriesUsersResponse } from '@/types/memory'
import { useQuery } from '@tanstack/react-query'
import { CACHE_KEYS } from '@/constants'
import { useOSStore } from '@/stores/OSStore'
import { useMemoryStore } from '@/stores/MemoryStore'
import { useFetchOSStatus } from '@/hooks/os/useFetchOSStatus'
import { useDatabase } from '@/providers/DatabaseProvider'

export const useGetAllMemoryUsers = () => {
  const { currentOS } = useOSStore()

  const OSId = currentOS?.id ?? null

  const { data: isOsAvailable } = useFetchOSStatus()

  const endpoint = currentOS?.endpoint_url ?? null
  const { getCurrentUsersPagination, updateUsersPaginationFromResponse } =
    useMemoryStore()
  const { selectedDatabase } = useDatabase()
  const dbId = selectedDatabase.memory?.db?.db_id ?? ''
  const table = selectedDatabase.memory?.table || ''
  const { page, limit } = getCurrentUsersPagination(dbId)

  const query = useQuery<MemoriesUsersResponse>({
    queryKey: CACHE_KEYS.APP_MEMORIES_USERS({
      OSId,
      dbId: dbId,
      memoryId: 'all',
      page,
      limit,
      table: table
    }),
    queryFn: async () => {
      if (!endpoint) {
        throw new Error('API endpoint not set')
      }
      if (!dbId) {
        throw new Error('Database id not set')
      }

      const response = await getAllMemoryUsers(
        endpoint,
        {
          limit,
          page
        },
        dbId,
        table
      )
      const responseBody = response.body as MemoriesUsersResponse

      if (responseBody?.meta) {
        updateUsersPaginationFromResponse(
          {
            page: responseBody.meta.page ?? null,
            limit: responseBody.meta.limit,
            totalPages: responseBody.meta.total_pages ?? null
          },
          dbId
        )
      }
      return (response.body ?? {
        data: [],
        meta: { page: null, limit, totalPages: null }
      }) as MemoriesUsersResponse
    },
    enabled: !!endpoint && !!isOsAvailable && page > 0 && limit > 0 && !!dbId,
    retry: 1
  })

  return query
}
