import { deleteEvalsRuns } from '@/api/evals'
import { useMutation } from '@tanstack/react-query'
import { toast } from '@/components/ui/toast'
import { useInvalidateEvalsQuery } from '@/hooks/evals/useInvalidateEvalsQuery'
import { useOSStore } from '@/stores/OSStore'
import { useDatabase } from '@/providers/DatabaseProvider/DatabaseProvider'

interface DeleteEvalsOptions {
  eval_run_ids: string[]
}

export const useDeleteEvalsQuery = () => {
  const { invalidateAllEvals } = useInvalidateEvalsQuery()
  const { currentOS } = useOSStore()
  const endpoint = currentOS?.endpoint_url ?? null
  const { selectedDatabase } = useDatabase()
  const dbId = selectedDatabase.evals?.db?.db_id ?? ''
  const table = selectedDatabase.evals?.table || ''
  const deleteEvalsMutation = useMutation({
    mutationFn: async (options: DeleteEvalsOptions) => {
      if (!endpoint) {
        throw new Error('API endpoint not set')
      }
      if (!dbId) {
        throw new Error('Database not set')
      }
      const response = await deleteEvalsRuns({
        url: endpoint,
        db_id: dbId,

        ...options,
        table: table
      })
      return response.body
    },
    onSuccess: async () => {
      try {
        // Invalidate all evals to refresh the list across all pages
        invalidateAllEvals()

        toast.success({
          description: 'Evaluation deleted successfully'
        })
      } catch {
        toast.error({
          description: 'Failed to delete evaluation'
        })
      }
    },
    onError: () => {
      toast.error({
        description: 'Failed to delete evaluation'
      })
    }
  })

  return deleteEvalsMutation
}
