import { useQuery } from '@tanstack/react-query'

import { CACHE_KEYS } from '@/constants'
import { getEvalsRuns } from '@/api/evals'
import { logError } from '@/utils/error'
import { APIError } from '@/api/errors/APIError'
import { useEvaluationStore } from '@/stores/EvaluationStore'
import { useEffect } from 'react'
import { toast } from '@/components/ui/toast'
import { useSearchParams } from 'react-router-dom'
import { EvalRunType } from '@/types/evals'
import { useOSStore } from '@/stores/OSStore'
import { useFetchOSStatus } from '../os'
import { useSortBy } from '../useSortBy'
import { SortBy } from '@/types/filter'
import { useDatabase } from '@/providers/DatabaseProvider/DatabaseProvider'

export const useEvalsRunsQuery = () => {
  const { currentOS } = useOSStore()
  const endpoint = currentOS?.endpoint_url ?? null
  const OSId = currentOS?.id ?? null
  const { page, limit, updatePaginationFromResponse } = useEvaluationStore()
  const { selectedDatabase } = useDatabase()
  const dbId = selectedDatabase.evals?.db?.db_id ?? ''
  const table = selectedDatabase.evals?.table || ''
  const { sortBy, getSortBy, getSortOrder } = useSortBy()
  const { data: isOsAvailable } = useFetchOSStatus()

  const [searchParams] = useSearchParams()

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

  const query = useQuery({
    queryKey: CACHE_KEYS.EVALS_RUNS({
      OSId,
      dbId,
      table,
      page,
      limit,
      model_id,
      eval_type,
      type,
      sort_by
    }),
    queryFn: async () => {
      if (!endpoint) {
        throw new Error('API endpoint not set')
      }
      if (!dbId) {
        throw new Error('Database not set')
      }

      const response = await getEvalsRuns({
        options: {
          url: endpoint,
          db_id: dbId,
          page,
          limit,
          model_id,
          eval_type,
          type,
          sort_by: getSortBy,
          sort_order: getSortOrder,
          table: table
        }
      })

      if (response.body?.meta) {
        updatePaginationFromResponse({
          page: response.body.meta.page ?? null,
          limit: response.body.meta.limit,
          total_pages: response.body.meta.total_pages ?? null,
          total_count: response.body.meta.total_count ?? null
        })
      }

      return (
        response.body ?? {
          data: [],
          meta: { page: null, limit, total_pages: null }
        }
      )
    },
    enabled: page > 0 && limit > 0 && !!isOsAvailable && !!endpoint && !!dbId,
    retry: 1
  })

  useEffect(() => {
    if (query.error) {
      logError(query.error as APIError)
      toast.error({
        description:
          query.error instanceof Error
            ? query.error.message
            : 'An error occurred',
        id: 'eval-fetch-error'
      })
    }
  }, [query.error])

  // Calculate available models for filters
  const availableModels = query.data?.data
    ? query.data.data
        .filter((evaluation) => evaluation.model_id)
        .map((evaluation) => ({
          model_id: evaluation.model_id,
          model_provider: evaluation.model_provider
        }))
    : []

  return {
    ...query,
    availableModels
  }
}
