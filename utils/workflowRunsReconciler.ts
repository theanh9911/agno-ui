import { useWorkflowsStore } from '@/stores/workflowsStore'
import { type WorkflowData } from '@/types/workflow'

/**
 * Merge API-provided history runs with current streaming runs and persist
 * results to the store, preferring streaming runs when they have reached a
 * terminal state (COMPLETED or ERROR). Clears streaming runs after merge.
 */
export function mergeApiRunsWithStreaming(
  sessionId: string,
  apiRuns: WorkflowData[]
): WorkflowData[] {
  const store = useWorkflowsStore.getState()
  const streamingRuns = store.getStreamingWorkflowRuns(sessionId)

  const mergedRuns = mergeWorkflowRuns(apiRuns, streamingRuns)

  store.setHistoryWorkflowRuns(sessionId, mergedRuns)
  store.clearStreamingWorkflowRuns(sessionId)

  return mergedRuns
}

/**
 * Pure merge function used by orchestrator(s).
 * - For each api run, if a streaming run with the same run_id exists
 *   and it is in a terminal state (COMPLETED or ERROR), prefer the streaming run.
 * - Otherwise, use the api run.
 * - Order is preserved from apiRuns.
 */
export function mergeWorkflowRuns(
  apiRuns: WorkflowData[],
  streamingRuns: WorkflowData[]
): WorkflowData[] {
  if (!Array.isArray(apiRuns) || apiRuns.length === 0) {
    return []
  }

  if (!Array.isArray(streamingRuns) || streamingRuns.length === 0) {
    return apiRuns
  }

  return apiRuns.map((apiRun) => {
    const streamingRun = streamingRuns.find((sr) => sr.run_id === apiRun.run_id)
    if (
      streamingRun &&
      (streamingRun.status === 'COMPLETED' || streamingRun.status === 'ERROR')
    ) {
      return streamingRun
    }
    return apiRun
  })
}

/**
 * When API explicitly returns empty for a session while query is enabled,
 * clear history and streaming runs for that session.
 */
export function clearSessionRuns(sessionId: string): void {
  const store = useWorkflowsStore.getState()
  store.setHistoryWorkflowRuns(sessionId, [])
  store.clearStreamingWorkflowRuns(sessionId)
}
