import { useCallback, useMemo } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

// API and routing
import { APIRoutes } from '@/api/routes'
import { constructEndpointUrl } from '@/utils/playgroundUtils'

// Hooks
import { usePlaygroundQueries } from './usePlaygroundQueries'
import useAIResponseStream from '../streaming/useAIResponseStream'
import { useUser } from '@/api/hooks/queries'

// Stores
import {
  usePlaygroundStore,
  useTeamsPlaygroundStore,
  useAgentsPlaygroundStore,
  useUploadFileStore
} from '@/stores/playground'
import { useOSStore } from '@/stores/OSStore'

// Types
import {
  RunResponseContent,
  ToolCall,
  AgentSessionDataWithTeamAndWorkflow
} from '@/types/Agent'
import { RunEvent, TeamRunEvent, PlaygroundMessage } from '@/types/playground'

// Utilities
import {
  eventKeyUtils,
  sessionUtils,
  intermediateStepsUtils,
  contentUtils
} from '@/utils/streamHandler'
import { eventProcessors } from '@/utils/streamHandler/eventProcessors'

// Constants
import { CACHE_KEYS } from '@/constants'
import { useAgentsQuery } from './useAgentsQuery'
import { useTeamsQuery } from './useTeamsQuery'
import { useFilterType } from '@/hooks/useFilterType'
import { FilterType } from '@/types/filter'

/**
 * Clean, organized AI Stream Handler Hook
 *
 * Responsibilities:
 * - Handle streaming AI responses
 * - Update UI with real-time message updates
 * - Manage intermediate steps and reasoning
 * - Handle tool calls and HITL interactions
 * - Manage session state and caching
 */
