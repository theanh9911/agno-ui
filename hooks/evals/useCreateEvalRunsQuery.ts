import { CreateEvalRunPayload, createEvalRun } from '@/api/evals'
import { useMutation } from '@tanstack/react-query'
import { useOSStore } from '@/stores/OSStore'
import { useEvaluationStore } from '@/stores/EvaluationStore'
import { toast } from '@/components/ui/toast'
import { useInvalidateEvalsQuery } from './useInvalidateEvalsQuery'
import { useDatabase } from '@/providers/DatabaseProvider/DatabaseProvider'

export const useCreateEvalRunsQuery = () => {
  const { currentOS } = useOSStore()
  const endpoint = currentOS?.endpoint_url ?? null
  const { selectedDatabase } = useDatabase()
  const dbId = selectedDatabase.evals?.db?.db_id ?? ''
  const table = selectedDatabase.evals?.table || ''
  const { invalidateAllEvals } = useInvalidateEvalsQuery()
  const { pendingEvaluations, setPendingEvaluations } = useEvaluationStore()

  const createEvalRunMutation = useMutation({
    mutationFn: async (
      options: Omit<CreateEvalRunPayload, 'url' | 'db_id'>
    ) => {
      if (!endpoint) {
        throw new Error('API endpoint not set')
      }
      if (!dbId) {
        throw new Error('Database not set')
      }
      const response = await createEvalRun({
        ...options,
        url: endpoint,
        db_id: dbId,
        table: table
      })
      return response.body
    },
    onSuccess: () => {
      invalidateAllEvals()
      toast.success({
        description: 'Evaluation run created successfully'
      })
    },
    onError: () => {
      toast.error({
        description: 'Failed to create evaluation run'
      })
    },
    onSettled: (_, __, variables) => {
      setPendingEvaluations(
        pendingEvaluations.filter(
          (evaluation) => evaluation.id !== variables?.id
        )
      )
    }
  })

  return createEvalRunMutation
}
