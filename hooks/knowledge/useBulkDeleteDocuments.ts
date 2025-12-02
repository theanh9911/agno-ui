import { useInvalidateKnowledgeQuery } from './useInvalidateKnowledgeQuery'
import { useOSStore } from '@/stores/OSStore'
import { useMutation } from '@tanstack/react-query'
import { deleteDocument } from '@/api/knowledge'
import { toast } from '@/components/ui/toast'
import { useDatabase } from '@/providers/DatabaseProvider/DatabaseProvider'

export function useBulkDeleteDocuments() {
  const { invalidateAllKnowledge } = useInvalidateKnowledgeQuery()
  const { currentOS } = useOSStore()
  const { selectedDatabase } = useDatabase()
  const dbId = selectedDatabase?.knowledge?.db?.db_id || ''
  const table = selectedDatabase.knowledge?.table || ''
  return useMutation({
    mutationFn: async (documentIds: string[]) => {
      // Delete documents one by one (assuming no bulk delete API endpoint)
      const deletePromises = documentIds.map(async (documentId) => {
        const response = await deleteDocument(
          currentOS?.endpoint_url || '',
          dbId,
          documentId,
          table
        )
        return response.body
      })

      return await Promise.all(deletePromises)
    },
    onSuccess: (_, documentIds) => {
      invalidateAllKnowledge()
      toast.success({
        description: `${documentIds.length} documents deleted successfully`
      })
    },
    onError: (error: Error) => {
      toast.error({
        description: error?.message || 'Failed to delete documents'
      })
    }
  })
}
