import { createMemory, type CreateMemoryPayload } from '@/api/memory'
import { useMutation } from '@tanstack/react-query'
import { toast } from '@/components/ui/toast'
import { useOSStore } from '@/stores/OSStore'
import { useInvalidateMemoryQuery } from './useInvalidateMemoryQuery'
import { useDatabase } from '@/providers/DatabaseProvider'
import { extractUserIdFromUrl } from '@/components/pages/MemoryPage/utils'

export const useCreateMemory = () => {
  const { invalidateUsersCurrentPage, invalidateCurrentPage } =
    useInvalidateMemoryQuery()
  const { currentOS } = useOSStore()
  const { selectedDatabase } = useDatabase()
  const dbId = selectedDatabase.memory?.db?.db_id ?? ''
  const table = selectedDatabase.memory?.table || ''
  const userId = extractUserIdFromUrl()
  const mutation = useMutation({
    mutationFn: async (payload: CreateMemoryPayload) => {
      if (!currentOS?.id) {
        throw new Error('AgentOS not available')
      }
      if (!currentOS.endpoint_url) {
        throw new Error('AgentOS endpoint not set')
      }
      const response = await createMemory(
        currentOS.endpoint_url,
        payload,
        dbId,
        table
      )
      return { data: response.body, payload }
    },
    onSuccess: (result) => {
      // When creating a memory for a specific user, invalidate both the current page and the users list
      invalidateCurrentPage(result.payload.user_id) // This will use the userId from URL params if we're in a user's view
      if (!userId) {
        invalidateUsersCurrentPage()
      }
      toast.success({
        description: 'Memory created successfully'
      })
    },
    onError: () => {
      toast.error({
        description: 'Failed to create memory'
      })
    }
  })

  return mutation
}
