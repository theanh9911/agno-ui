import { useQuery } from '@tanstack/react-query'
import { getOsConfigStatus } from '@/api/system'
import { useOSStore } from '@/stores/OSStore'
import { CACHE_KEYS } from '@/constants'
import { useCurrentOrganization } from '@/api/hooks/queries/organization/useCurrentOrganization'
import { toast } from '@/components/ui/toast'
import { useFetchOSSecurityKey } from '@/api/hooks'
import { configureSDK } from '@/utils/request'

export const useFetchOSStatus = () => {
  const currentOS = useOSStore((state) => state.currentOS)
  const getCustomHeaders = useOSStore((state) => state.getCustomHeaders)
  const { data: currentOrganization } = useCurrentOrganization()
  const {
    data: securityKey,
    isFetched: isSecurityKeyFetched,
    isFetching: isSecurityKeyFetching
  } = useFetchOSSecurityKey(currentOS?.id || '')

  return useQuery<boolean>({
    queryKey: CACHE_KEYS.OS_CONFIG_STATUS(currentOS?.id || null),
    queryFn: async () => {
      if (!currentOS?.id || !currentOS?.endpoint_url) {
        throw new Error('AgentOS endpoint not set')
      }

      // Configure SDK with the security key and custom headers
      const keyValue = securityKey?.security_keys?.[0]?.key_value
      const customHeaders = getCustomHeaders(currentOS.id)
      configureSDK(keyValue, customHeaders)

      try {
        const response = await getOsConfigStatus(currentOS?.endpoint_url)
        const isAvailable = response.body?.status === 'ok'
        return isAvailable
      } catch {
        toast.error({
          description: 'Failed to connect to the AgentOS',
          id: 'os-status-fetch-error'
        })
        return false
      }
    },
    enabled:
      !!currentOrganization?.id &&
      !!currentOS?.id &&
      isSecurityKeyFetched &&
      !isSecurityKeyFetching,
    retry: 1,
    // Treat data as immediately stale to force a new call on usage
    staleTime: 0
  })
}
