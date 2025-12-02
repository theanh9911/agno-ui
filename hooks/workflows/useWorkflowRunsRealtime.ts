import { useEffect, useMemo } from 'react'
import { toast } from '@/components/ui/toast'
import { useQueryClient } from '@tanstack/react-query'
import { useWorkflowsWebSocket } from './useWorkflowsWebSocket'
import { useWorkflowRuns } from './useWorkflowRuns'
import { usePlaygroundQueries } from '../playground/usePlaygroundQueries'
import { useWorkflowsStore } from '@/stores/workflowsStore'
import { CACHE_KEYS, MEDIA_SESSION_NAME } from '@/constants'
import { FilterType } from '@/types/filter'
import { useSearchParams } from '@/utils/navigation'
import {
  WorkflowData,
  StepExecutorRun,
  StepResult,
  ToolCall,
  WorkflowRealtimeEvent
} from '@/types/workflow'
import {
  RunEvent,
  TeamRunEvent,
  InfiniteSessionsData,
  SessionEntry
} from '@/types/playground'
import { StepType } from '@/utils/workflows'
import { getJsonMarkdown } from '@/utils/playgroundUtils'
import { useOSStore } from '@/stores/OSStore'
import useWorkflows from './useWorkflows'
import useSessionRunsSelector from './useSessionRunsSelector'
import {
  mergeApiRunsWithStreaming,
  clearSessionRuns
} from '@/utils/workflowRunsReconciler'

type WorkflowWebSocketEvent = WorkflowRealtimeEvent

/**
 * Merges new content into existing content for workflow streaming.
 * - If new content is an object, convert to markdown and append.
 * - If new content is a string, concatenate.
 * - If new content is null/undefined, return existing.
 */
export function mergeContent(
  existingContent: string | object | undefined,
  newContent: string | object | undefined
): string | object | undefined {
  if (typeof newContent === 'object' && newContent !== null) {
    // Convert object to markdown and append
    const jsonBlock = getJsonMarkdown(newContent)
    return (
      (typeof existingContent === 'string' ? existingContent : '') + jsonBlock
    )
  } else if (typeof newContent === 'string') {
    // Concatenate strings
    return (
      (typeof existingContent === 'string' ? existingContent : '') + newContent
    )
  } else {
    // Fallback: return existing content
    return existingContent
  }
}

const getEventType = (event: string): StepType | undefined => {
  switch (event) {
    case 'StepStarted':
      return 'Step'
    case 'ParallelExecutionStarted':
      return 'Parallel'
    case 'ConditionExecutionStarted':
      return 'Condition'
    case 'LoopExecutionStarted':
      return 'Loop'
    case 'RouterExecutionStarted':
      return 'Router'
    case 'StepsExecutionStarted':
      return 'Steps'
    default:
      return undefined
  }
}

