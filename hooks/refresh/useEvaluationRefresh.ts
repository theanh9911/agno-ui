import { useCallback } from 'react'
import { useInvalidateEvalsQuery } from '@/hooks/evals/useInvalidateEvalsQuery'

export const useEvaluationRefresh = () => {
  const { invalidateCurrentPage: invalidateEvals } = useInvalidateEvalsQuery()

  const refresh = useCallback(async () => {
    await invalidateEvals()
  }, [invalidateEvals])

  return refresh
}
