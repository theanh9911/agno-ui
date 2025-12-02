import { useQuery } from '@tanstack/react-query'
import { getOsConfig } from '@/api/system'

import { useOSStore } from '@/stores/OSStore'
import { CACHE_KEYS } from '@/constants'
import { useFetchOSStatus } from './useFetchOSStatus'
import { useQueryClient } from '@tanstack/react-query'
import { useUser, useFetchOSSecurityKey } from '@/api/hooks'
import { configureSDK } from '@/utils/request'

export const useFetchOSConfig = () => {
  const { data } = useUser()
  const user = data?.user
  const { data: isOsAvailable, isFetched: isOsStatusFetched } =
    useFetchOSStatus()
  const userId = user?.user_id
  const currentOS = useOSStore((state) => state.currentOS)
  const getCustomHeaders = useOSStore((state) => state.getCustomHeaders)
  const queryClient = useQueryClient()
  const {
    data: securityKey,
    isFetched: isSecurityKeyFetched,
    isFetching: isSecurityKeyFetching
  } = useFetchOSSecurityKey(currentOS?.id || '')
  const query = useQuery({
    queryKey: CACHE_KEYS.OS_CONFIG(currentOS?.id || null),
    queryFn: async () => {
      // Double-check enabled conditions in queryFn to prevent forced refetches
      if (!userId) {
        throw new Error('User not found')
      }
      if (!currentOS?.id || !currentOS?.endpoint_url) {
        throw new Error('API endpoint not set')
      }
      if (!isOsAvailable || !isOsStatusFetched) {
        throw new Error('OS status not ready')
      }

      // Configure SDK with the security key and custom headers
      const keyValue = securityKey?.security_keys?.[0]?.key_value
      const customHeaders = getCustomHeaders(currentOS.id)
      configureSDK(keyValue, customHeaders)

      try {
        const response = await getOsConfig(currentOS?.endpoint_url)
        return response.body
      } catch {
        // Clear the cache immediately when API fails
        queryClient.removeQueries({
          queryKey: CACHE_KEYS.OS_CONFIG(currentOS?.id || null)
        })

        return undefined
      }
    },
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days - for persistence
    enabled: Boolean(
      !!userId &&
        !!currentOS?.id &&
        !!isOsAvailable &&
        isOsStatusFetched &&
        isSecurityKeyFetched &&
        !isSecurityKeyFetching
    ),
    refetchOnWindowFocus: false,
    refetchOnMount: false,

    meta: {
      persist: true
    }
  })

  return query
}
