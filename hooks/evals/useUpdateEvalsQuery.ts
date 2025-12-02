import { updateEvalsRuns } from '@/api/evals'
import { useMutation } from '@tanstack/react-query'

import { toast } from '@/components/ui/toast'

import { useInvalidateEvalsQuery } from '@/hooks/evals/useInvalidateEvalsQuery'
import { useOSStore } from '@/stores/OSStore'
import { useDatabase } from '@/providers/DatabaseProvider/DatabaseProvider'

interface UpdateEvalsOptions {
  eval_run_id: string
  eval_run_name: string
}

export const useUpdateEvalsQuery = () => {
  const { invalidateAllEvals } = useInvalidateEvalsQuery()
  const { currentOS } = useOSStore()
  const endpoint = currentOS?.endpoint_url ?? null
  const { selectedDatabase } = useDatabase()
  const dbId = selectedDatabase.evals?.db?.db_id ?? ''
  const table = selectedDatabase.evals?.table || ''

  const updateEvalsMutation = useMutation({
    mutationFn: async (options: UpdateEvalsOptions) => {
      if (!endpoint) {
        throw new Error('API endpoint not set')
      }
      if (!dbId) {
        throw new Error('Database not set')
      }
      const response = await updateEvalsRuns({
        url: endpoint,
        db_id: dbId,
        eval_run_id: options.eval_run_id,
        eval_run_name: options.eval_run_name,
        table: table
      })
      return response.body
    },
    onSuccess: async () => {
      try {
        // Invalidate all evals to refresh the list across all pages
        invalidateAllEvals()

        toast.success({
          description: 'Evaluation updated successfully'
        })
      } catch {
        toast.error({
          description: 'Failed to update evaluation'
        })
      }
    },
    onError: () => {
      toast.error({
        description: 'Failed to update evaluation'
      })
    }
  })

  return updateEvalsMutation
}
