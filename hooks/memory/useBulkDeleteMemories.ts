import { bulkDeleteMemories } from '@/api/memory'
import { useMutation } from '@tanstack/react-query'
import { toast } from '@/components/ui/toast'
import { useInvalidateMemoryQuery } from './useInvalidateMemoryQuery'
import { useOSStore } from '@/stores/OSStore'
import { useDatabase } from '@/providers/DatabaseProvider/DatabaseProvider'

interface BulkDeleteMemoriesOptions {
  memory_ids: string[]
}

export const useBulkDeleteMemories = () => {
  const { invalidateAllMemories } = useInvalidateMemoryQuery()
  const { currentOS } = useOSStore()
  const { selectedDatabase } = useDatabase()
  const dbId = selectedDatabase?.memory?.db?.db_id ?? ''
  const table = selectedDatabase.memory?.table || ''
  // Return null if required dependencies are missing
  if (!currentOS?.id || !selectedDatabase?.memory || !currentOS?.endpoint_url) {
    return null
  }

  const bulkDeleteMutation = useMutation({
    mutationFn: async (options: BulkDeleteMemoriesOptions) => {
      if (!currentOS?.endpoint_url) {
        throw new Error('Missing endpoint URL')
      }
      const response = await bulkDeleteMemories(
        currentOS?.endpoint_url,
        options.memory_ids,
        dbId,
        table
      )
      return response.body
    },
    onSuccess: async () => {
      try {
        // Invalidate all memories to refresh the list across all pages
        invalidateAllMemories()

        toast.success({
          description: 'Memories deleted successfully'
        })
      } catch {
        toast.error({
          description: 'Failed to delete memories'
        })
      }
    },
    onError: () => {
      toast.error({
        description: 'Failed to delete memories'
      })
    }
  })

  return bulkDeleteMutation
}
