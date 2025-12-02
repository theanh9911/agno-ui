import { create } from 'zustand'

import { type PlaygroundConversation } from '@/types/playground'

interface TeamsPlaygroundStore {
  streamingErrorMessage: string
  setStreamingErrorMessage: (streamingErrorMessage: string) => void
  isStreaming: boolean
  setIsStreaming: (isStreaming: boolean) => void
  isMembersAccordionCollapsed: boolean
  setIsMembersAccordionCollapsed: (isCollapsed: boolean) => void

  messages: PlaygroundConversation[]
  setMessages: (
    messages:
      | PlaygroundConversation[]
      | ((prevMessages: PlaygroundConversation[]) => PlaygroundConversation[])
  ) => void
}

export const useTeamsPlaygroundStore = create<TeamsPlaygroundStore>((set) => ({
  streamingErrorMessage: '',
  setStreamingErrorMessage: (streamingErrorMessage) =>
    set(() => ({ streamingErrorMessage })),
  isStreaming: false,
  setIsStreaming: (isStreaming) => set(() => ({ isStreaming })),
  isMembersAccordionCollapsed: false,
  setIsMembersAccordionCollapsed: (isCollapsed) =>
    set(() => ({ isMembersAccordionCollapsed: isCollapsed })),

  messages: [],
  setMessages: (messages) =>
    set((state) => ({
      messages:
        typeof messages === 'function' ? messages(state.messages) : messages
    }))
}))
