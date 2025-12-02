import { useQuery } from '@tanstack/react-query'

// API
import { getAgentRunsAPI } from '@/api/agent'

// Constants and utilities
import { CACHE_KEYS } from '@/constants'

// Utilities
import {
  eventCheckers,
  messageUtils,
  sessionEventUtils
} from '@/utils/streamHandler'
import { messagesToConversations } from '@/utils/conversationUtils'

// Stores
import {
  useAgentsPlaygroundStore,
  usePlaygroundStore,
  useTeamsPlaygroundStore
} from '@/stores/playground'
import { useOSStore } from '@/stores/OSStore'

// Types
import { type PlaygroundMessage } from '@/types/playground'
import { RunResponseContent, ToolCall } from '@/types/Agent'

// Hooks
import { usePlaygroundQueries } from './usePlaygroundQueries'
import { useUser } from '@/api/hooks/queries'
import { buildRunTree } from '@/components/pages/SessionsPage/SessionsDetails/Session/Tabs/RunsTab/utils'
import { useAgentsQuery } from './useAgentsQuery'
import { useTeamsQuery } from './useTeamsQuery'
import { FilterType } from '@/types/filter'
import { useFilterType } from '@/hooks/useFilterType'

/**
 * Refactored session fetching hook using utilities
 *
 * Responsibilities:
 * - Fetch session run data from API
 * - Process runs into playground messages
 * - Handle tool calls, reasoning, and intermediate steps
 * - Update store with processed messages
 */
export default function useFetchPlaygroundSession() {
  // ============================================================================
  // STORE SETUP & SELECTORS
  // ============================================================================
  const { isTeam } = useFilterType({ autoSetDefault: false })
  const setRunId = usePlaygroundStore((s) => s.setRunId)
  const setMessages = useAgentsPlaygroundStore((s) => s.setMessages)
  const setTeamMessages = useTeamsPlaygroundStore((s) => s.setMessages)
  const agentMessages = useAgentsPlaygroundStore((s) => s.messages)
  const teamMessages = useTeamsPlaygroundStore((s) => s.messages)
  const isStreaming = useAgentsPlaygroundStore((state) => state.isStreaming)
  const isStreamingTeam = useTeamsPlaygroundStore((state) => state.isStreaming)
  const { data: agents } = useAgentsQuery()
  const { data: teams } = useTeamsQuery()
  // ============================================================================
  // HOOKS & DATA
  // ============================================================================
  const { session: sessionId, selectedId } = usePlaygroundQueries()

  const dbId = isTeam
    ? (teams?.find((team) => team.id === selectedId)?.db_id ?? '')
    : (agents?.find((agent) => agent.id === selectedId)?.db_id ?? '')
  const table = isTeam
    ? (teams?.find((team) => team.id === selectedId)?.sessions?.session_table ??
      '')
    : (agents?.find((agent) => agent.id === selectedId)?.sessions
        ?.session_table ?? '')
  const { currentOS } = useOSStore()
  const selectedEndpoint = currentOS?.endpoint_url ?? null
  const userId = useUser().data?.user?.username

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  /**
   * Processes tool calls from a run (both direct tools and reasoning messages)
   */
  const processRunToolCalls = (run: RunResponseContent): ToolCall[] => {
    const directTools = run.tools ?? []
    const reasoningTools = messageUtils.processReasoningToolCalls(
      run?.reasoning_messages ?? []
    )
    return [...directTools, ...reasoningTools]
  }

  /**
   * Extracts reasoning steps from run events or extra data
   */
  const extractRunReasoningSteps = (run: RunResponseContent) => {
    // First try to get from completed events
    const completedEvent = run.events?.find((event) =>
      eventCheckers.isCompletedEvent(event.event)
    )

    if (completedEvent?.reasoning_steps) {
      return completedEvent.reasoning_steps
    }

    // Fallback to run extra data
    return run?.reasoning_steps || []
  }

  /**
   * Processes a single run into playground messages
   */
  const processRunToMessages = (
    run: RunResponseContent
  ): PlaygroundMessage[] => {
    const messages: PlaygroundMessage[] = []

    if (run) {
      messages.push(messageUtils.createUserMessage(run))
      const toolCalls = processRunToolCalls(run)

      // Handle paused runs differently
      if (run.status === 'PAUSED') {
        const pausedMessage = messageUtils.createPausedAgentMessage(
          run?.content,
          run.tools,
          run.created_at ?? '',
          run.run_id
        )
        messages.push(pausedMessage)
        setRunId(run.run_id)
      } else {
        // Process completed run
        const intermediateSteps = sessionEventUtils.processRunEvents(run.events)
        const reasoningSteps = extractRunReasoningSteps(run)

        const completedMessage = messageUtils.createCompletedAgentMessage(
          run,
          toolCalls,
          reasoningSteps,
          intermediateSteps
        )
        messages.push(completedMessage)
        setRunId(run.run_id)
      }
    }

    return messages
  }

  /**
   * Processes all messages for final content formatting
   */
  const processMessagesContent = (
    messages: PlaygroundMessage[]
  ): PlaygroundMessage[] => {
    return messages.map(messageUtils.processMessageContent)
  }
  // ============================================================================
  // MAIN QUERY
  // ============================================================================
  return useQuery({
    queryKey: CACHE_KEYS.PLAYGROUND_SESSION_RUNS(
      currentOS?.id ?? null,
      dbId,
      sessionId ?? '',
      selectedId ?? '',
      table
    ),
    queryFn: async () => {
      try {
        const requestPayload = {
          session_id: sessionId!,
          type: isTeam ? FilterType.Teams : FilterType.Agents
        }
        const response = await getAgentRunsAPI(
          selectedEndpoint!,
          dbId,
          requestPayload,
          table
        )
        const result = response.body as RunResponseContent[]

        const sessions = isTeam ? buildRunTree(result) : result
        if (sessions && Array.isArray(sessions)) {
          // Process runs into messages
          const messagesForPlayground = sessions?.flatMap(processRunToMessages)

          // Apply final content processing
          const processedMessages = processMessagesContent(
            messagesForPlayground
          )

          const fetchedConversations =
            messagesToConversations(processedMessages)

          const currentMessages = isTeam ? teamMessages : agentMessages

          // Merge with existing conversations to preserve UI state
          // Match by run_id and preserve existing conversation.id to prevent remounting
          const mergedConversations = fetchedConversations.map(
            (fetchedConv) => {
              const existing = currentMessages.find(
                (curr) => curr.run_id === fetchedConv.run_id
              )

              if (existing) {
                return {
                  ...fetchedConv,
                  id: existing.id
                }
              }

              return fetchedConv
            }
          )

          const setAppropriateMessages = isTeam ? setTeamMessages : setMessages
          setAppropriateMessages(mergedConversations)

          return processedMessages
        }

        return null
      } catch {
        return null
      }
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 0,
    retry: false,
    enabled:
      !!sessionId &&
      !!selectedId &&
      !!selectedEndpoint &&
      !!dbId &&
      !!userId &&
      !!currentOS &&
      !(isTeam ? isStreamingTeam : isStreaming)
  })
}
