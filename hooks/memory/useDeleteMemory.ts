import { deleteMemory } from '@/api/memory'
import { useMutation } from '@tanstack/react-query'
import { toast } from '@/components/ui/toast'
import { useOSStore } from '@/stores/OSStore'
import { useInvalidateMemoryQuery } from './useInvalidateMemoryQuery'
import { useDatabase } from '@/providers/DatabaseProvider'

export const useDeleteMemory = () => {
  const { invalidateAllMemories } = useInvalidateMemoryQuery()
  const { currentOS } = useOSStore()
  const { selectedDatabase } = useDatabase()
  const dbId = selectedDatabase?.memory?.db?.db_id ?? ''
  const table = selectedDatabase.memory?.table || ''
  // Return null if required dependencies are missing
  if (!currentOS?.id || !selectedDatabase?.memory) {
    return null
  }

  const mutation = useMutation({
    mutationFn: async (memoryId: string) => {
      if (!currentOS?.endpoint_url) {
        throw new Error('Missing endpoint URL')
      }
      const response = await deleteMemory(
        currentOS.endpoint_url,
        memoryId,
        dbId,
        table
      )
      return { response, memoryId }
    },
    onSuccess: ({ response }) => {
      if (response.status === 204) {
        invalidateAllMemories()
        toast.success({
          description: 'Memory deleted successfully'
        })
      }
    },
    onError: () => {
      toast.error({
        description: 'Failed to delete memory'
      })
    }
  })

  return mutation
}
