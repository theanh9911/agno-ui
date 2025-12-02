import { PlaygroundMessage, PlaygroundConversation } from '@/types/playground'

/**
 * Utility functions for working with conversation data structure
 */

/**
 * Converts flat message array to conversation objects
 * Groups user and agent messages into conversation pairs
 */
export const messagesToConversations = (
  messages: PlaygroundMessage[]
): PlaygroundConversation[] => {
  const conversations: PlaygroundConversation[] = []

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i]

    if (message.role === 'user') {
      const conversationId = message.run_id
      const conversation: PlaygroundConversation = {
        id: conversationId,
        run_id: message.run_id,
        user_message: message,
        created_at: message.created_at || Date.now()
      }

      // Look for the corresponding agent message
      const nextMessage = messages[i + 1]
      if (
        nextMessage &&
        nextMessage.role === 'agent' &&
        nextMessage.run_id === message.run_id
      ) {
        conversation.agent_message = nextMessage
        i++ // Skip the agent message in the next iteration
      }

      conversations.push(conversation)
    }
  }

  return conversations
}

/**
 * Converts conversation objects back to flat message array
 * For backward compatibility with existing components
 */
export const conversationsToMessages = (
  conversations: PlaygroundConversation[]
): PlaygroundMessage[] => {
  const messages: PlaygroundMessage[] = []

  conversations.forEach((conversation) => {
    messages.push(conversation.user_message)
    if (conversation.agent_message) {
      messages.push(conversation.agent_message)
    }
  })

  return messages
}

/**
 * Gets the latest conversation from the conversations array
 */
export const getLatestConversation = (
  conversations: PlaygroundConversation[]
): PlaygroundConversation | null => {
  return conversations.length > 0
    ? conversations[conversations.length - 1]
    : null
}

/**
 * Gets all conversations for a specific run_id
 */
export const getConversationsByRunId = (
  conversations: PlaygroundConversation[],
  runId: string
): PlaygroundConversation[] => {
  return conversations.filter((conversation) => conversation.run_id === runId)
}

/**
 * Creates a new conversation object
 */
export const createConversation = (
  userMessage: PlaygroundMessage,
  agentMessage?: PlaygroundMessage
): PlaygroundConversation => {
  const conversationId = userMessage.run_id

  return {
    id: conversationId,
    run_id: userMessage.run_id,
    user_message: userMessage,
    agent_message: agentMessage,
    created_at: userMessage.created_at || Date.now()
  }
}
