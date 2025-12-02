import { useOSStore } from '@/stores/OSStore'
import { getSessionAPI } from '@/api/agent'
import { CACHE_KEYS } from '@/constants'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useFilterType } from '@/hooks/useFilterType'
import { useUser } from '@/api/hooks'
import { useAgentsQuery } from '@/hooks/playground/useAgentsQuery'
import { useTeamsQuery } from '@/hooks/playground/useTeamsQuery'
import { useWorkflowRunsForSession, useWorkflows } from '@/hooks/workflows'
import {
  useAgentsPlaygroundStore,
  useTeamsPlaygroundStore
} from '@/stores/playground'
import { usePlaygroundQueries } from '@/hooks/playground/usePlaygroundQueries'
import { AgentSessionDataWithTeamAndWorkflow } from '@/types/Agent'

export const useSessionDataQuery = (sessionId: string | null) => {
  const queryClient = useQueryClient()
  const currentOS = useOSStore((state) => state.currentOS)
  const { type, isTeam, isWorkflow } = useFilterType()
  const { selectedId } = usePlaygroundQueries()
  const { data: agents } = useAgentsQuery()
  const { data: teams } = useTeamsQuery()
  const { data: workflows } = useWorkflows()
  const userId = useUser().data?.user?.username

  // Avoid extra refetches during streaming
  const isAgentsStreaming = useAgentsPlaygroundStore((s) => s.isStreaming)
  const isTeamsStreaming = useTeamsPlaygroundStore((s) => s.isStreaming)
  const { isStreaming: isWorkflowStreaming } =
    useWorkflowRunsForSession(sessionId)
  const isStreaming =
    isAgentsStreaming || isTeamsStreaming || isWorkflowStreaming

  // TODO: refactor to utility function for dbId and table for all chat pages to share with other hooks
  const dbId = isWorkflow
    ? (workflows?.find((workflow) => workflow.id === selectedId)?.db_id ?? '')
    : isTeam
      ? (teams?.find((team) => team.id === selectedId)?.db_id ?? '')
      : (agents?.find((agent) => agent.id === selectedId)?.db_id ?? '')

  const requestPayload = {
    session_id: sessionId ?? undefined,
    type: type,
    user_id: userId ?? undefined
  }

  const queryKey = [
    CACHE_KEYS.AGENT_SESSION({
      currentOS: currentOS?.endpoint_url ?? '',
      session_id: sessionId ?? '',
      type: type,
      dbId
    })
  ] as const

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      if (!sessionId) return null
      if (!currentOS?.endpoint_url) throw new Error('API endpoint not set')
      if (!dbId) throw new Error('Database not set')
      if (!userId) throw new Error('User not authenticated')

      const response = await getSessionAPI(
        currentOS?.endpoint_url,
        dbId,
        requestPayload
      )

      const next = response.body
      // Preserve a previously non-empty name if server returns empty or MEDIA_SESSION_NAME
      //TODO: refactor to utility function to share with session list optimistic update
      try {
        const prev =
          queryClient.getQueryData<AgentSessionDataWithTeamAndWorkflow>(
            queryKey
          )
        const nextName = next?.session_name
        const prevName = prev?.session_name
        const shouldPreservePrevName = (prevName && !nextName) || false

        if (shouldPreservePrevName) {
          return {
            ...next,
            session_name: prevName
          }
        }
      } catch {
        // no-op: fallback to returning next
      }

      return next
    },
    enabled:
      !!sessionId &&
      !!currentOS?.endpoint_url &&
      !!dbId &&
      !!userId &&
      !isStreaming,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    initialData: () => {
      // Serve optimistic cache (if present) immediately to consumers
      const cached =
        queryClient.getQueryData<AgentSessionDataWithTeamAndWorkflow>(queryKey)
      return cached ?? null
    }
  })

  return query
}
