import { useQuery } from '@tanstack/react-query'
import { toast } from '@/components/ui/toast'
import { CACHE_KEYS } from '@/constants'
import { getPlaygroundTeamsAPI } from '@/api/playgroundTeams'
import { useFetchOSStatus } from '../os'
import { useOSStore } from '@/stores/OSStore'
import { TeamDetails } from '@/types/os'

/**
 * Hook to fetch teams for a given endpoint
 * @param endpoint - The endpoint URL
 * @returns Query result containing teams data
 */
export const useTeamsQuery = () => {
  const { data: isOsAvailable } = useFetchOSStatus()
  const { currentOS } = useOSStore()
  const endpoint = currentOS?.endpoint_url ?? null
  return useQuery<TeamDetails[]>({
    queryKey: CACHE_KEYS.PLAYGROUND_TEAMS(endpoint),
    queryFn: async () => {
      try {
        const response = await getPlaygroundTeamsAPI(endpoint ?? '')
        const teams = response.body
        return teams
      } catch {
        toast.error({
          description: 'Failed to fetch teams'
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
