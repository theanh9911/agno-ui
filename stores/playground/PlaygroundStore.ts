import { ToolCall } from '@/types/Agent'
import { create } from 'zustand'

interface ReasoningStreamingState {
  stepIndex: number
  charIndex: number
}

interface ToolChoice {
  tool_call_id: string
  action: 'confirm' | 'reject' | 'pending'
  rejection_reason?: string
}
interface PlaygroundStore {
  isConfigDialogOpen: boolean
  setIsConfigDialogOpen: (isOpen: boolean) => void
  chatInputRef: React.RefObject<HTMLTextAreaElement | null>
  inputMessage: string
  setInputMessage: (message: string) => void
  // Reasoning streaming state
  reasoningStreaming: ReasoningStreamingState
  updateReasoningStepIndex: (stepIndex: number) => void
  updateReasoningCharIndex: (stepIndex: number, charIndex: number) => void
  resetReasoningStreaming: () => void
  runId: string | null
  setRunId: (runId: string | null) => void
  tools: ToolCall[]
  setTools: (tools: ToolCall[]) => void
  disableHITL: boolean

  userInputValues: Record<string, Record<string, string>>
  setUserInputValues: (
    userInputValues:
      | Record<string, Record<string, string>>
      | ((
          prev: Record<string, Record<string, string>>
        ) => Record<string, Record<string, string>>)
  ) => void
  toolChoices: Record<string, ToolChoice>
  setToolChoices: (toolChoices: Record<string, ToolChoice>) => void
  toolRejectionReasons: Record<string, string>
  setToolRejectionReasons: (
    toolRejectionReasons: Record<string, string>
  ) => void
}

export const usePlaygroundStore = create<PlaygroundStore>((set) => ({
  // Config dialog state
  isConfigDialogOpen: false,
  setIsConfigDialogOpen: (isOpen) =>
    set(() => ({ isConfigDialogOpen: isOpen })),
  // Teams state
  chatInputRef: { current: null },
  inputMessage: '',
  setInputMessage: (message) => set(() => ({ inputMessage: message })),
  // Reasoning streaming state
  reasoningStreaming: {
    stepIndex: 0,
    charIndex: 0
  },
  updateReasoningStepIndex: (stepIndex) =>
    set((state) => ({
      reasoningStreaming: {
        ...state.reasoningStreaming,
        stepIndex,
        charIndex: 0 // Reset char index when moving to next step
      }
    })),
  updateReasoningCharIndex: (stepIndex, charIndex) =>
    set((state) => ({
      reasoningStreaming: {
        ...state.reasoningStreaming,
        stepIndex,
        charIndex
      }
    })),
  resetReasoningStreaming: () =>
    set(() => ({
      reasoningStreaming: {
        stepIndex: 0,
        charIndex: 0
      }
    })),
  runId: null,
  setRunId: (runId) => set(() => ({ runId })),
  tools: [],
  setTools: (tools) => set(() => ({ tools })),
  disableHITL: false,

  userInputValues: {},
  setUserInputValues: (userInputValues) =>
    set((state) => ({
      userInputValues:
        typeof userInputValues === 'function'
          ? userInputValues(state.userInputValues)
          : userInputValues
    })),
  toolChoices: {},
  setToolChoices: (toolChoices) => set(() => ({ toolChoices })),
  toolRejectionReasons: {},
  setToolRejectionReasons: (toolRejectionReasons) =>
    set(() => ({ toolRejectionReasons }))
}))

/**
 * File Upload Store
 */
export interface FileData {
  file: File
  preview: string | null
}

export type FileStore = {
  files: FileData[]
  addFile: (file: FileData) => void
  removeFile: (index: number) => void
  clearFiles: () => void
}

export const useUploadFileStore = create<FileStore>((set) => ({
  files: [],
  addFile: (newFile) =>
    set((state) => ({
      files: [...state.files, newFile]
    })),
  removeFile: (index) =>
    set((state) => ({
      files: state.files.filter((_, i) => i !== index)
    })),
  clearFiles: () => set({ files: [] })
}))
