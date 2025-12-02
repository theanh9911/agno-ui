import { create } from 'zustand'

import { type WorkflowData as WorkflowRunData } from '@/types/workflow'
import { WorkflowFormData } from '@/schema/workflowSchema'

type FormData = WorkflowFormData

// Session-specific streaming state
interface SessionStreamingState {
  isStreaming: boolean
  streamingMessage: string
  wasStreamed: boolean
}

interface WorkflowsStore {
  // Session-specific streaming state
  sessionStreamingStates: Record<string, SessionStreamingState>
  setSessionStreamingState: (
    sessionId: string,
    state: Partial<SessionStreamingState>
  ) => void

  getSessionStreamingState: (sessionId: string) => SessionStreamingState
  resetAllStreaming: () => void

  formData: FormData
  setFormData: (formData: FormData | ((prev: FormData) => FormData)) => void

  // History workflow runs keyed by session_id (from API)
  historyWorkflowRuns: Record<string, WorkflowRunData[]>
  setHistoryWorkflowRuns: (
    sessionId: string,
    runs: WorkflowRunData[] | ((prev: WorkflowRunData[]) => WorkflowRunData[])
  ) => void

  getHistoryWorkflowRuns: (sessionId: string) => WorkflowRunData[]
  // Streaming workflow runs keyed by session_id (from WebSocket)
  streamingWorkflowRuns: Record<string, WorkflowRunData[]>
  setStreamingWorkflowRuns: (
    sessionId: string,
    runs: WorkflowRunData[] | ((prev: WorkflowRunData[]) => WorkflowRunData[])
  ) => void
  clearStreamingWorkflowRuns: (sessionId: string) => void
  getStreamingWorkflowRuns: (sessionId: string) => WorkflowRunData[]
  clearAllStreamingWorkflowRuns: () => void

  // Form validation state
  isFormValid: boolean
  setIsFormValid: (isValid: boolean) => void
}

export const useWorkflowsStore = create<WorkflowsStore>((set, get) => ({
  // Session-specific streaming state
  sessionStreamingStates: {},
  setSessionStreamingState: (sessionId, state) => {
    const currentState = get()
    const currentSessionState = currentState.sessionStreamingStates[
      sessionId
    ] || {
      isStreaming: false,
      streamingMessage: '',
      wasStreamed: false
    }

    // Check if state actually changed to prevent unnecessary updates
    const hasChanges =
      (state.isStreaming !== undefined &&
        state.isStreaming !== currentSessionState.isStreaming) ||
      (state.streamingMessage !== undefined &&
        state.streamingMessage !== currentSessionState.streamingMessage) ||
      (state.wasStreamed !== undefined &&
        state.wasStreamed !== currentSessionState.wasStreamed)

    if (!hasChanges) {
      return // Skip update if nothing changed
    }

    set({
      sessionStreamingStates: {
        ...currentState.sessionStreamingStates,
        [sessionId]: {
          ...currentSessionState,
          ...state
        }
      }
    })
  },
  getSessionStreamingState: (sessionId) => {
    const state = get()
    return (
      state.sessionStreamingStates[sessionId] || {
        isStreaming: false,
        streamingMessage: '',
        wasStreamed: false
      }
    )
  },
  resetAllStreaming: () => {
    const currentStates = get().sessionStreamingStates
    const currentRuns = get().streamingWorkflowRuns
    if (
      Object.keys(currentStates).length === 0 &&
      Object.keys(currentRuns).length === 0
    ) {
      return
    }
    set({
      sessionStreamingStates: {},
      streamingWorkflowRuns: {}
    })
  },

  formData: {},
  setFormData: (formData) => {
    const currentState = get()
    const newFormData =
      typeof formData === 'function'
        ? formData(currentState.formData)
        : formData

    // Check if formData actually changed
    if (JSON.stringify(currentState.formData) === JSON.stringify(newFormData)) {
      return // Skip update if no change
    }

    set({ formData: newFormData })
  },

  // History runs by session
  historyWorkflowRuns: {},
  setHistoryWorkflowRuns: (sessionId, runs) => {
    const currentState = get()
    const currentRuns = currentState.historyWorkflowRuns[sessionId] || []
    const newRuns = typeof runs === 'function' ? runs(currentRuns) : runs

    // Check if runs actually changed to prevent unnecessary updates
    if (
      currentRuns.length === newRuns.length &&
      currentRuns.every((run, i) => run?.run_id === newRuns[i]?.run_id)
    ) {
      return // Skip update if no change
    }

    set({
      historyWorkflowRuns: {
        ...currentState.historyWorkflowRuns,
        [sessionId]: newRuns
      }
    })
  },
  getHistoryWorkflowRuns: (sessionId) => {
    const state = get()
    return state.historyWorkflowRuns[sessionId] || []
  },
  // Streaming runs by session
  streamingWorkflowRuns: {},
  setStreamingWorkflowRuns: (sessionId, runs) => {
    const currentState = get()
    const currentRuns = currentState.streamingWorkflowRuns[sessionId] || []
    const newRuns = typeof runs === 'function' ? runs(currentRuns) : runs

    // Check if runs actually changed to prevent unnecessary updates
    // Compare by run_id to avoid re-renders when content updates but structure is same
    const currentRunIds = new Set(
      currentRuns.map((r) => r?.run_id).filter(Boolean)
    )
    const newRunIds = new Set(newRuns.map((r) => r?.run_id).filter(Boolean))

    if (
      currentRunIds.size === newRunIds.size &&
      Array.from(currentRunIds).every((id) => newRunIds.has(id))
    ) {
      // Only update if content actually changed (not just reference)
      // For streaming, we need to check if content/status/events changed
      const hasContentChange = newRuns.some((newRun, idx) => {
        const currentRun = currentRuns[idx]
        if (!currentRun || currentRun.run_id !== newRun.run_id) return true
        // Check if status, content, or events changed
        const eventsChanged =
          JSON.stringify(currentRun.events || []) !==
          JSON.stringify(newRun.events || [])
        return (
          currentRun.status !== newRun.status ||
          currentRun.content !== newRun.content ||
          JSON.stringify(currentRun.step_results) !==
            JSON.stringify(newRun.step_results) ||
          JSON.stringify(currentRun.step_executor_runs) !==
            JSON.stringify(newRun.step_executor_runs) ||
          eventsChanged
        )
      })

      if (!hasContentChange) {
        return // Skip update if no change
      }
    }

    set({
      streamingWorkflowRuns: {
        ...currentState.streamingWorkflowRuns,
        [sessionId]: newRuns
      }
    })
  },
  clearStreamingWorkflowRuns: (sessionId) => {
    const currentState = get()
    const currentRuns = currentState.streamingWorkflowRuns[sessionId] || []
    if (currentRuns.length === 0) return
    set({
      streamingWorkflowRuns: {
        ...currentState.streamingWorkflowRuns,
        [sessionId]: []
      }
    })
  },
  getStreamingWorkflowRuns: (sessionId) => {
    const state = get()
    const runs = state.streamingWorkflowRuns[sessionId] || []

    return runs
  },
  clearAllStreamingWorkflowRuns: () => {
    const current = get().streamingWorkflowRuns
    if (Object.keys(current).length === 0) return
    set({ streamingWorkflowRuns: {} })
  },
  // Form validation state
  isFormValid: false,
  setIsFormValid: (isValid) => {
    const current = get().isFormValid
    if (current === isValid) return // Skip update if no change
    set(() => ({ isFormValid: isValid }))
  }
}))
