import { toast } from '@/components/ui/toast'
import { useMutation } from '@tanstack/react-query'

import { useInvalidateQuery } from '../../../../hooks/useInvalidateQuery'
import { CACHE_KEYS } from '@/constants'
import { OperatingSystemsService, OSUpdateRequest } from '@/api/generated'

export const useUpdateOSDetails = () => {
  const { invalidateQuery } = useInvalidateQuery()

  return useMutation({
    mutationFn: async ({
      osId,
      payload
    }: {
      osId: string
      payload: OSUpdateRequest
    }) => {
      const response = await OperatingSystemsService.operatingSystemsUpdate({
        osId,
        requestBody: payload
      })

      return response
    },
    onSuccess: (updatedOS) => {
      invalidateQuery({
        queryKey: CACHE_KEYS.OS_LIST(updatedOS?.org_id || '')
      })

      toast.success({
        description: 'AgentOS updated successfully'
      })
    },
    onError: (error: Error) => {
      toast.error({
        description: error?.message || 'Failed to update AgentOS'
      })
    }
  })
}
