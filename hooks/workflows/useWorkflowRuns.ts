import { useQuery } from '@tanstack/react-query'

import { getAgentRunsAPI } from '@/api/agent'
import { CACHE_KEYS } from '@/constants'

import { logError } from '@/utils/error'
import { useOSStore } from '@/stores/OSStore'
import { useUser } from '@/api/hooks/queries'
import { usePlaygroundQueries } from '../playground/usePlaygroundQueries'
import useWorkflows from './useWorkflows'
import { FilterType } from '@/types/filter'
import { WorkflowData } from '@/types/workflow'
import useWorkflowRunsForSession from './useWorkflowRunsForSession'

export const useWorkflowRuns = () => {
  const { data: userData } = useUser()
  const { selectedId: workflowId, session: sessionId } = usePlaygroundQueries()
  const user = userData?.user
  const { currentOS } = useOSStore()
  const selectedEndpoint = currentOS?.endpoint_url ?? null
  const { data: workflows } = useWorkflows()

  const dbId =
    workflows?.find((workflow) => workflow.id === workflowId)?.db_id ?? ''

  // Check if current session is streaming
  const { isStreaming: isCurrentSessionStreaming } =
    useWorkflowRunsForSession(sessionId)

  const shouldEnableQuery = Boolean(
    workflowId &&
      sessionId &&
      selectedEndpoint &&
      dbId &&
      user?.user_id &&
      !isCurrentSessionStreaming
  )

  const query = useQuery({
    queryKey: [
      CACHE_KEYS.PLAYGROUND_WORKFLOW_SESSION_RUNS(
        workflowId ?? '',
        sessionId ?? ''
      )
    ],
    queryFn: async (): Promise<WorkflowData[]> => {
      if (
        !workflowId ||
        !sessionId ||
        !selectedEndpoint ||
        !dbId ||
        !user?.user_id
      ) {
        throw new Error('Missing required parameters')
      }

      try {
        const requestPayload = {
          session_id: sessionId,
          type: FilterType.Workflows
        }

        const response = await getAgentRunsAPI(
          selectedEndpoint,
          dbId,
          requestPayload
        )

        const result = response?.body || []

        return result as WorkflowData[]
      } catch (error) {
        logError(error as Error)
        throw error
      }
    },
    enabled: shouldEnableQuery,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 2,
    staleTime: 0
  })

  return query
}

export default useWorkflowRuns
