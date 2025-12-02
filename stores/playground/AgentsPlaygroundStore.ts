import { create } from 'zustand'

import { type PlaygroundConversation } from '@/types/playground'

interface AgentsPlaygroundStore {
  streamingErrorMessage: string
  setStreamingErrorMessage: (streamingErrorMessage: string) => void
  isStreaming: boolean
  setIsStreaming: (isStreaming: boolean) => void

  messages: PlaygroundConversation[]
  setMessages: (
    messages:
      | PlaygroundConversation[]
      | ((prevMessages: PlaygroundConversation[]) => PlaygroundConversation[])
  ) => void
}

export const useAgentsPlaygroundStore = create<AgentsPlaygroundStore>(
  (set) => ({
    streamingErrorMessage: '',
    setStreamingErrorMessage: (streamingErrorMessage) =>
      set(() => ({ streamingErrorMessage })),
    isStreaming: false,
    setIsStreaming: (isStreaming) => set(() => ({ isStreaming })),

    messages: [],
    setMessages: (messages) =>
      set((state) => ({
        messages:
          typeof messages === 'function' ? messages(state.messages) : messages
      }))
  })
)
