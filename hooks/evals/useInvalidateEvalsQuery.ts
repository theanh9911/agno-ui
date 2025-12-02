import { CACHE_KEYS, CACHE_KEY_PREFIX } from '@/constants'
import { useSearchParams } from 'react-router-dom'
import { useInvalidateQuery } from '@/hooks/useInvalidateQuery'
import { useEvaluationStore } from '@/stores/EvaluationStore'
import { EvalRunType } from '@/types/evals'
import { useOSStore } from '@/stores/OSStore'
import { SortBy } from '@/types/filter'
import { useDatabase } from '@/providers/DatabaseProvider/DatabaseProvider'
import { useSortBy } from '../useSortBy'

export const useInvalidateEvalsQuery = () => {
  const { invalidateQuery } = useInvalidateQuery()
  const { page, limit } = useEvaluationStore()
  const { selectedDatabase } = useDatabase()
  const dbId = selectedDatabase.evals?.db?.db_id ?? ''
  const table = selectedDatabase.evals?.table || ''
  const { currentOS } = useOSStore()
  const OSId = currentOS?.id ?? null

  const [searchParams] = useSearchParams()
  const { sortBy } = useSortBy()

  const componentType = searchParams.get('type') || 'all'

  const viewFilters = searchParams.get('view_filters') || ''

  // Transform query parameters into filter values
  const type =
    componentType === 'agents'
      ? ('agent' as const)
      : componentType === 'teams'
        ? ('team' as const)
        : undefined

  const eval_type = viewFilters
    ? (viewFilters
        ?.split(',')
        ?.filter((filter: string) =>
          Object.values(EvalRunType).includes(filter as EvalRunType)
        ) as Array<EvalRunType>)
    : undefined

  const model_id = viewFilters
    ? viewFilters
        .split(',')
        .filter((filter: string) => filter.startsWith('model_'))
        ?.map((filter: string) => filter.replace('model_', ''))
        ?.join(',')
    : undefined

  const sort_by = sortBy as
    | SortBy.UPDATED_AT_ASC
    | SortBy.UPDATED_AT_DESC
    | undefined

  // Invalidate specific current page
  const invalidateCurrentPage = async () => {
    if (!OSId || !dbId) return

    const queryKey = CACHE_KEYS.EVALS_RUNS({
      OSId,
      dbId,
      page,
      limit,
      model_id,
      eval_type,
      type,
      sort_by,
      table
    })

    await invalidateQuery({
      queryKey,
      refetchType: 'all'
    })
  }

  // Invalidate all evals cache entries
  const invalidateAllEvals = async () => {
    if (!OSId || !dbId) return

    await invalidateQuery({
      queryKey: [CACHE_KEY_PREFIX.EVALS_RUNS, OSId, dbId],
      exact: false
    })
  }

  return {
    invalidateCurrentPage,
    invalidateAllEvals
  }
}
