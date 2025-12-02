import { useMutation } from '@tanstack/react-query'
import { useInvalidateQuery } from '../../../../hooks/useInvalidateQuery'
import { CACHE_KEYS } from '@/constants'
import { toast } from '@/components/ui/toast'
import {
  OperatingSystemsService,
  OSCreateRequest,
  OSResponse
} from '@/api/generated'

export const useAddOS = () => {
  const { invalidateQuery } = useInvalidateQuery()

  return useMutation<OSResponse, Error, { requestBody: OSCreateRequest }>({
    mutationFn: async ({ requestBody }: { requestBody: OSCreateRequest }) => {
      const response = await OperatingSystemsService.operatingSystemsCreate({
        requestBody
      })
      return response
    },
    onSuccess: async (newOS) => {
      const queryKeyList = CACHE_KEYS.OS_LIST(newOS?.org_id || '')

      await invalidateQuery({
        queryKey: queryKeyList
      })

      toast.success({
        description: 'AgentOS Added successfully'
      })
    },
    onError: (error: Error) => {
      toast.error({
        description: error?.message || 'Failed to add AgentOS'
      })
    }
  })
}
