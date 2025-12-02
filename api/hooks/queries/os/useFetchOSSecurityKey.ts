import { useQuery } from '@tanstack/react-query'
import { CACHE_KEYS } from '@/constants'
import { useCurrentOrganization } from '@/api/hooks/queries'
import { toast } from '@/components/ui/toast'
import { OperatingSystemSecurityKeysService } from '@/api/generated'

export const useFetchOSSecurityKey = (osId: string) => {
  const { data: currentOrganization } = useCurrentOrganization()

  const query = useQuery({
    queryKey: CACHE_KEYS.OS_SECURITY_KEY(osId),
    queryFn: async () => {
      try {
        if (!osId) {
          throw new Error('AgentOS ID not provided')
        }

        const securityKey =
          await OperatingSystemSecurityKeysService.listSecurityKeysEndpointOperatingSystemsOsIdSecurityKeysGet(
            {
              osId: osId
            }
          )

        return securityKey
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Failed to load AgentOS security key'
        toast.error({
          description: message,

          id: 'os-security-key-error'
        })
        throw err
      }
    },
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days - for persistence
    enabled: !!currentOrganization?.id && !!osId,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    meta: {
      persist: true
    }
  })

  return query
}
