import { useCallback } from 'react'
import { toast } from '@/components/ui/toast'

import { useWorkflowsStore } from '@/stores/workflowsStore'
import { usePlaygroundQueries } from '@/hooks/playground/usePlaygroundQueries'
import { useUser } from '@/api/hooks/queries'
import { useWorkflowsWebSocket } from '@/hooks/workflows/useWorkflowsWebSocket'
import { type WorkflowData as WorkflowRunData } from '@/types/workflow'
import { type WorkflowFormData } from '@/schema/workflowSchema'

/**
 * Transform form data for API request
 * Converts JSON strings back to objects for complex field types
 * For fallback mode (no schema), sends message directly as string
 */
const transformFormDataForAPI = (
  formData: WorkflowFormData,
  hasSchema: boolean
): Record<string, unknown> | string => {
  // If no schema and only has 'message' field, return the message string directly
  if (
    !hasSchema &&
    Object.keys(formData).length === 1 &&
    'message' in formData
  ) {
    return formData.message as string
  }

  const transformed: Record<string, unknown> = {}

  Object.entries(formData).forEach(([key, value]) => {
    if (typeof value === 'string') {
      // Only attempt JSON parse for values that look like objects or arrays
      const trimmed = value.trim()
      const looksLikeJSONObject =
        (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
        (trimmed.startsWith('[') && trimmed.endsWith(']'))

      if (looksLikeJSONObject) {
        try {
          const parsed = JSON.parse(trimmed)
          transformed[key] = parsed
          return
        } catch {
          // fall through to keep as string
        }
      }

      // Keep plain strings (including numeric-looking ones like "123") as strings
      transformed[key] = value
    } else {
      // For non-string values (boolean, number, array), keep as is
      transformed[key] = value
    }
  })

  return transformed
}

export const useWorkflowRun = () => {
  const { setStreamingWorkflowRuns, setSessionStreamingState, setFormData } =
    useWorkflowsStore()
  const { session } = usePlaygroundQueries()
  const { sendMessage } = useWorkflowsWebSocket()
  const { data } = useUser()
  const user = data?.user
  const { reconnect } = useWorkflowsWebSocket()

  const runWorkflow = useCallback(
    async (
      selectedWorkflow: string,
      inputData: WorkflowFormData,
      baseUrl: string,
      workflowSchema?: { properties?: Record<string, unknown> }
    ) => {
      if (!baseUrl || !user?.user_id || !selectedWorkflow) {
        toast.error({
          description:
            'Missing required configuration. Please check your setup.'
        })
        return
      }

      try {
        // Check if we have a schema or are in fallback mode
        const hasSchema = !!workflowSchema?.properties

        // Transform form data for API consumption
        const transformedData = transformFormDataForAPI(inputData, hasSchema)

        // Create a temporary run ID for the local state
        const tempRunId = `temp-${Date.now()}`

        const runInputString =
          typeof transformedData === 'string'
            ? transformedData
            : JSON.stringify(transformedData)

        const localRun: WorkflowRunData = {
          run_id: tempRunId,
          run_input: runInputString,
          content: '',
          content_type: 'str',
          status: 'RUNNING',
          step_results: [],
          step_executor_runs: [],
          events: [],
          created_at: Math.floor(Date.now() / 1000),
          user_id: user.user_id,
          metrics: {
            total_steps: 0,
            steps: {}
          }
        }

        setFormData(inputData)

        // Add local workflow run immediately to streaming runs for this session
        if (session) {
          setStreamingWorkflowRuns(
            session,
            (currentRuns: WorkflowRunData[]) => {
              const updatedRuns = [...currentRuns, localRun]
              return updatedRuns
            }
          )
          // Set streaming state for this session
          setSessionStreamingState(session, {
            isStreaming: true,
            streamingMessage: '',
            wasStreamed: false
          })
        }

        // Emit the start-workflow event
        const eventData = {
          action: 'start-workflow',
          workflow_id: selectedWorkflow,
          message: transformedData,
          user_id: user.username,
          ...(session && { session_id: session })
        }

        const success = sendMessage(eventData)

        if (!success) {
          throw new Error('Failed to send workflow start message')
        }
      } catch {
        toast.error({
          description: 'Failed to start workflow'
        })
        reconnect()
        // Remove the failed temporary run
        if (session) {
          setStreamingWorkflowRuns(session, (currentRuns: WorkflowRunData[]) =>
            currentRuns.filter(
              (run: WorkflowRunData) => !run.run_id?.startsWith('temp-')
            )
          )
          setSessionStreamingState(session, {
            isStreaming: false,
            streamingMessage: '',
            wasStreamed: false
          })
        }
      }
    },
    [
      user,
      session,
      sendMessage,
      setStreamingWorkflowRuns,
      setSessionStreamingState,
      setFormData,
      reconnect
    ]
  )

  return { runWorkflow }
}
