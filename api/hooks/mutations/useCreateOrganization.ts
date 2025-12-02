import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/components/ui/toast'
import {
  OrganizationContextService,
  OrganizationCreateRequest
} from '@/api/generated'
import { CACHE_KEYS } from '@/constants'

interface UseCreateOrganizationOptions {
  showSuccessToast?: boolean
}

export const useCreateOrganization = (
  options: UseCreateOrganizationOptions = {}
) => {
  const { showSuccessToast = true } = options
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: OrganizationCreateRequest) => {
      if (!payload.name) {
        throw new Error('Organization name is required')
      }
      const response = await OrganizationContextService.orgCreate({
        requestBody: payload
      })
      return response
    },
    onSuccess: () => {
      if (showSuccessToast) {
        toast.success({
          description: 'Organization created successfully'
        })
      }

      queryClient.invalidateQueries({
        queryKey: CACHE_KEYS.ORGANIZATION_CACHE_KEYS.ORGANIZATIONS_LIST
      })

      queryClient.invalidateQueries({
        queryKey: CACHE_KEYS.ORGANIZATION_CACHE_KEYS.CURRENT_ORGANIZATION
      })
    },
    onError: () => {
      toast.error({
        description: 'Failed to create organization'
      })
    }
  })
}
