import { useQuery } from '@tanstack/react-query'

import { getSessionsListAPI, SessionsListResponse } from '@/api/agent'
import { CACHE_KEYS } from '@/constants'
import { logError } from '@/utils/error'
import { useSessionStore } from '@/stores/SessionsStore'
import { useOSStore } from '@/stores/OSStore'
import { useSortBy } from '@/hooks/useSortBy'
import { useFilterType } from '@/hooks/useFilterType'
import { useDatabase } from '@/providers/DatabaseProvider'
import { useFetchOSStatus } from '../os'

export const useSessionsQuery = () => {
  const { agentPage, teamPage, pageSize } = useSessionStore((state) => state)
  const { data: isOsAvailable } = useFetchOSStatus()
  const currentOS = useOSStore((state) => state.currentOS)
  const { selectedDatabase } = useDatabase()
  const dbId = selectedDatabase?.session?.db?.db_id || ''
  const table = selectedDatabase?.session?.table || ''
  const { isTeam, type } = useFilterType({ autoSetDefault: false })
  const currentPage = isTeam ? teamPage : agentPage

  const { getSortBy, getSortOrder } = useSortBy()

  // Default values if undefined
  const sortBy = getSortBy || 'updated_at'
  const sortOrder = getSortOrder || 'desc'
  return useQuery({
    queryKey: [
      CACHE_KEYS.ALL_SESSIONS(
        currentPage,
        pageSize,
        type,
        currentOS?.id ?? '',
        dbId,
        sortOrder,
        table
      )
    ],
    queryFn: async () => {
      if (!currentOS?.endpoint_url) {
        throw new Error('API endpoint not set')
      }
      if (!dbId) {
        throw new Error('Database not set')
      }
      try {
        const response = await getSessionsListAPI(
          currentOS.endpoint_url,
          dbId,

          {
            page: currentPage,
            type,
            limit: pageSize,
            sort_by: sortBy,
            sort_order: sortOrder
          },
          table
        )
        return response?.body as SessionsListResponse
      } catch (error) {
        logError(error as Error)
        throw error
      }
    },
    enabled: Boolean(currentOS?.id && dbId && type && isOsAvailable),
    refetchOnWindowFocus: false,
    refetchOnMount: true
  })
}
