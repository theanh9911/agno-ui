import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/components/ui/toast'

import { deleteSessionAPI } from '@/api/agent'
import { CACHE_KEYS } from '@/constants'
import { useOSStore } from '@/stores/OSStore'
import { InfiniteSessionsData, SessionEntry } from '@/types/playground'
import { usePlaygroundQueries } from '@/hooks/playground/usePlaygroundQueries'
import { useAgentsQuery } from '@/hooks/playground/useAgentsQuery'
import { useTeamsQuery } from '@/hooks/playground/useTeamsQuery'
import { useFilterType } from '@/hooks/useFilterType'
import { FilterType } from '@/types/filter'
import { useWorkflows } from '../workflows'

interface DeleteSessionParams {
  sessionId: string
}

export const useDeleteSession = () => {
  const queryClient = useQueryClient()
  const currentOS = useOSStore((state) => state.currentOS)
  const { type, isTeam, isWorkflow } = useFilterType()
  const { selectedId, session, setSession } = usePlaygroundQueries()
  const { data: agents } = useAgentsQuery()
  const { data: teams } = useTeamsQuery()
  const { data: workflows } = useWorkflows()

  // Use the same dbId calculation as the fetch hook
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

  const selectedEndpoint = currentOS?.endpoint_url ?? ''
  const OSId = currentOS?.id ?? null

  // Generate the cache key for delete operations
  const getCacheKey = () => {
    return CACHE_KEYS.PLAYGROUND_SESSIONS({
      OSId,
      dbId,
      id: selectedId ?? '',
      table,
      type: isWorkflow
        ? FilterType.Workflows
        : isTeam
          ? FilterType.Teams
          : FilterType.Agents
    })
  }

  /**
   * Remove session from query cache
   */
  const updateSessionsCache = ({ sessionId }: DeleteSessionParams) => {
    const cacheKey = getCacheKey()

    queryClient.setQueryData(
      cacheKey,
      (oldData: InfiniteSessionsData | undefined) => {
        if (!oldData || !oldData.pages) return oldData

        const updatedPages = oldData.pages.map((page) => {
          const filteredData = page.data.filter(
            (session: SessionEntry) => session.session_id !== sessionId
          )

          return {
            data: [...filteredData],
            meta: { ...page.meta }
          }
        })

        const result = {
          pages: [...updatedPages],
          pageParams: [...oldData.pageParams]
        }

        return result
      }
    )
  }

  const deleteSession = useMutation({
    mutationFn: async ({ sessionId }: DeleteSessionParams) => {
      if (!selectedEndpoint) {
        throw new Error('API endpoint not set')
      }
      if (!dbId) {
        throw new Error('Database not set')
      }
      if (!type) {
        throw new Error('Session type not determined')
      }

      const response = await deleteSessionAPI(
        selectedEndpoint,
        sessionId,
        dbId,
        type
      )

      if (response.status !== 200 && response.status !== 204) {
        throw new Error('Failed to delete session')
      }

      return { sessionId }
    },
    onMutate: async ({ sessionId }) => {
      const cacheKey = getCacheKey()
      await queryClient.cancelQueries({ queryKey: cacheKey })

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(cacheKey)

      // Optimistically update the cache
      updateSessionsCache({ sessionId })

      return { previousData, cacheKey }
    },
    onError: (_, __, context) => {
      // Rollback on error
      if (context?.previousData && context?.cacheKey) {
        queryClient.setQueryData(context.cacheKey, context.previousData)
      }
      toast.error({
        description: 'Failed to delete session'
      })
    },
    onSuccess: ({ sessionId }) => {
      if (session === sessionId) {
        setSession(null)
      }
      toast.success({
        description: 'Session deleted successfully'
      })
    }
  })

  return { deleteSession }
}

export default useDeleteSession
