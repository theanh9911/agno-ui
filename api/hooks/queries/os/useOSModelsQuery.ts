import { useQuery } from '@tanstack/react-query'

import { CACHE_KEYS } from '@/constants'
import { useOSStore } from '@/stores/OSStore'
import { getOSModelsAPI } from '@/api/system'
import { useFetchOSStatus } from '@/hooks/os'

export const useOSModelsQuery = () => {
  const currentOS = useOSStore((state) => state.currentOS)
  const { data: isOsAvailable } = useFetchOSStatus()
  return useQuery({
    queryKey: CACHE_KEYS.OS_MODELS(currentOS?.id || null),
    queryFn: async () => {
      const endpoint = currentOS?.endpoint_url ?? null
      if (!endpoint) {
        throw new Error('No AgentOS selected')
      }

      const response = await getOSModelsAPI(endpoint)
      return response.body
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 5,
    enabled: !!currentOS?.id && !!isOsAvailable,
    meta: {
      persist: true
    }
  })
}
