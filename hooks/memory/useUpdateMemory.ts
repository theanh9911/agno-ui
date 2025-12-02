import { updateMemory, type UpdateMemoryPayload } from '@/api/memory'
import { useMutation } from '@tanstack/react-query'
import { toast } from '@/components/ui/toast'
import { useOSStore } from '@/stores/OSStore'
import { useInvalidateMemoryQuery } from './useInvalidateMemoryQuery'
import { useDatabase } from '@/providers/DatabaseProvider'

export const useUpdateMemory = () => {
  const { invalidateAllMemories } = useInvalidateMemoryQuery()
  const { currentOS } = useOSStore()
  const { selectedDatabase } = useDatabase()
  const dbId = selectedDatabase?.memory?.db?.db_id ?? ''
  const table = selectedDatabase.memory?.table || ''

  const mutation = useMutation({
    mutationFn: async ({
      memoryId,
      payload
    }: {
      memoryId: string
      payload: UpdateMemoryPayload
    }) => {
      if (!currentOS?.id) {
        throw new Error('AgentOS not available')
      }
      if (!currentOS?.endpoint_url) {
        throw new Error('Missing endpoint URL')
      }

      const response = await updateMemory(
        currentOS.endpoint_url,
        memoryId,
        payload,
        dbId,
        table
      )
      return { data: response.body, memoryId, payload }
    },
    onSuccess: () => {
      invalidateAllMemories()
      toast.success({
        description: 'Memory updated successfully'
      })
    },
    onError: () => {
      toast.error({
        description: 'Failed to update memory'
      })
    }
  })

  return mutation
}
