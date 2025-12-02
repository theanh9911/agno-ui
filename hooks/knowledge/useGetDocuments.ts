import { useKnowledgeStore } from '@/stores/KnowledgeStore'
import { useFetchOSConfig, useFetchOSStatus } from '../os'
import { useOSStore } from '@/stores/OSStore'
import { useQuery } from '@tanstack/react-query'
import { CACHE_KEYS } from '@/constants'
import { KnowledgeResponse } from '@/types/Knowledge'
import { useSortBy } from '../useSortBy'
import { getDocuments } from '@/api/knowledge'
import { useEffect } from 'react'
import { SortByValue } from '@/types/memory'
import { useDatabase } from '@/providers/DatabaseProvider/DatabaseProvider'

export default function useGetDocuments() {
  const { updatePaginationFromResponse, page, limit } = useKnowledgeStore()
  const { currentOS } = useOSStore()
  const { selectedDatabase } = useDatabase()
  const dbId = selectedDatabase?.knowledge?.db?.db_id ?? ''
  const table = selectedDatabase.knowledge?.table || ''
  const { data: isOsAvailable } = useFetchOSStatus()
  const { data: osConfig } = useFetchOSConfig()
  const { sortBy, getSortBy, getSortOrder } = useSortBy()
  const query = useQuery({
    queryKey: CACHE_KEYS.KNOWLEDGE({
      OSId: currentOS?.id ?? null,
      dbId,
      page,
      limit,
      sortBy: sortBy as SortByValue,
      table: table
    }),
    queryFn: async () => {
      const response = await getDocuments({
        url: currentOS?.endpoint_url || '',
        db_id: dbId,
        page: page,
        limit,
        sort_by: getSortBy,
        sort_order: getSortOrder,
        table: table
      })

      return (
        response.body ?? {
          data: [],
          meta: { page: null, limit, total_pages: null }
        }
      )
    },

    enabled:
      page > 0 &&
      limit > 0 &&
      !!isOsAvailable &&
      !!currentOS?.id &&
      !!osConfig &&
      !!dbId &&
      !!getSortBy &&
      !!getSortOrder,
    retry: (failureCount) => {
      if (failureCount >= 1) return false
      return true
    },
    retryOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })

  useEffect(() => {
    if (query.data) {
      const responseBody = query.data as KnowledgeResponse
      if (responseBody?.meta) {
        updatePaginationFromResponse({
          page: responseBody.meta.page ?? null,
          limit: responseBody.meta.limit,
          total_pages: responseBody.meta.total_pages ?? null
        })
      }
    }
  }, [query.data, updatePaginationFromResponse])

  return query
}
