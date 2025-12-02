import { useCallback, useMemo } from 'react'
import { toast } from '@/components/ui/toast'

import { APIRoutes } from '@/api/routes'
import { request } from '@/utils/request'
import { useOSStore } from '@/stores/OSStore'
import { useFilterType } from '@/hooks/useFilterType'
import { usePlaygroundQueries } from '@/hooks/playground/usePlaygroundQueries'
import { usePlaygroundStore } from '@/stores/playground/PlaygroundStore'
import { useAgentsPlaygroundStore } from '@/stores/playground/AgentsPlaygroundStore'
import { useTeamsPlaygroundStore } from '@/stores/playground/TeamsPlaygroundStore'
import { constructEndpointUrl } from '@/utils/playgroundUtils'
import { useWorkflowsWebSocket } from '@/hooks/workflows/useWorkflowsWebSocket'
import { useWorkflowRunsForSession } from '@/hooks/workflows/useWorkflowRunsForSession'

/**
 * Cancel active Agent or Team run
 */
export const useAgentCancelRun = () => {
  const { isTeam } = useFilterType({ autoSetDefault: false })
  const { selectedId } = usePlaygroundQueries()
  const { currentOS } = useOSStore()
  const endpoint = constructEndpointUrl(currentOS?.endpoint_url ?? null)
  const runId = usePlaygroundStore((s) => s.runId)
  const setRunId = usePlaygroundStore((s) => s.setRunId)
  // No body needed for cancel; only path params are used

  const setIsStreaming = isTeam
    ? useTeamsPlaygroundStore((s) => s.setIsStreaming)
    : useAgentsPlaygroundStore((s) => s.setIsStreaming)

  const cancelUrl = useMemo(() => {
    if (!endpoint || !selectedId || !runId) return null
    if (isTeam) {
      return APIRoutes.PlaygroundTeamRunCancel(endpoint)
        .replace('{team_id}', selectedId)
        .replace('{run_id}', runId)
    }
    return APIRoutes.PlaygroundAgentRunCancel(endpoint)
      .replace('{agent_id}', selectedId)
      .replace('{run_id}', runId)
  }, [endpoint, selectedId, runId, isTeam])

  const cancelRuns = useCallback(async () => {
    if (!cancelUrl) return
    try {
      await request(cancelUrl, 'POST')
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
      toast.error({
        description: 'Failed to cancel run'
      })
    } finally {
      setIsStreaming(false)
      setRunId(null)
    }
  }, [cancelUrl, setIsStreaming, setRunId])

  return { cancelRuns }
}

/**
 * Cancel active Workflow run
 */
export const useWorkflowCancelRun = () => {
  const { selectedId: workflowId, session } = usePlaygroundQueries()
  const { currentOS } = useOSStore()
  const endpoint = constructEndpointUrl(currentOS?.endpoint_url ?? null)
  const { latestRunningRun } = useWorkflowRunsForSession(session)

  // Mute via websocket to immediately stop UI updates
  const { muteSession, muteRun } = useWorkflowsWebSocket({ autoConnect: false })

  const cancelRuns = useCallback(
    async (specificRunId?: string) => {
      // Use the provided run ID or fall back to finding the active one
      const runIdToCancel = specificRunId || latestRunningRun?.run_id

      if (!runIdToCancel) {
        return
      }

      // Build cancel URL with the specific run ID
      const cancelUrlForRun =
        !endpoint || !workflowId || !runIdToCancel
          ? null
          : APIRoutes.WorkflowRunCancel(endpoint)
              .replace('{workflow_id}', workflowId)
              .replace('{run_id}', runIdToCancel)

      if (!cancelUrlForRun) {
        return
      }

      try {
        muteRun(runIdToCancel)
        // Also mute the executor session if available via step executor runs
        const sessionIdFromSteps = latestRunningRun?.step_executor_runs?.find(
          (s) => !!s.session_id
        )?.session_id
        if (sessionIdFromSteps) muteSession(sessionIdFromSteps)

        await request(cancelUrlForRun, 'POST')
      } catch {
        toast.error({
          description: 'Failed to cancel workflow run'
        })
      }
    },
    [endpoint, workflowId, latestRunningRun?.run_id, muteRun, muteSession]
  )

  return { cancelRuns }
}

export default useAgentCancelRun
