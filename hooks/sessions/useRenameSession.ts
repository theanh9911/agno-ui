import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/components/ui/toast'

import { renameSessionAPI } from '@/api/agent'
import { CACHE_KEYS } from '@/constants'
import { useOSStore } from '@/stores/OSStore'
import { InfiniteSessionsData, SessionEntry } from '@/types/playground'
import { usePlaygroundQueries } from '@/hooks/playground/usePlaygroundQueries'
import { useAgentsQuery } from '@/hooks/playground/useAgentsQuery'
import { useTeamsQuery } from '@/hooks/playground/useTeamsQuery'
import { useWorkflows } from '@/hooks/workflows/useWorkflows'
import { useFilterType } from '@/hooks/useFilterType'

import { FilterType } from '@/types/filter'

interface RenameSessionParams {
  sessionId: string
  newName: string
}

export const useRenameSession = () => {
  const queryClient = useQueryClient()
  const currentOS = useOSStore((state) => state.currentOS)
  const { type, isTeam, isWorkflow } = useFilterType()
  const { selectedId } = usePlaygroundQueries()
  const { data: agents } = useAgentsQuery()
  const { data: teams } = useTeamsQuery()
  const { data: workflows } = useWorkflows()

  // Use the same dbId calculation as in fetching hooks
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

  // Generate the cache key for rename operations
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
   * Update session name in query cache
   */
  const updateSessionsCache = ({ sessionId, newName }: RenameSessionParams) => {
    const cacheKey = getCacheKey()

    queryClient.setQueryData(
      cacheKey,
      (oldData: InfiniteSessionsData | undefined) => {
        if (!oldData || !oldData.pages) return oldData

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: page.data.map((session: SessionEntry) =>
              session.session_id === sessionId
                ? { ...session, session_name: newName }
                : session
            )
          }))
        }
      }
    )
  }

  const renameSession = useMutation({
    mutationFn: async ({ sessionId, newName }: RenameSessionParams) => {
      if (!selectedEndpoint) {
        throw new Error('API endpoint not set')
      }
      if (!dbId) {
        throw new Error('Database not set')
      }
      if (!type) {
        throw new Error('Session type not determined')
      }

      const response = await renameSessionAPI(
        selectedEndpoint,
        sessionId,
        dbId,
        type,
        newName,
        table
      )

      if (response.status !== 200) {
        throw new Error('Failed to rename session')
      }

      return { sessionId, newName }
    },
    onMutate: async ({ sessionId, newName }) => {
      const cacheKey = getCacheKey()

      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: cacheKey })

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(cacheKey)

      // Optimistically update the cache
      updateSessionsCache({ sessionId, newName })

      return { previousData, cacheKey }
    },
    onError: (_, __, context) => {
      // Rollback on error
      if (context?.previousData && context?.cacheKey) {
        queryClient.setQueryData(context.cacheKey, context.previousData)
      }
      toast.error({
        description: 'Failed to rename session'
      })
    },
    onSuccess: () => {
      toast.success({
        description: 'Session renamed successfully'
      })
    }
  })

  return { renameSession }
}

export default useRenameSession
