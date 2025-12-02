import { useQuery } from '@tanstack/react-query'
import { toast } from '@/components/ui/toast'

import { getPlaygroundAgentsAPI } from '@/api/playgroundAgents'
import { CACHE_KEYS } from '@/constants'
import { useFetchOSStatus } from '../os'
import { useOSStore } from '@/stores/OSStore'
import { AgentDetails } from '@/types/os'

export const useAgentsQuery = () => {
  const { currentOS } = useOSStore()
  const endpoint = currentOS?.endpoint_url ?? null
  const { data: isOsAvailable } = useFetchOSStatus()

  return useQuery<AgentDetails[]>({
    queryKey: CACHE_KEYS.AGENTS(endpoint),
    queryFn: async () => {
      try {
        const response = await getPlaygroundAgentsAPI(endpoint ?? '')
        const agents = response.body
        return agents
      } catch {
        toast.error({
          description: 'Failed to fetch agents'
        })
        return []
      }
    },
    enabled: !!isOsAvailable && !!endpoint,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2
  })
}
