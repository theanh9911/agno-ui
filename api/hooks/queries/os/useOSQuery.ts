import { useQuery } from '@tanstack/react-query'

import { CACHE_KEYS } from '@/constants'
import { OperatingSystemsService } from '@/api/generated'
import { useUser } from '@/api/hooks/queries'

export const useOSQuery = () => {
  const { data } = useUser()
  const currentUser = data?.user
  return useQuery({
    queryKey: [CACHE_KEYS.OS_LIST(currentUser?.current_organization_id || '')],
    queryFn: async () => {
      const response = await OperatingSystemsService.operatingSystemsList()

      return response
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 5,
    enabled: !!currentUser?.current_organization_id,
    meta: {
      persist: true
    }
  })
}
