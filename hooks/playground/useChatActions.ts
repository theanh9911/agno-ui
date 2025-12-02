import { useCallback } from 'react'

import { useAgentsPlaygroundStore } from '@/stores/playground'
import { useTeamsPlaygroundStore } from '@/stores/playground'
import {
  type PlaygroundMessage,
  type PlaygroundConversation
} from '@/types/playground'
import { usePlaygroundQueries } from './usePlaygroundQueries'
import { useWorkflowsStore } from '@/stores/workflowsStore'
import { useFilterType } from '@/hooks/useFilterType'

const useChatActions = () => {
  const { setSession: setSessionId, session } = usePlaygroundQueries()
  const { isTeam } = useFilterType({ autoSetDefault: false })
  const { setSessionStreamingState } = useWorkflowsStore()

  const setTeamMessages = useTeamsPlaygroundStore((state) => state.setMessages)
  const setAgentMessages = useAgentsPlaygroundStore(
    (state) => state.setMessages
  )
  const setMessages = isTeam ? setTeamMessages : setAgentMessages

  const clearChat = useCallback(() => {
    // Clear session-specific streaming state before clearing chat
    if (session) {
      setSessionStreamingState(session, {
        isStreaming: false,
        streamingMessage: ''
      })
    }

    setSessionId(null)
    setMessages([])
  }, [setSessionId, setMessages, session, setSessionStreamingState])

  const addMessage = useCallback(
    (message: PlaygroundMessage) => {
      // For backward compatibility - create or update conversation based on message role
      setMessages((prevMessages) => {
        if (message.role === 'user') {
          // Start new conversation with user message
          // Use run_id as the stable conversation ID to prevent remounting after refetch
          const newConversation: PlaygroundConversation = {
            id: message.run_id,
            run_id: message.run_id,
            user_message: message,
            created_at: message.created_at || Date.now()
          }
          return [...prevMessages, newConversation]
        } else if (message.role === 'agent') {
          // Update last conversation with agent message
          const newMessages = [...prevMessages]
          const lastConversation = newMessages[newMessages.length - 1]
          if (lastConversation && !lastConversation.agent_message) {
            lastConversation.agent_message = message
          }
          return newMessages
        }
        return prevMessages
      })
    },
    [setMessages]
  )

  return {
    clearChat,
    addMessage
  }
}

export default useChatActions