export const useWorkflowRunsRealtime = () => {
  const queryClient = useQueryClient()
  const { messageQueue, consumeMessages, _isSessionMuted, _isRunMuted } =
    useWorkflowsWebSocket()
  const {
    selectedId: workflowId,
    session: sessionId,
    setSession
  } = usePlaygroundQueries()
  const workflowRunsQuery = useWorkflowRuns()
  const { currentOS } = useOSStore()
  const { data: workflows } = useWorkflows()
  const searchParams = useSearchParams()
  // Get type from URL params directly to avoid hook count issues
  const type = (searchParams?.get('type') as FilterType) || FilterType.Workflows
  const dbId = workflows?.find((w) => w.id === workflowId)?.db_id ?? ''
  // Use the same query key as the sessions list hook so optimistic updates reflect in SessionsTab
  const sessionsListQueryKey = useMemo(
    () =>
      CACHE_KEYS.PLAYGROUND_SESSIONS({
        OSId: currentOS?.id ?? null,
        dbId,
        id: workflowId ?? '',
        table: '',
        type: FilterType.Workflows
      }),
    [currentOS?.id, dbId, workflowId]
  )
  // Get store functions and state
  const {
    formData,
    setStreamingWorkflowRuns,
    setSessionStreamingState,
    getSessionStreamingState
  } = useWorkflowsStore()

  // Also need getters for handlers that access other sessions
  const getStreamingWorkflowRuns = useWorkflowsStore(
    (state) => state.getStreamingWorkflowRuns
  )

  // Convert formData to JSON string for run_input
  const getCurrentRunInput = () => {
    return formData.message
      ? String(formData.message)
      : JSON.stringify(formData)
  }

  // Effect to handle session changes - invalidate query cache to force fresh fetch
  useEffect(() => {
    if (sessionId && workflowId) {
      // Check if this session is currently streaming before invalidating
      // If streaming, don't invalidate immediately to preserve streaming runs
      const streamingState = getSessionStreamingState(sessionId)
      const isStreaming = streamingState?.isStreaming || false

      // Only invalidate if not streaming (to avoid race conditions)
      // If streaming, the query is already disabled, so invalidation isn't needed
      // IMPORTANT: When switching to a streaming session, preserve existing streaming runs
      // and continue storing WebSocket updates - don't clear or overwrite them
      if (!isStreaming) {
        queryClient.invalidateQueries({
          queryKey: [
            CACHE_KEYS.PLAYGROUND_WORKFLOW_SESSION_RUNS(workflowId, sessionId)
          ]
        })
      }
    }
  }, [
    sessionId,
    workflowId,
    queryClient,
    getSessionStreamingState,
    getStreamingWorkflowRuns
  ])

  // Use reactive selectors to ensure updates when streaming state changes
  // Use stable empty array reference to prevent unnecessary re-renders
  // IMPORTANT: These selectors subscribe to changes in the store, so they will
  // automatically update when streaming runs change for any session, but they only
  // return data for the current sessionId (the session being viewed)
  const historyRuns = useSessionRunsSelector(sessionId, 'historyWorkflowRuns')
  const streamingRuns = useSessionRunsSelector(
    sessionId,
    'streamingWorkflowRuns'
  )

  // Merge history + streaming runs for current session
  const mergedData = useMemo(() => {
    if (!sessionId) return []

    // Create a map of run_id -> run for efficient merging
    const runsMap = new Map<string, WorkflowData>()

    // Add all history runs first (safely handle missing run_id)
    if (Array.isArray(historyRuns)) {
      historyRuns.forEach((run) => {
        if (run && run.run_id) {
          runsMap.set(run.run_id, run)
        }
      })
    }

    // Override with streaming runs (streaming takes precedence)
    if (Array.isArray(streamingRuns)) {
      streamingRuns.forEach((run) => {
        if (run && run.run_id) {
          runsMap.set(run.run_id, run)
        }
      })
    }

    const merged = Array.from(runsMap.values()).sort((a, b) => {
      const timeA = a?.created_at || 0
      const timeB = b?.created_at || 0
      return timeA - timeB
    })

    return merged
  }, [sessionId, historyRuns, streamingRuns])

  // Helper to get session ID from message - always use the message's session_id
  // This ensures we update the correct session even when viewing a different session
  const getMessageSessionId = (
    message: WorkflowWebSocketEvent
  ): string | null => {
    return (message as { session_id?: string }).session_id || null
  }

  // Helper to find which session contains a workflow run by run_id
  // First checks preferredSessionId if provided, then searches all sessions
  const findSessionForWorkflowRun = (
    workflowRunId: string,
    preferredSessionId?: string | null
  ): string | null => {
    const store = useWorkflowsStore.getState()

    // First, check the preferred session if provided
    if (preferredSessionId) {
      const preferredRuns =
        store.streamingWorkflowRuns[preferredSessionId] ||
        store.historyWorkflowRuns[preferredSessionId] ||
        []
      if (Array.isArray(preferredRuns)) {
        const found = preferredRuns.some((run) => run?.run_id === workflowRunId)
        if (found) return preferredSessionId
      }
    }

    // If not found in preferred session, search through all sessions' streaming runs
    for (const [sessionId, runs] of Object.entries(
      store.streamingWorkflowRuns
    )) {
      if (Array.isArray(runs)) {
        const found = runs.some((run) => run?.run_id === workflowRunId)
        if (found) return sessionId
      }
    }
    // Also search history runs
    for (const [sessionId, runs] of Object.entries(store.historyWorkflowRuns)) {
      if (Array.isArray(runs)) {
        const found = runs.some((run) => run?.run_id === workflowRunId)
        if (found) return sessionId
      }
    }
    return null
  }

  // Append the raw websocket message as a normalized event to the appropriate workflow run
  const recordEvent = (message: WorkflowWebSocketEvent) => {
    const targetParent = message.workflow_run_id || message.parent_run_id
    const targetExecutorRunId = message.run_id
    const msgSessionId = getMessageSessionId(message)

    // Executor events (RunStarted, RunContent, etc.) have the executor's
    // session_id, not the workflow's session_id when agent is passed as an executor

    // If we have a workflow_run_id, find the correct session that contains that workflow run
    let targetSessionId: string | null = null
    if (targetParent) {
      // First try to find using the message's session_id (preferred)
      // This handles cases where the message's session_id is the workflow's session
      targetSessionId = findSessionForWorkflowRun(targetParent, msgSessionId)
      // If not found, fall back to searching all sessions
      if (!targetSessionId) {
        targetSessionId = findSessionForWorkflowRun(targetParent)
      }
    } else if (msgSessionId) {
      // No workflow_run_id, use the message's session_id
      targetSessionId = msgSessionId
    }

    if (!targetSessionId) {
      // Can't determine target session, skip recording
      return
    }

    setStreamingWorkflowRuns(targetSessionId, (currentRuns) => {
      let didUpdate = false

      const updated = currentRuns.map((run) => {
        // Prefer explicit parent run targeting
        if (targetParent && run.run_id === targetParent) {
          didUpdate = true
          return {
            ...run,
            events: [...(run.events || []), message]
          }
        }

        // If no explicit parent, but event run_id equals workflow run id
        if (
          !targetParent &&
          targetExecutorRunId &&
          run.run_id === targetExecutorRunId
        ) {
          didUpdate = true
          return {
            ...run,
            events: [...(run.events || []), message]
          }
        }

        // If no explicit parent, try to find matching step executor run within this workflow run
        if (
          !targetParent &&
          targetExecutorRunId &&
          run.step_executor_runs?.some((r) => r.run_id === targetExecutorRunId)
        ) {
          didUpdate = true
          return {
            ...run,
            events: [...(run.events || []), message]
          }
        }

        return run
      })

      return didUpdate ? updated : currentRuns
    })
  }

  // Effect to process all messages in the queue
  useEffect(() => {
    if (messageQueue.length === 0) return

    // Consume all messages from the queue
    const messages = consumeMessages()

    // Process each message
    messages.forEach((message) => {
      if (!message?.data) {
        return
      }

      let parsedMessage: WorkflowWebSocketEvent | null = null

      try {
        // If it's already an object, use it directly
        if (typeof message.data === 'object') {
          parsedMessage = message.data
        }

        // If it's a string, try to parse it
        if (typeof message.data === 'string') {
          parsedMessage = JSON.parse(message.data)
        }
      } catch {
        return
      }

      if (!parsedMessage) return

      // Drop muted sessions/runs
      const { session_id: evtSessionId, run_id: evtRunId } = parsedMessage as {
        session_id?: string
        run_id?: string
      }
      if (
        (evtSessionId && _isSessionMuted(evtSessionId)) ||
        (evtRunId && _isRunMuted(evtRunId))
      ) {
        return
      }

      const { event } = parsedMessage

      switch (event) {
        case 'WorkflowStarted':
          handleWorkflowStarted(parsedMessage)
          break
        case 'WorkflowAgentCompleted':
          handleWorkflowAgentCompleted(parsedMessage)
          break
        case 'error':
        case 'WorkflowError':
          handleWorkflowError(parsedMessage)
          break
        case 'StepStarted':
        case 'ParallelExecutionStarted':
        case 'ConditionExecutionStarted':
        case 'LoopExecutionStarted':
        case 'RouterExecutionStarted':
        case 'StepsExecutionStarted':
          handleStepStarted(parsedMessage)
          break
        case 'StepCompleted':
        case 'ParallelExecutionCompleted':
        case 'ConditionExecutionCompleted':
        case 'LoopExecutionCompleted':
        case 'RouterExecutionCompleted':
        case 'StepsExecutionCompleted':
          handleStepCompleted(parsedMessage)
          break
        case RunEvent.RunStarted:
        case TeamRunEvent.TeamRunStarted:
          handleExecutorRunStarted(parsedMessage)
          break
        case RunEvent.RunContent:
        case TeamRunEvent.TeamRunContent:
        case RunEvent.RunCompleted:
        case TeamRunEvent.TeamRunCompleted:
          handleResponseContent(parsedMessage)
          break
        case 'WorkflowCompleted':
        case 'WorkflowFailed':
          handleWorkflowStatusUpdate(parsedMessage)
          break
        case 'ToolCallStarted':
        case 'TeamToolCallStarted':
          handleToolCallStarted(parsedMessage)
          break

        case 'ToolCallCompleted':
        case 'TeamToolCallCompleted':
          handleToolCallCompleted(parsedMessage)
          break
        default:
          break
      }
    })
  }, [messageQueue, consumeMessages])

  const handleWorkflowStarted = (message: WorkflowWebSocketEvent) => {
    const { workflow_id, session_id: msgSessionId, run_id } = message

    if (!msgSessionId) return

    // Always initialize/update streaming state for this session, regardless of current view
    setSessionStreamingState(msgSessionId, {
      isStreaming: true,
      streamingMessage: '',
      wasStreamed: true
    })

    // Get session name from form input BEFORE switching sessions
    // This ensures the cache is updated before useSessionDataQuery starts fetching
    const sessionName = getCurrentRunInput() || 'New Session'

    // IMPORTANT: Update the session data cache BEFORE switching to the session
    // This prevents useSessionDataQuery from fetching "Media Session" from the API
    if (msgSessionId && currentOS?.endpoint_url && dbId) {
      const sessionType = type
      const sessionDataCacheKey = [
        CACHE_KEYS.AGENT_SESSION({
          currentOS: currentOS.endpoint_url ?? '',
          session_id: msgSessionId,
          type: sessionType,
          dbId
        })
      ]
      // Update cache immediately before session switch triggers query
      queryClient.setQueryData<SessionEntry | null>(
        sessionDataCacheKey,
        (oldData) => {
          if (oldData) {
            // Update existing session data: preserve name, only update timestamp
            // But if session_name is "Media Session" or empty, update it with the form input
            const shouldUpdateName =
              !oldData.session_name ||
              oldData.session_name === MEDIA_SESSION_NAME

            const updatedSession: SessionEntry = {
              ...oldData,
              session_name: shouldUpdateName
                ? sessionName
                : oldData.session_name,
              updated_at: message.created_at
            }

            return updatedSession
          }
          // Create new session data if it doesn't exist - use form input as session name
          const newSessionData: SessionEntry = {
            session_id: msgSessionId,
            session_name: sessionName,
            created_at: message.created_at,
            session_state: '',
            updated_at: message.created_at
          }

          return newSessionData
        },
        {
          // Update the query state immediately
          // This ensures components reading from the cache see the update before any API fetch
          updatedAt: Date.now()
        }
      )
    }

    // Only switch to this session if it matches current workflow and we're not already viewing it
    // But always process the streaming data for the session
    if (
      workflow_id === workflowId &&
      (!sessionId || sessionId !== msgSessionId)
    ) {
      setSession(msgSessionId)
    }

    // Always optimistically update the session in the cache when a workflow starts
    // This ensures the session appears/updates in the sessions list immediately
    if (msgSessionId && workflow_id === workflowId) {
      // Update the sessions list cache (for /sessions API)
      queryClient.setQueryData(
        sessionsListQueryKey,
        (oldData: InfiniteSessionsData | undefined) => {
          const sessionData: SessionEntry = {
            session_id: msgSessionId,
            session_name: sessionName,
            created_at: message.created_at,
            session_state: '',
            updated_at: message.created_at
          }

          if (!oldData || !oldData.pages || oldData.pages.length === 0) {
            return {
              pages: [
                { data: [sessionData], meta: { page: 1, total_pages: 1 } }
              ],
              pageParams: [1]
            }
          }

          // Check if session already exists in any page and update it
          let sessionExists = false

          const updatedPages = oldData.pages.map((page) => {
            const existingIndex = page.data.findIndex(
              (s: SessionEntry) => s.session_id === msgSessionId
            )
            if (existingIndex !== -1) {
              sessionExists = true
              // Update existing session: preserve name, only update timestamp and move to top
              const existingSession = page.data[existingIndex]
              const updatedSession: SessionEntry = {
                ...existingSession, // Preserve all existing fields including session_name
                updated_at: message.created_at // Only update timestamp
              }
              const updatedData = [...page.data]
              updatedData.splice(existingIndex, 1)
              return {
                ...page,
                data: [updatedSession, ...updatedData] // Move to top (most recent first)
              }
            }
            return page
          })

          // If session doesn't exist, add it to the first page at the top
          if (!sessionExists) {
            return {
              ...oldData,
              pages: updatedPages.map((page, idx) =>
                idx === 0
                  ? {
                      ...page,
                      data: [sessionData, ...page.data]
                    }
                  : page
              )
            }
          }

          return {
            ...oldData,
            pages: updatedPages
          }
        }
      )

      // Also update the individual session data cache (for /session/id API used by breadcrumb)
      // This cache is used by useSessionDataQuery which the breadcrumb reads from
      // Use type from URL params, fallback to FilterType.Workflows if not available
      const sessionType = type
      if (currentOS?.endpoint_url && dbId) {
        const sessionDataCacheKey = [
          CACHE_KEYS.AGENT_SESSION({
            currentOS: currentOS.endpoint_url ?? '',
            session_id: msgSessionId,
            type: sessionType,
            dbId
          })
        ]

        // Always update the cache, even if query is disabled during streaming
        // This ensures the breadcrumb sees the optimistic update immediately
        queryClient.setQueryData<SessionEntry | null>(
          sessionDataCacheKey,
          (oldData) => {
            if (oldData) {
              // Update existing session data: preserve name, only update timestamp
              // But if session_name is "Media Session" or empty, update it with the form input
              const shouldUpdateName =
                !oldData.session_name ||
                oldData.session_name === MEDIA_SESSION_NAME

              const updatedSession: SessionEntry = {
                ...oldData,
                session_name: shouldUpdateName
                  ? sessionName
                  : oldData.session_name,
                updated_at: message.created_at
              }

              return updatedSession
            }
            // Create new session data if it doesn't exist - use form input as session name
            const newSessionData: SessionEntry = {
              session_id: msgSessionId,
              session_name: sessionName,
              created_at: message.created_at,
              session_state: '',
              updated_at: message.created_at
            }

            return newSessionData
          },
          {
            // Update the query state even if it's disabled
            // This ensures components reading from the cache see the update
            updatedAt: Date.now()
          }
        )
      }
    }

    // Process the workflow run for the session in the message, regardless of current workflow
    if (msgSessionId && run_id) {
      setStreamingWorkflowRuns(msgSessionId, (currentRuns) => {
        // Check if this run already exists
        const existingRunIndex = currentRuns.findIndex(
          (run) => run.run_id === run_id
        )

        if (existingRunIndex === -1) {
          // Look for temporary local run to replace
          const tempRunIndex = currentRuns.findIndex((run) =>
            run.run_id?.startsWith('temp-')
          )

          const newRun: WorkflowData = {
            run_id,
            run_input: getCurrentRunInput(),
            user_id: message.user_id || '',
            content: message.content || '',
            content_type: message.content_type || 'str',
            status: 'RUNNING',
            step_results: [],
            step_executor_runs: [],
            metrics: message.metrics || {
              total_steps: 0,
              steps: {}
            },
            created_at: message.created_at,
            events: [message]
          }

          if (tempRunIndex !== -1) {
            // Replace the temporary run with the real one, and preserve the run_input from the temp run
            const updatedRuns = [...currentRuns]
            const tempRun = currentRuns[tempRunIndex]
            updatedRuns[tempRunIndex] = {
              ...newRun,
              run_input: tempRun.run_input
            }
            return updatedRuns
          } else {
            const updatedRuns = [...currentRuns, newRun]
            return updatedRuns
          }
        }

        // If run exists, still record the event on it
        return currentRuns.map((r) =>
          r.run_id === run_id
            ? { ...r, events: [...(r.events || []), message] }
            : r
        )
      })
    }
  }

  const insertStepRecursive = (
    steps: StepResult[],
    parent_step_id: string,
    newStep: StepResult
  ): StepResult[] => {
    return steps.map((step) => {
      if (step.step_id === parent_step_id) {
        return {
          ...step,
          steps: [...(step.steps || []), newStep]
        }
      } else if (step.steps && step.steps.length > 0) {
        return {
          ...step,
          steps: insertStepRecursive(
            step.steps as StepResult[],
            parent_step_id,
            newStep
          )
        }
      }
      return step
    })
  }

  // Consolidated updater for workflow-agent chat streams
  const updateWorkflowAgentRun = (
    currentRuns: WorkflowData[],
    message: WorkflowWebSocketEvent
  ): WorkflowData[] => {
    const {
      run_id,
      content,
      content_type,
      images,
      videos,
      audio,
      response_audio
    } = message

    if (!run_id) return currentRuns

    // Update existing real run if present
    const existingIndex = currentRuns.findIndex((r) => r.run_id === run_id)
    if (existingIndex !== -1) {
      const existingRun = currentRuns[existingIndex]
      const newContent = mergeContent(existingRun.content ?? '', content)

      const updatedRun: WorkflowData = {
        ...existingRun,
        content: newContent ?? existingRun.content ?? '',
        content_type: content_type || existingRun.content_type,
        images: images ?? existingRun.images,
        videos: videos ?? existingRun.videos,
        audio: audio ?? existingRun.audio,
        response_audio: response_audio ?? existingRun.response_audio
      }

      const updatedRuns = [...currentRuns]
      updatedRuns[existingIndex] = updatedRun
      return updatedRuns
    }

    // Replace temp run if present
    const tempRunIndex = currentRuns.findIndex((r) =>
      r.run_id?.startsWith('temp-')
    )
    if (tempRunIndex !== -1) {
      const tempRun = currentRuns[tempRunIndex]
      const mergedContent = mergeContent(tempRun.content ?? '', content)

      const replacedRun: WorkflowData = {
        ...tempRun,
        run_id,
        user_id: message.user_id || tempRun.user_id || '',
        content: mergedContent ?? tempRun.content ?? '',
        content_type: content_type || tempRun.content_type || 'str',
        images: images ?? tempRun.images,
        videos: videos ?? tempRun.videos,
        audio: audio ?? tempRun.audio,
        response_audio: response_audio ?? tempRun.response_audio,
        metrics: message.metrics || tempRun.metrics,
        created_at: message.created_at || tempRun.created_at,
        status: 'RUNNING'
      }

      const updatedRuns = [...currentRuns]
      updatedRuns[tempRunIndex] = replacedRun
      return updatedRuns
    }

    // Otherwise leave state unchanged; fetch should populate later
    return currentRuns
  }

  const handleWorkflowError = (message: WorkflowWebSocketEvent) => {
    const msgSessionId = getMessageSessionId(message)
    const { run_id } = message

    // Prefer explicit error field; fallback to content if string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawError: any = (message as any).error
    const errorText =
      typeof rawError === 'string'
        ? rawError
        : typeof message.content === 'string'
          ? message.content
          : 'An error occurred while processing the workflow.'

    if (msgSessionId) {
      // Always update streaming state for this session
      setSessionStreamingState(msgSessionId, {
        isStreaming: false,
        streamingMessage: '',
        wasStreamed: true
      })
    }

    if (run_id && msgSessionId) {
      setStreamingWorkflowRuns(msgSessionId, (currentRuns) => {
        return currentRuns.map((run) => {
          if (run.run_id !== run_id) return run
          return {
            ...run,
            status: 'ERROR',
            content: run.content || errorText,
            content_type: 'str'
          }
        })
      })
    }
    toast.error({
      description: errorText
    })

    // Record event after state updates
    recordEvent(message)
  }

  const handleStepStarted = (message: WorkflowWebSocketEvent) => {
    const { run_id, step_id, parent_step_id, event } = message
    const msgSessionId = getMessageSessionId(message)

    if (!run_id || !step_id || !msgSessionId) return

    setStreamingWorkflowRuns(msgSessionId, (currentRuns) => {
      return currentRuns.map((run) => {
        if (run.run_id !== run_id) return run

        const stepType = getEventType(event)
        const newStep: StepResult = {
          content: message.content || '',
          step_name: message.step_name || '',
          step_id,
          ...(stepType && { step_type: stepType }),
          executor_type: message.executor_type || '',
          executor_name: message.executor_name || '',
          step_run_id: message.step_run_id || '',
          images: message.images || null,
          videos: message.videos || null,
          audio: message.audio || null,
          metrics: message.metrics || { time: 0 },
          status: 'RUNNING',
          success: false,
          error: null,
          stop: false,
          steps: []
        }

        if (parent_step_id) {
          // Insert as a nested step
          return {
            ...run,
            step_results: insertStepRecursive(
              run.step_results,
              parent_step_id,
              newStep
            )
          }
        }

        // Otherwise, add or update at the top level
        const existingStepIndex = run.step_results.findIndex(
          (step) => step.step_id === step_id
        )

        if (existingStepIndex === -1) {
          return {
            ...run,
            step_results: [...run.step_results, newStep]
          }
        } else {
          const existingStep = run.step_results[existingStepIndex]
          const updatedStep: StepResult = {
            ...existingStep,
            content: message.content || existingStep.content,
            step_name: message.step_name || existingStep.step_name,
            executor_type: message.executor_type || existingStep.executor_type,
            executor_name: message.executor_name || existingStep.executor_name,
            step_run_id: message.step_run_id || existingStep.step_run_id,
            images: message.images || existingStep.images,
            videos: message.videos || existingStep.videos,
            audio: message.audio || existingStep.audio,
            metrics: message.metrics || existingStep.metrics,
            steps: existingStep.steps || []
          }

          const updatedStepResults = [...run.step_results]
          updatedStepResults[existingStepIndex] = updatedStep

          return {
            ...run,
            step_results: updatedStepResults
          }
        }
      })
    })

    recordEvent(message)
  }

  const handleExecutorRunStarted = (message: WorkflowWebSocketEvent) => {
    const {
      session_id: msgSessionId,
      run_id,
      step_id,
      team_session_id,
      workflow_run_id,
      parent_run_id
    } = message

    const sessionIdForUpdate = msgSessionId || getMessageSessionId(message)
    if (!run_id || !sessionIdForUpdate) return

    setStreamingWorkflowRuns(sessionIdForUpdate, (currentRuns) => {
      const newExecutorRun: StepExecutorRun = {
        content: message.content || '',
        content_type: message.content_type || 'str',
        metrics: message.metrics || { time: 0 },
        model: message.model || '',
        model_provider: message.model_provider || '',
        run_id,
        agent_id: message.agent_id,
        agent_name: message.agent_name,
        team_id: message.team_id,
        team_name: message.team_name,
        workflow_step_id: step_id || '',
        session_id: msgSessionId || '',
        team_session_id: team_session_id || '',
        parent_run_id: workflow_run_id || parent_run_id || '',
        created_at: message.created_at,
        status: 'RUNNING',
        messages: message.messages || []
      }

      const targetParentRunId = workflow_run_id || parent_run_id || ''

      return currentRuns.map((workflowRun) => {
        // Scope updates to the parent workflow run if provided
        if (targetParentRunId && workflowRun.run_id !== targetParentRunId) {
          return workflowRun
        }

        // If team_session_id exists, still keep the run intact; just append for now
        // Future: branch per member when UI supports it

        // If step exists, we still append executor run at run level for rendering
        return {
          ...workflowRun,
          step_executor_runs: [
            ...workflowRun.step_executor_runs,
            newExecutorRun
          ]
        }
      })
    })

    recordEvent(message)
  }

  const updateStepCompletedRecursive = (
    steps: StepResult[],
    message: WorkflowWebSocketEvent
  ): StepResult[] => {
    return steps.map((step) => {
      if (step.step_id === message.step_id) {
        // Update this step
        return {
          ...step,
          content: message.content || step.content,
          status: 'COMPLETED',
          success: message.success !== undefined ? message.success : true,
          error: message.error || step.error,
          stop: message.stop !== undefined ? message.stop : step.stop,
          steps: message.steps || step.steps || []
        }
      } else if (step.steps && step.steps.length > 0) {
        // Recursively update nested steps
        return {
          ...step,
          steps: updateStepCompletedRecursive(step.steps, message)
        }
      }
      return step
    })
  }

  const handleStepCompleted = (message: WorkflowWebSocketEvent) => {
    const { run_id, step_id } = message
    const msgSessionId = getMessageSessionId(message)

    if (!run_id || !step_id || !msgSessionId) return

    setStreamingWorkflowRuns(msgSessionId, (currentRuns) => {
      return currentRuns.map((run) => {
        if (run.run_id !== run_id) return run

        return {
          ...run,
          step_results: updateStepCompletedRecursive(run.step_results, message)
        }
      })
    })

    recordEvent(message)
  }

  const handleWorkflowStatusUpdate = (message: WorkflowWebSocketEvent) => {
    const { session_id: msgSessionId, run_id, event, content } = message

    // Process if we have the required IDs - process for all sessions
    if (!run_id) return

    const sessionIdForUpdate = msgSessionId || getMessageSessionId(message)
    if (!sessionIdForUpdate) return

    // Always update session-specific streaming state when workflow completes for that session
    setSessionStreamingState(sessionIdForUpdate, {
      isStreaming: false,
      streamingMessage: '',
      wasStreamed: true
    })

    setStreamingWorkflowRuns(sessionIdForUpdate, (currentRuns) => {
      return currentRuns.map((run) => {
        if (run.run_id === run_id) {
          return {
            ...run,
            // Include run_input from formData in the completion event
            content: content || run.content,
            status: event === 'WorkflowCompleted' ? 'COMPLETED' : 'ERROR'
          }
        }
        return run
      })
    })

    // If API data is available for this session, reconcile with streaming now
    if (
      sessionIdForUpdate &&
      Array.isArray(workflowRunsQuery.data) &&
      workflowRunsQuery.data.length > 0
    ) {
      mergeApiRunsWithStreaming(
        sessionIdForUpdate,
        workflowRunsQuery.data as WorkflowData[]
      )
    }

    recordEvent(message)
  }

  // Completes a workflow-agent chat run when server emits WorkflowAgentCompleted.
  // Only updates if the run exists locally; otherwise, ignore.
  const handleWorkflowAgentCompleted = (message: WorkflowWebSocketEvent) => {
    const {
      session_id: msgSessionId,
      run_id,
      content,
      content_type,
      images,
      videos,
      audio,
      response_audio
    } = message

    if (!run_id) return

    const sessionIdForUpdate = msgSessionId || getMessageSessionId(message)

    // Always stop streaming for this session
    if (sessionIdForUpdate) {
      setSessionStreamingState(sessionIdForUpdate, {
        isStreaming: false,
        streamingMessage: '',
        wasStreamed: true
      })
    }

    if (!sessionIdForUpdate) return

    let didUpdate = false
    setStreamingWorkflowRuns(sessionIdForUpdate, (currentRuns) => {
      const existingIndex = currentRuns.findIndex((r) => r.run_id === run_id)
      if (existingIndex === -1) {
        // No local run found; do nothing
        return currentRuns
      }

      didUpdate = true
      const existingRun = currentRuns[existingIndex]
      const updatedRun: WorkflowData = {
        ...existingRun,
        content: content ?? existingRun.content,
        images: images ?? existingRun.images,
        videos: videos ?? existingRun.videos,
        audio: audio ?? existingRun.audio,
        response_audio: response_audio ?? existingRun.response_audio,
        content_type: content_type || existingRun.content_type,
        status: 'COMPLETED'
      }

      const updatedRuns = [...currentRuns]
      updatedRuns[existingIndex] = updatedRun
      return updatedRuns
    })

    if (didUpdate) {
      recordEvent(message)
    }

    // If API data is available for this session, reconcile with streaming now
    if (
      sessionIdForUpdate &&
      Array.isArray(workflowRunsQuery.data) &&
      workflowRunsQuery.data.length > 0
    ) {
      mergeApiRunsWithStreaming(
        sessionIdForUpdate,
        workflowRunsQuery.data as WorkflowData[]
      )
    }
    if (
      sessionIdForUpdate &&
      Array.isArray(workflowRunsQuery.data) &&
      workflowRunsQuery.data.length > 0
    ) {
      mergeApiRunsWithStreaming(
        sessionIdForUpdate,
        workflowRunsQuery.data as WorkflowData[]
      )
    }
  }

  const handleResponseContent = (message: WorkflowWebSocketEvent) => {
    const {
      session_id: msgSessionId,
      team_session_id,
      run_id,
      content,
      content_type,
      event,
      images,
      videos,
      audio,
      response_audio
    } = message

    // Process if we have the required IDs - process for all sessions
    if (!run_id || !msgSessionId) return

    // Special handling: workflow agent chat streams only RunContent with workflow_agent
    // In this mode, there may be no WorkflowStarted/RunStarted events. Ensure the run exists
    // and stream content directly into the run itself.
    const isWorkflowAgent = Boolean(message?.workflow_agent)

    // Always update streaming state for this session
    if (msgSessionId && content) {
      const currentState = getSessionStreamingState(msgSessionId)
      setSessionStreamingState(msgSessionId, {
        isStreaming: true,
        streamingMessage:
          typeof content === 'string'
            ? currentState.streamingMessage + content
            : currentState.streamingMessage,
        wasStreamed: true
      })
    }

    // For workflow-agent streams, switch to this session only if it matches current workflow
    // But always update the streaming data for the session
    if (isWorkflowAgent && msgSessionId && !sessionId) {
      setSession(msgSessionId)
      queryClient.setQueryData(
        sessionsListQueryKey,
        (oldData: InfiniteSessionsData | undefined) => {
          const sessionData: SessionEntry = {
            session_id: msgSessionId,
            session_name: getCurrentRunInput(),
            created_at: message.created_at,
            session_state: ''
          }

          if (!oldData || !oldData.pages) {
            return {
              pages: [
                { data: [sessionData], meta: { page: 1, total_pages: 1 } }
              ],
              pageParams: [1]
            }
          }

          return {
            ...oldData,
            pages: oldData.pages.map((page, idx) =>
              idx === 0
                ? {
                    ...page,
                    data: [
                      sessionData,
                      ...page.data.filter(
                        (s: SessionEntry) => s.session_id !== msgSessionId
                      )
                    ]
                  }
                : page
            )
          }
        }
      )
    }

    // Always update streaming runs for the session in the message
    setStreamingWorkflowRuns(msgSessionId, (currentRuns) => {
      if (isWorkflowAgent) {
        // Update content for workflow-agent run
        const updatedRuns = updateWorkflowAgentRun(currentRuns, message)

        return updatedRuns
      }

      return currentRuns.map((run) => {
        // Update step_executor_runs for this run
        const updatedStepExecutorRuns = run.step_executor_runs.map(
          (step_executor_run) => {
            // Handle RunCompleted & TeamRunCompleted: set content & status to COMPLETED
            if (
              (event === RunEvent.RunCompleted ||
                event === TeamRunEvent.TeamRunCompleted) &&
              step_executor_run.run_id === run_id
            ) {
              const completedExecutorRun: StepExecutorRun = {
                ...step_executor_run,
                content: content ?? step_executor_run.content,
                content_type: content_type || step_executor_run.content_type,
                images: images ?? step_executor_run.images,
                videos: videos ?? step_executor_run.videos,
                audio: audio ?? step_executor_run.audio,
                response_audio:
                  response_audio ?? step_executor_run.response_audio,
                status: 'COMPLETED'
              }
              return completedExecutorRun
            }
            // Handle streaming content
            if (step_executor_run.run_id === run_id && !team_session_id) {
              const newContent = mergeContent(
                step_executor_run.content ?? '',
                content
              )
              const runningExecutorRun: StepExecutorRun = {
                ...step_executor_run,
                content: newContent,
                content_type: content_type || step_executor_run.content_type,
                images: images ?? step_executor_run.images,
                videos: videos ?? step_executor_run.videos,
                audio: audio ?? step_executor_run.audio,
                response_audio:
                  response_audio ?? step_executor_run.response_audio,
                workflow_step_id: message.step_id,
                status: 'RUNNING'
              }
              return runningExecutorRun
            } else {
              // TO DO: implement member responses
              return step_executor_run
            }
          }
        )

        // Return the updated run with new step_executor_runs
        return {
          ...run,
          step_executor_runs: updatedStepExecutorRuns
        }
      })
    })

    // Only skip logging RunContent events for workflow_agent streams; log everything else
    const shouldRecordEvent =
      !isWorkflowAgent ||
      (event !== RunEvent.RunContent && event !== TeamRunEvent.TeamRunContent)
    if (shouldRecordEvent) {
      recordEvent(message)
    }
  }

  const handleToolCallStarted = (message: WorkflowWebSocketEvent) => {
    const { run_id, tool } = message
    const msgSessionId = getMessageSessionId(message)

    if (!run_id || !tool || !msgSessionId) return

    setStreamingWorkflowRuns(msgSessionId, (currentRuns) => {
      return currentRuns.map((run) => {
        // Find the step executor run by run_id and add the new tool
        const updatedStepExecutorRuns = run.step_executor_runs.map(
          (executorRun) => {
            if (executorRun.run_id === run_id) {
              // Create a complete tool call by spreading the tool data
              const newTool: ToolCall = {
                ...tool
              }

              return {
                ...executorRun,
                tools: [...(executorRun.tools || []), newTool]
              }
            }
            return executorRun
          }
        )

        return {
          ...run,
          step_executor_runs: updatedStepExecutorRuns
        }
      })
    })

    recordEvent(message)
  }

  const handleToolCallCompleted = (message: WorkflowWebSocketEvent) => {
    const { run_id, tool } = message
    const msgSessionId = getMessageSessionId(message)

    if (!run_id || !tool || !msgSessionId) return

    setStreamingWorkflowRuns(msgSessionId, (currentRuns) => {
      return currentRuns.map((run) => {
        // Find the step executor run by run_id and update the tool with completion data
        const updatedStepExecutorRuns = run.step_executor_runs.map(
          (executorRun) => {
            if (executorRun.run_id === run_id) {
              // Find the tool by tool_call_id and update it with all completion data
              const updatedTools = (executorRun.tools || []).map(
                (existingTool) => {
                  if (existingTool.tool_call_id === tool.tool_call_id) {
                    // Spread the new tool data over the existing tool
                    return {
                      ...existingTool,
                      ...tool
                    }
                  }
                  return existingTool
                }
              )

              return {
                ...executorRun,
                tools: updatedTools
              }
            }
            return executorRun
          }
        )

        return {
          ...run,
          step_executor_runs: updatedStepExecutorRuns
        }
      })
    })

    recordEvent(message)
  }

  // Store API data in history runs when query successfully returns data for non-streaming session
  useEffect(() => {
    if (!sessionId) return
    const state = getSessionStreamingState(sessionId)
    const isStreaming = state?.isStreaming || false

    // Only store API data if:
    // 1. Query is successful
    // 2. Session is not currently streaming
    // 3. API data exists
    if (
      !isStreaming &&
      workflowRunsQuery.isSuccess &&
      Array.isArray(workflowRunsQuery.data) &&
      workflowRunsQuery.data.length > 0
    ) {
      mergeApiRunsWithStreaming(
        sessionId,
        workflowRunsQuery.data as WorkflowData[]
      )
    }
  }, [
    sessionId,
    workflowRunsQuery.data,
    workflowRunsQuery.isSuccess,
    getSessionStreamingState
  ])

  // Clear history and streaming runs when API explicitly returns empty and session isn't streaming
  useEffect(() => {
    if (!sessionId) return
    const state = getSessionStreamingState(sessionId)
    const isStreaming = state?.isStreaming || false
    if (isStreaming) return
    if (
      Array.isArray(workflowRunsQuery.data) &&
      workflowRunsQuery.data.length === 0
    ) {
      clearSessionRuns(sessionId)
    }
  }, [sessionId, workflowRunsQuery.data, getSessionStreamingState])

  return {
    ...workflowRunsQuery,
    data: mergedData, // Use merged data instead of just API data
    isRealtime: true,
    messagesProcessed: messageQueue.length // Track how many messages are pending
  }
}

export default useWorkflowRunsRealtime
