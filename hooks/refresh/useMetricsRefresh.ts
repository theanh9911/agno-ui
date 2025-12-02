import { useCallback } from 'react'
import { useInvalidateMetrics } from '@/hooks/metrics/useMetricQuery'

export const useMetricsRefresh = () => {
  const { invalidateMetrics } = useInvalidateMetrics()

  const refresh = useCallback(async () => {
    await invalidateMetrics()
  }, [invalidateMetrics])

  return refresh
}
