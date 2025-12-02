import { useQuery } from '@tanstack/react-query'
import { toast } from '@/components/ui/toast'

import { getWorkflowsAPI } from '@/api/workflow'
import { CACHE_KEYS } from '@/constants'
import { useOSStore } from '@/stores/OSStore'
import { useFetchOSStatus } from '@/hooks/os'
import { logError } from '@/utils/error'

export const useWorkflows = () => {
  const { currentOS } = useOSStore()
  const { data: isOsAvailable } = useFetchOSStatus()

  const OSId = currentOS?.id ?? null
  const endpoint = currentOS?.endpoint_url ?? null

  return useQuery({
    queryKey: [CACHE_KEYS.PLAYGROUND_WORKFLOWS(OSId ?? '')],
    queryFn: async () => {
      if (!endpoint) {
        throw new Error('API endpoint not set')
      }

      try {
        const response = await getWorkflowsAPI(endpoint)

        const workflows = response.body || []

        return workflows
      } catch (error) {
        logError(error as Error)
        toast.error({
          description: 'Failed to fetch workflows'
        })
      }
    },
    enabled: !!endpoint && !!OSId && !!isOsAvailable,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2
  })
}

export default useWorkflows
