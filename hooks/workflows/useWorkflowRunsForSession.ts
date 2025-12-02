import { useMemo } from 'react'
import { useWorkflowsStore } from '@/stores/workflowsStore'
import { WorkflowData } from '@/types/workflow'
import useSessionRunsSelector from './useSessionRunsSelector'
import { mergeWorkflowRuns } from '@/utils/workflowRunsReconciler'

/**
 * Hook to get merged workflow runs (history + streaming) and streaming state for a session
 *
 * @param sessionId - The session ID to get runs for
 * @returns Object containing:
 *   - mergedRuns: Array of merged workflow runs (history + streaming, deduplicated by run_id)
 *   - historyRuns: Array of history runs only
 *   - streamingRuns: Array of streaming runs only
 *   - isStreaming: Boolean indicating if the session is currently streaming
 */
export const useWorkflowRunsForSession = (
  sessionId: string | null | undefined
) => {
  // Get history runs for this session using reactive selector
  const historyRuns = useSessionRunsSelector(sessionId, 'historyWorkflowRuns')

  // Get streaming runs for this session using reactive selector
  const streamingRuns = useSessionRunsSelector(
    sessionId,
    'streamingWorkflowRuns'
  )

  // Get streaming state for this session using reactive selector
  const isStreaming = useWorkflowsStore((state) => {
    if (!sessionId) return false
    return state.sessionStreamingStates?.[sessionId]?.isStreaming ?? false
  })

  // Merge history and streaming runs via pure helper; include streaming-only runs; sort by created_at
  const mergedRuns = useMemo(() => {
    if (!sessionId) return []

    const safeHistory = Array.isArray(historyRuns) ? historyRuns : []
    const safeStreaming = Array.isArray(streamingRuns) ? streamingRuns : []

    // First, merge overlapping runs using pure reconciler logic
    const baseMerged = mergeWorkflowRuns(safeHistory, safeStreaming)

    // Then, add any streaming runs that don't exist in history
    const historyIds = new Set<string>(
      safeHistory.map((r) => r?.run_id).filter(Boolean) as string[]
    )
    const streamingOnly = safeStreaming.filter(
      (r) => r?.run_id && !historyIds.has(r.run_id)
    )

    const combined = [...baseMerged, ...streamingOnly]

    // Sort by created_at timestamp ascending
    return combined.sort((a, b) => {
      const timeA = a?.created_at || 0
      const timeB = b?.created_at || 0
      return timeA - timeB
    })
  }, [sessionId, historyRuns, streamingRuns])

  // Most recent run whose status is RUNNING
  const latestRunningRun = useMemo<WorkflowData | undefined>(() => {
    if (!Array.isArray(mergedRuns) || mergedRuns.length === 0) return undefined
    for (let i = mergedRuns.length - 1; i >= 0; i--) {
      const run = mergedRuns[i]
      if (run?.status === 'RUNNING') return run
    }
    return undefined
  }, [mergedRuns])

  return {
    mergedRuns,
    historyRuns,
    streamingRuns,
    isStreaming,
    latestRunningRun
  }
}

export default useWorkflowRunsForSession