const useAIStreamHandler = () => {
  // ============================================================================
  // STORE SETUP & SELECTORS
  // ============================================================================
  const { isTeam, isWorkflow, type } = useFilterType()
  const { setRunId, runId } = usePlaygroundStore()

  const teamsStore = useTeamsPlaygroundStore()
  const agentsStore = useAgentsPlaygroundStore()

  const setMessages = isTeam ? teamsStore.setMessages : agentsStore.setMessages
  const setIsStreaming = isTeam
    ? teamsStore.setIsStreaming
    : agentsStore.setIsStreaming
  const setStreamingErrorMessage = isTeam
    ? teamsStore.setStreamingErrorMessage
    : agentsStore.setStreamingErrorMessage

  // ============================================================================
  // HOOKS & DATA
  // ============================================================================
  const { data: user } = useUser()
  const { streamResponse } = useAIResponseStream()
  const queryClient = useQueryClient()
  const { data: agents } = useAgentsQuery()
  const { data: teams } = useTeamsQuery()
  const {
    selectedId,
    session: sessionId,
    setSession: setSessionId
  } = usePlaygroundQueries()

  const { currentOS } = useOSStore()
  // Use the same dbId calculation as other hooks
  const dbId = isTeam
    ? (teams?.find((team) => team.id === selectedId)?.db_id ?? '')
    : (agents?.find((agent) => agent.id === selectedId)?.db_id ?? '')
  const table = isTeam
    ? (teams?.find((team) => team.id === selectedId)?.sessions?.session_table ??
      '')
    : (agents?.find((agent) => agent.id === selectedId)?.sessions
        ?.session_table ?? '')
  const selectedEndpoint = currentOS?.endpoint_url ?? null

  const files = useUploadFileStore((s) => s.files)
  const clearFiles = useUploadFileStore((s) => s.clearFiles)
  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================
  const userId = user?.user.username ?? null
  const OSId = currentOS?.id ?? null

  const queryKey = useMemo(
    () =>
      CACHE_KEYS.PLAYGROUND_SESSIONS({
        OSId,
        dbId,
        id: selectedId ?? '',
        table,
        type: isWorkflow
          ? FilterType.Workflows
          : isTeam
            ? FilterType.Teams
            : FilterType.Agents
      }),
    [isTeam, isWorkflow, selectedId, OSId, dbId]
  )

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  /**
   * Updates messages with error state
   */
  const updateMessagesWithErrorState = useCallback(() => {
    setMessages((prevMessages) => {
      const newMessages = [...prevMessages]
      const lastMessage = newMessages[newMessages.length - 1]
      if (lastMessage?.agent_message) {
        lastMessage.agent_message.streamingError = true
      }
      return newMessages
    })
  }, [setMessages])

  /**
   * Handles error states and cleanup
   */
  const handleErrorState = useCallback(
    (error: Error | string, sessionId?: string | null) => {
      updateMessagesWithErrorState()
      setStreamingErrorMessage(error instanceof Error ? error.message : error)

      if (sessionId) {
        sessionUtils.removeSessionFromCache(queryClient, queryKey, sessionId)
      }
    },
    [
      queryClient,
      queryKey,
      setStreamingErrorMessage,
      updateMessagesWithErrorState
    ]
  )

  /**
   * Updates session data in cache
   */
  const handleSessionUpdate = useCallback(
    (
      chunk_session_id: string,
      chunk_created_at: number | string,
      formData: FormData
    ) => {
      if (chunk_session_id) {
        setSessionId(chunk_session_id)
        // Optimistically seed the per-session query cache so UI can show name immediately
        const agentSessionKey = [
          CACHE_KEYS.AGENT_SESSION({
            currentOS: currentOS?.endpoint_url ?? '',
            session_id: chunk_session_id,
            type,
            dbId
          })
        ]
        const optimisticSession = {
          session_id: chunk_session_id,
          session_name: (formData.get('message') as string) || 'Session',
          created_at: chunk_created_at,
          session_state: ''
        }
        queryClient.setQueryData(
          agentSessionKey as unknown as string[],
          (old: AgentSessionDataWithTeamAndWorkflow | undefined) =>
            old ??
            (optimisticSession as unknown as AgentSessionDataWithTeamAndWorkflow)
        )
        return sessionUtils.updateSessionInCache(
          queryClient,
          queryKey,
          chunk_session_id,
          chunk_created_at,
          formData,
          sessionId || null
        )
      }
      return chunk_session_id
    },
    [
      setSessionId,
      sessionId,
      queryClient,
      queryKey,
      currentOS?.endpoint_url,
      type,
      dbId
    ]
  )

  /**
   * Helper to update the last agent message
   */
  const updateLastAgentMessage = useCallback(
    (updater: (message: PlaygroundMessage) => PlaygroundMessage) => {
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages]
        const lastConversation = newMessages[newMessages.length - 1]
        if (lastConversation?.agent_message) {
          lastConversation.agent_message = updater(
            lastConversation.agent_message
          )
        }
        return newMessages
      })
    },
    [setMessages]
  )

  /**
   * Handle run completion to fetch session data and update caches
   */
  const handleRunCompleted = useCallback(async () => {
    if (!currentOS?.endpoint_url || !dbId || !user?.user?.user_id) {
      return
    }
    //
  }, [
    queryClient,
    currentOS?.endpoint_url,
    type,
    dbId,
    queryKey,
    user?.user?.user_id
  ])

  // ============================================================================
  // CHUNK PROCESSING
  // ============================================================================

  /**
   * Processes individual stream chunks
   */
  const processChunk = useCallback(
    (
      chunk: RunResponseContent,
      newSessionId: string | null,
      formData?: FormData
    ): string | null => {
      // Always update intermediate steps first
      const eventKeySuffix = chunk?.tool?.tool_call_id || undefined
      const eventKey = eventKeyUtils.generateEventKey(chunk, eventKeySuffix)

      updateLastAgentMessage((message) => ({
        ...message,
        intermediateSteps: intermediateStepsUtils.updateIntermediateStep(
          message.intermediateSteps || [],
          eventKey,
          chunk
        )
      }))

      // Handle session updates for specific events
      const isSessionEvent =
        chunk.event === RunEvent.RunStarted ||
        chunk.event === TeamRunEvent.TeamRunStarted ||
        chunk.event === RunEvent.ReasoningStarted ||
        chunk.event === TeamRunEvent.TeamReasoningStarted

      if (chunk.session_id && chunk.created_at && isSessionEvent) {
        newSessionId = handleSessionUpdate(
          chunk.session_id,
          chunk.created_at,
          formData || new FormData()
        )
        // For agents/teams we just track session via query/update; no extra store needed here
      }

      // Update run_id for conversations when run starts
      if (chunk.run_id && isSessionEvent) {
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages]
          const lastConversation = newMessages[newMessages.length - 1]

          if (lastConversation) {
            lastConversation.user_message.run_id = chunk.run_id
            lastConversation.run_id = chunk.run_id
            if (lastConversation.agent_message) {
              lastConversation.agent_message.run_id = chunk.run_id
            }
          }

          return newMessages
        })
        // Persist run id for cancel API
        setRunId(chunk.run_id)
      }

      // Process event-specific logic using processors
      const resetReasoningStreaming = () => {
        const resetFn = usePlaygroundStore.getState().resetReasoningStreaming
        resetFn()
        updateLastAgentMessage((message) => ({
          ...message,
          is_reasoning_streaming: true
        }))
      }

      // Route to appropriate event processor
      switch (chunk.event) {
        case RunEvent.RunContent:
        case RunEvent.RunOutput:
          // For teams, member responses are stored in intermediate steps only (already handled above)
          // For agents, process content normally to update main message
          if (!isTeam) {
            eventProcessors.processContentEvent(chunk, updateLastAgentMessage)
          }
          // Note: For teams, intermediate steps are already updated above via updateIntermediateStep()
          // This ensures member responses are preserved but don't interfere with main streaming
          break
        case TeamRunEvent.TeamRunContent:
          // Always process these as they represent the main response
          eventProcessors.processContentEvent(chunk, updateLastAgentMessage)
          break

        case RunEvent.ToolCallStarted:
        case TeamRunEvent.TeamToolCallStarted:
        case RunEvent.ToolCallCompleted:
        case TeamRunEvent.TeamToolCallCompleted:
          eventProcessors.processToolCallEvent(
            chunk,
            updateLastAgentMessage,
            isTeam
          )
          break

        case RunEvent.ReasoningStarted:
        case TeamRunEvent.TeamReasoningStarted:
          eventProcessors.processRunStarted(chunk, resetReasoningStreaming)
          break

        case RunEvent.ReasoningStep:
        case TeamRunEvent.TeamReasoningStep:
          eventProcessors.processReasoningStep(chunk, updateLastAgentMessage)
          break

        case RunEvent.ReasoningCompleted:
        case TeamRunEvent.TeamReasoningCompleted:
          eventProcessors.processReasoningCompleted(
            chunk,
            updateLastAgentMessage
          )
          break

        case RunEvent.RunContinued:
          eventProcessors.processRunContinued(chunk, updateLastAgentMessage)
          break

        case RunEvent.RunPaused:
          eventProcessors.processRunPaused(
            chunk,
            updateLastAgentMessage,
            setRunId,
            isTeam
          )
          if (chunk.session_id && chunk.created_at && formData) {
            newSessionId = handleSessionUpdate(
              chunk.session_id,
              chunk.created_at,
              formData
            )
          }
          break

        case RunEvent.RunError:
        case TeamRunEvent.TeamRunError:
          handleErrorState(chunk.content as string, newSessionId)
          break

        case RunEvent.RunCompleted: {
          // In team mode, member completions should NOT overwrite the main team message.
          // Only finalize content for agent mode.
          if (!isTeam) {
            eventProcessors.processRunCompleted(
              chunk,
              updateLastAgentMessage,
              isTeam,
              handleRunCompleted
            )
            // Mark output as completed for agent runs
            updateLastAgentMessage((message) => ({
              ...message,
              output_completed: true
            }))
          }
          break
        }
        case TeamRunEvent.TeamRunCompleted: {
          if (chunk.run_id) {
            setMessages((prevMessages) => {
              const newMessages = [...prevMessages]
              const lastConversation = newMessages[newMessages.length - 1]

              if (
                lastConversation &&
                lastConversation.run_id !== chunk.run_id
              ) {
                lastConversation.run_id = chunk.run_id
                lastConversation.user_message.run_id = chunk.run_id
                if (lastConversation.agent_message) {
                  lastConversation.agent_message.run_id = chunk.run_id
                }
              }

              return newMessages
            })
            setRunId(chunk.run_id)
          }

          // Finalize the main team message content only for team completion
          eventProcessors.processRunCompleted(
            chunk,
            updateLastAgentMessage,
            isTeam,
            handleRunCompleted
          )
          // Mark both output and team response as completed
          updateLastAgentMessage((message) => ({
            ...message,
            output_completed: true,
            team_response_completed: true
          }))
          break
        }

        case 'MemoryUpdateStarted':
        case 'TeamMemoryUpdateStarted':
        case 'MemoryUpdateCompleted':
        case 'TeamMemoryUpdateCompleted':
          // No additional logic needed - intermediate steps already updated
          break
      }

      // Handle session ID updates
      if (chunk.session_id && chunk.session_id !== newSessionId) {
        newSessionId = chunk.session_id
        setSessionId(chunk.session_id)
      }

      return newSessionId
    },
    [
      updateLastAgentMessage,
      handleSessionUpdate,
      handleErrorState,
      setRunId,
      isTeam,
      setSessionId
    ]
  )

  // ============================================================================
  // STREAM HANDLING
  // ============================================================================

  /**
   * Common stream request handler
   */
  const handleStreamRequest = useCallback(
    async (
      apiUrl: string,
      requestBody: FormData | Record<string, unknown>,
      formDataForSession?: FormData
    ) => {
      setIsStreaming(true)
      let newSessionId = sessionId

      await streamResponse({
        apiUrl,
        requestBody,
        onChunk: (chunk: RunResponseContent) => {
          newSessionId =
            processChunk(chunk, newSessionId || null, formDataForSession) ||
            newSessionId
        },
        onError: (error: Error) => {
          handleErrorState(error, newSessionId)
        },
        onComplete: () => {}
      })
    },
    [setIsStreaming, sessionId, streamResponse, processChunk, handleErrorState]
  )

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  /**
   * Main stream response handler for new messages
   */
  const { mutateAsync: handleStreamResponse } = useMutation({
    mutationFn: async (input: string | FormData) => {
      const formData = input instanceof FormData ? input : new FormData()
      if (typeof input === 'string') {
        formData.append('message', input)
      }

      // Clean up any previous streaming errors
      setMessages((prevMessages) => {
        const lastMessage = prevMessages[prevMessages.length - 1]
        if (
          lastMessage?.agent_message?.streamingError &&
          prevMessages.length > 0
        ) {
          return prevMessages.slice(0, -1)
        }
        return prevMessages
      })

      // Create new conversation with user and agent messages
      const conversationId = `conversation-${Date.now()}`

      // Convert uploaded files to media types for display
      const { images, videos, audios } =
        contentUtils.convertFilesToMediaTypes(files)

      const newConversation = {
        id: conversationId,
        run_id: 'temp',
        user_message: {
          role: 'user' as const,
          run_id: 'temp',
          content: formData.get('message') as string,
          created_at: Math.floor(Date.now() / 1000),
          images,
          videos,
          audios
        },
        agent_message: {
          role: 'agent' as const,
          run_id: 'temp',
          content: '',
          tool_calls: [],
          streamingError: false,
          reasoning: [],
          is_reasoning_streaming: false,
          created_at: Math.floor(Date.now() / 1000) + 1
        },
        created_at: Math.floor(Date.now() / 1000)
      }

      setMessages((prevMessages) => [...prevMessages, newConversation])

      // Prepare API call
      if (!selectedEndpoint || !selectedId) return

      const playgroundRunUrl = isTeam
        ? APIRoutes.PlaygroundTeamRuns(selectedEndpoint, selectedId)
        : APIRoutes.PlaygroundAgentRun(selectedEndpoint).replace(
            '{agent_id}',
            selectedId!
          )

      formData.append('stream', 'true')
      formData.append('session_id', sessionId ?? '')
      formData.append('user_id', userId ?? '')

      files.forEach((fileData) => {
        formData.append('files', fileData.file)
      })
      clearFiles()
      clearFiles()
      await handleStreamRequest(playgroundRunUrl, formData, formData)
    },
    onError: (error: Error) => {
      handleErrorState(error)
    },
    onSettled: () => {
      setIsStreaming(false)
    }
  })

  /**
   * Continue a paused run with user input
   */
  const { mutateAsync: handleContinueRun } = useMutation({
    mutationFn: async (tools: ToolCall[]) => {
      if (!runId) {
        throw new Error('No active run to continue')
      }

      const endpointUrl = constructEndpointUrl(selectedEndpoint)
      const playgroundRunContinueUrl = APIRoutes.PlaygroundAgentRunContinue(
        endpointUrl
      )
        .replace('{agent_id}', selectedId!)
        .replace('{run_id}', runId)

      const formData = new FormData()
      formData.append('session_id', sessionId ?? '')
      formData.append('user_id', userId ?? '')
      formData.append('tools', JSON.stringify(tools))

      await handleStreamRequest(playgroundRunContinueUrl, formData, formData)
    },
    onError: (error: Error) => {
      handleErrorState(error)
    },
    onSettled: () => {
      setIsStreaming(false)
    }
  })

  return {
    handleStreamResponse,
    handleContinueRun
  }
}

export default useAIStreamHandler
