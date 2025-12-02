import { useWorkflowsStore } from '@/stores/workflowsStore'
import { WorkflowData } from '@/types/workflow'

// Stable empty array reference to prevent unnecessary re-renders
const EMPTY_WORKFLOW_ARRAY: WorkflowData[] = []

/**
 * Selector to read runs for a specific session from the workflows store.
 * It safely handles missing session IDs and absent store collections.
 */
export const useSessionRunsSelector = (
  sessionId: string | null | undefined,
  stateKey: 'historyWorkflowRuns' | 'streamingWorkflowRuns'
) => {
  return useWorkflowsStore((state) => {
    if (!sessionId) return EMPTY_WORKFLOW_ARRAY
    const collection = state[stateKey]
    if (!collection) return EMPTY_WORKFLOW_ARRAY
    const runs = collection[sessionId]
    return runs || EMPTY_WORKFLOW_ARRAY
  })
}

export default useSessionRunsSelector
