import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { CACHE_KEYS } from '@/constants'
import { getMetrics, RefreshMetrics } from '@/api/metrics'
import { MetricsData } from '@/types/metrics'
import { useInvalidateQuery } from '../useInvalidateQuery'
import { useDateFilters } from '@/components/pages/MetricsPage/hooks/useDateFilters'
import { useOSStore } from '@/stores/OSStore'
import { logError } from '@/utils/error'
import { APIError } from '@/api/errors/APIError'
import { useFetchOSConfig, useFetchOSStatus } from '../os'
import { useDatabase } from '@/providers/DatabaseProvider'

export const useMetrics = (): UseQueryResult<MetricsData> => {
  const { currentOS } = useOSStore()
  const { selectedDatabase } = useDatabase()
  const dbId = selectedDatabase?.metrics?.db?.db_id ?? ''
  const table = selectedDatabase.metrics?.table || ''
  const { start, end } = useDateFilters()
  const { data: isOsAvailable } = useFetchOSStatus()

  const { data: osConfig } = useFetchOSConfig()
  const OSId = currentOS?.id ?? null
  const endpoint = currentOS?.endpoint_url || ''
  return useQuery({
    queryKey: [CACHE_KEYS.METRICS, OSId, dbId, start, end, table],
    queryFn: async () => {
      // Refresh the metrics
      if (endpoint && dbId) {
        try {
          await RefreshMetrics(endpoint, dbId, table)
        } catch (error) {
          logError(error as APIError)
        }
      }

      const response = await getMetrics(
        endpoint,
        dbId,
        {
          starting_date: start.toISOString(),
          ending_date: end.toISOString()
        },
        table
      )

      return response?.body || []
    },
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    enabled: !!dbId && !!isOsAvailable && !!currentOS?.id && !!osConfig,
    meta: {
      persist: true
    }
  })
}

export const useInvalidateMetrics = () => {
  const { invalidateQuery } = useInvalidateQuery()
  const { start, end } = useDateFilters()
  const { currentOS } = useOSStore()
  const { selectedDatabase } = useDatabase()
  const dbId = selectedDatabase?.metrics?.db?.db_id ?? ''
  const table = selectedDatabase.metrics?.table || ''
  const OSId = currentOS?.id ?? null

  const invalidateMetrics = async () => {
    await invalidateQuery({
      queryKey: [CACHE_KEYS.METRICS, OSId, dbId, start, end, table],
      refetchType: 'all'
    })
  }

  return { invalidateMetrics }
}
