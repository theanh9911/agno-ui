import { useMutation } from '@tanstack/react-query'
import { toast } from '@/components/ui/toast'
import { useInvalidateKnowledgeQuery } from './useInvalidateKnowledgeQuery'
import { useOSStore } from '@/stores/OSStore'
import { deleteDocument } from '@/api/knowledge'
import { useDatabase } from '@/providers/DatabaseProvider/DatabaseProvider'

export function useDeleteDocumentById() {
  const { invalidateAllKnowledge } = useInvalidateKnowledgeQuery()
  const { currentOS } = useOSStore()
  const { selectedDatabase } = useDatabase()
  const dbId = selectedDatabase?.knowledge?.db?.db_id ?? ''
  const table = selectedDatabase.knowledge?.table || ''

  return useMutation({
    mutationFn: async (documentId: string) => {
      const response = await deleteDocument(
        currentOS?.endpoint_url || '',
        dbId,
        documentId,
        table
      )
      return response.body
    },
    onSuccess: () => {
      invalidateAllKnowledge()
      toast.success({
        description: 'Document deleted successfully'
      })
    },
    onError: (error: Error) => {
      toast.error({
        description: error?.message || 'Failed to delete document'
      })
    }
  })
}
