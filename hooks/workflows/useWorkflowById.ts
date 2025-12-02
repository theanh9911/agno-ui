import { useQuery } from '@tanstack/react-query'

import { getWorkflow } from '@/api/workflow'
import { logError } from '@/utils/error'
import { useOSStore } from '@/stores/OSStore'
import { usePlaygroundQueries } from '../playground/usePlaygroundQueries'
import { CACHE_KEYS } from '@/constants'
import { FilterType } from '@/types/filter'

/**
 * React Query hook to fetch a specific workflow data
 *

 * @returns React Query result with workflow  data
 *
 */
export const useWorkflowById = () => {
  const { currentOS } = useOSStore()
  const selectedEndpoint = currentOS?.endpoint_url ?? null

  const { selectedId, type } = usePlaygroundQueries()
  return useQuery({
    queryKey: [CACHE_KEYS.PLAYGROUND_WORKFLOW(selectedId ?? '')],
    queryFn: async () => {
      if (!selectedId || !selectedEndpoint || type !== FilterType.Workflows) {
        throw new Error('Missing required parameters')
      }

      try {
        const response = await getWorkflow(selectedEndpoint, selectedId)
        return response?.body || null
      } catch (error) {
        logError(error as Error)
        throw error
      }
    },
    enabled: Boolean(
      selectedId && selectedEndpoint && type === FilterType.Workflows
    ),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2
  })
}

export default useWorkflowById
