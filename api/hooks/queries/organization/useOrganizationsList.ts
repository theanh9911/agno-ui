import { useQuery } from '@tanstack/react-query'
import { UsersService } from '@/api/generated'
import { CACHE_KEYS } from '@/constants'

export const useOrganizationsList = () => {
  return useQuery({
    queryKey: CACHE_KEYS.ORGANIZATION_CACHE_KEYS.ORGANIZATIONS_LIST,
    queryFn: () => UsersService.usersGetOrganizations()
  })
}
