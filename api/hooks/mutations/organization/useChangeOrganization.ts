import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UsersService } from '@/api/generated/services/UsersService'
import { CACHE_KEYS } from '@/constants'
import { toast } from '@/components/ui/toast'

export const useChangeOrganization = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (orgId: string) => {
      return await UsersService.usersSetCurrentOrganization({
        requestBody: { organization_id: orgId }
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CACHE_KEYS.AUTH_CACHE_KEYS.USER
      })

      queryClient.invalidateQueries({
        queryKey: CACHE_KEYS.ORGANIZATION_CACHE_KEYS.CURRENT_ORGANIZATION
      })
    },
    onError: () => {
      toast.error({
        description: 'Error changing organization'
      })
    }
  })
}
