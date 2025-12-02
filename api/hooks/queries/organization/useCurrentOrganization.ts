import { useQuery } from '@tanstack/react-query'
import { OrganizationContextService } from '@/api/generated'
import { CACHE_KEYS } from '@/constants'

export const useCurrentOrganization = () => {
  return useQuery({
    queryKey: CACHE_KEYS.ORGANIZATION_CACHE_KEYS.CURRENT_ORGANIZATION,
    queryFn: () => OrganizationContextService.orgGetCurrent()
  })
}
