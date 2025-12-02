import { useCallback } from 'react'
import { useInvalidateQuery } from '@/hooks/useInvalidateQuery'
import { CACHE_KEYS } from '@/constants'
import { useOSStore } from '@/stores/OSStore'
import { useSessionStore } from '@/stores/SessionsStore'
import { useDatabase } from '@/providers/DatabaseProvider/DatabaseProvider'
import { useSearchParams } from '@/utils/navigation'
import { useSortBy } from '@/hooks/useSortBy'
import { useFilterType } from '@/hooks/useFilterType'
import { FilterType } from '@/types/filter'

export const useSessionsRefresh = () => {
  const { invalidateQuery } = useInvalidateQuery()
  const { currentOS } = useOSStore()
  const searchParams = useSearchParams()
  const { getSortOrder } = useSortBy()
  const { isTeam, isWorkflow } = useFilterType({ autoSetDefault: false })
  const sessionType = searchParams?.get('type') || FilterType.Agents
  const teamPage = useSessionStore((state) => state.teamPage)
  const agentPage = useSessionStore((state) => state.agentPage)
  const workflowPage = useSessionStore((state) => state.workflowPage)
  const sessionCurrentPage = isTeam
    ? teamPage
    : isWorkflow
      ? workflowPage
      : agentPage
  const sessionPageSize = useSessionStore((state) => state.pageSize)
  const { selectedDatabase } = useDatabase()
  const sessionDbId = selectedDatabase?.session?.db?.db_id || ''
  const sessionTable = selectedDatabase?.session?.table || ''

  const refresh = useCallback(async () => {
    await invalidateQuery({
      queryKey: [
        CACHE_KEYS.ALL_SESSIONS(
          sessionCurrentPage,
          sessionPageSize,
          sessionType,
          currentOS?.id ?? '',
          sessionDbId,
          getSortOrder ?? '',
          sessionTable
        )
      ]
    })
  }, [
    invalidateQuery,
    sessionCurrentPage,
    sessionPageSize,
    sessionType,
    currentOS?.id,
    sessionDbId,
    getSortOrder,
    sessionTable
  ])

  return refresh
}
