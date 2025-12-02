import { useInfiniteQuery } from '@tanstack/react-query'
import { getSessionsListAPI } from '@/api/agent'
import { logError } from '@/utils/error'

import { usePlaygroundQueries } from './usePlaygroundQueries'
import { CACHE_KEYS } from '@/constants'
import { useOSStore } from '@/stores/OSStore'
import { useUser } from '@/api/hooks/queries'
import { useAgentsQuery } from '@/hooks/playground/useAgentsQuery'
import { FilterType } from '@/types/filter'
import { useTeamsQuery } from './useTeamsQuery'
import { useFilterType } from '@/hooks/useFilterType'
import { useWorkflows } from '@/hooks/workflows/useWorkflows'
import { useFetchOSStatus } from '@/hooks/os'

const SESSIONS_LIMIT = 20

export default function useFetchPlaygroundSessions() {
  const { isTeam, isWorkflow } = useFilterType()
  const { currentOS } = useOSStore()
  const selectedEndpoint = currentOS?.endpoint_url ?? null
  const { data: user } = useUser()
  const { selectedId } = usePlaygroundQueries()
  const { data: agents } = useAgentsQuery()
  const { data: teams } = useTeamsQuery()
  const { data: workflows } = useWorkflows()
  const { data: isOsAvailable } = useFetchOSStatus()
  const OSId = currentOS?.id ?? null

  // Get db_id from selectedId for agents, teams, or workflows
  const dbId = isWorkflow
    ? (workflows?.find((workflow) => workflow.id === selectedId)?.db_id ?? '')
    : isTeam
      ? (teams?.find((team) => team.id === selectedId)?.db_id ?? '')
      : (agents?.find((agent) => agent.id === selectedId)?.db_id ?? '')
  const table = isWorkflow
    ? ''
    : isTeam
      ? (teams?.find((team) => team.id === selectedId)?.sessions
          ?.session_table ?? '')
      : (agents?.find((agent) => agent.id === selectedId)?.sessions
          ?.session_table ?? '')
  const type = isWorkflow
    ? FilterType.Workflows
    : isTeam
      ? FilterType.Teams
      : FilterType.Agents

  const queryKey = CACHE_KEYS.PLAYGROUND_SESSIONS({
    OSId,
    dbId,
    id: selectedId ?? '',
    table: table,
    type
  })
  return useInfiniteQuery({
    queryKey,

    queryFn: async ({ pageParam = 1 }) => {
      try {
        if (!selectedEndpoint) {
          throw new Error('API endpoint not set')
        }
        if (!dbId) {
          throw new Error('Database not set')
        }

        const response = await getSessionsListAPI(
          selectedEndpoint,
          dbId,
          {
            page: pageParam,
            type,
            limit: SESSIONS_LIMIT,
            sort_by: 'updated_at',
            sort_order: 'desc',
            user_id: user?.user.username ?? '',
            component_id: selectedId
          },
          table
        )
        return response?.body
      } catch (err) {
        logError(err as Error)

        return { data: [], meta: { page: 1, total_pages: 1 } }
      }
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.meta) return undefined
      const { page, total_pages } = lastPage.meta
      return page < total_pages ? page + 1 : undefined
    },
    enabled:
      !!selectedEndpoint && !!dbId && !!selectedId && !!type && !!isOsAvailable,
    refetchOnWindowFocus: false,
    refetchOnMount: 'always',
    retry: false,
    initialPageParam: 1
  })
}
