/* Agent types */
import {
  type VideoData,
  type AgentExtraData,
  type AudioData,
  type ImageData,
  ToolCall,
  Message,
  RunResponseContent,
  ReferencesData,
  Metrics
} from '@/types/Agent'

export interface Tool {
  name: string
  description: string
  parameters: {
    type: string
    properties: {
      symbol: {
        type: string
      }
    }
  }
  requires_confirmation?: boolean
  external_execution?: boolean
}

export interface Storage {
  name: string
}

/* Run Response types */

export enum RunEvent {
  RunStarted = 'RunStarted',
  RunContent = 'RunContent',
  RunCompleted = 'RunCompleted',
  RunError = 'RunError',
  RunOutput = 'RunOutput',
  UpdatingMemory = 'UpdatingMemory',
  ToolCallStarted = 'ToolCallStarted',
  ToolCallCompleted = 'ToolCallCompleted',
  MemoryUpdateStarted = 'MemoryUpdateStarted',
  MemoryUpdateCompleted = 'MemoryUpdateCompleted',
  ReasoningStarted = 'ReasoningStarted',
  ReasoningStep = 'ReasoningStep',
  ReasoningCompleted = 'ReasoningCompleted',
  RunCancelled = 'RunCancelled',
  RunPaused = 'RunPaused',
  RunContinued = 'RunContinued'
}

export enum TeamRunEvent {
  TeamRunStarted = 'TeamRunStarted',
  TeamRunContent = 'TeamRunContent',
  TeamRunCompleted = 'TeamRunCompleted',
  TeamRunError = 'TeamRunError',
  TeamRunCancelled = 'TeamRunCancelled',
  TeamToolCallStarted = 'TeamToolCallStarted',
  TeamToolCallCompleted = 'TeamToolCallCompleted',
  TeamReasoningStarted = 'TeamReasoningStarted',
  TeamReasoningStep = 'TeamReasoningStep',
  TeamReasoningCompleted = 'TeamReasoningCompleted',
  TeamMemoryUpdateStarted = 'TeamMemoryUpdateStarted',
  TeamMemoryUpdateCompleted = 'TeamMemoryUpdateCompleted'
}

export type ToolCallProps = {
  tools?: ToolCall[]
  tool?: ToolCall
  totalToolsCount?: number
  isCompleted?: boolean
  type?: 'single' | 'multiple'
}

export interface ReasoningMessage {
  role?: 'system' | 'user' | 'assistant' | 'tool' | 'reasoning'
  content: string | null
  tool_call_id: string
  tool_name?: string
  tool_args?: Record<string, string>
  tool_call_error?: boolean
  metrics?: {
    duration: number
  }
  created_at?: number
}

export interface PlaygroundAgentExtraData extends AgentExtraData {
  reasoning_messages?: ReasoningMessage[]
}

export interface ResponseAudio {
  id?: string
  content?: string
  transcript?: string
  channels?: number
  sample_rate?: number
}

export interface NewRunResponse {
  status: 'RUNNING' | 'PAUSED' | 'CANCELLED'
}

export interface ReasoningStepContent {
  title?: string
  action?: string
  result?: string
  reasoning?: string
  next_action?: string
  confidence?: number
}

/* Individual Message */
export interface PlaygroundMessage {
  role?: 'system' | 'user' | 'assistant' | 'tool' | 'reasoning' | 'agent'
  run_id: string
  intermediateSteps?: IntermediateStep[]
  content: string
  dynamicContent?: string
  disableHitlForm?: boolean
  tool_calls?: ToolCall[]
  tools?: ToolCall[]
  streamingError?: boolean
  extra_data?: AgentExtraData
  images?: ImageData[]
  videos?: VideoData[]
  audio?: AudioData[]
  audios?: AudioData[]
  reasoning?: ReasoningStepContent[]
  reasoning_steps?: ReasoningStepContent[]
  reasoning_messages?: ReasoningMessage[]
  created_at?: number | string
  response_audio?: ResponseAudio
  is_reasoning_streaming?: boolean
  links?: Array<{
    title: string
    url: string
  }>
  agent_name?: string
  team_name?: string
  references?: ReferencesData[]
  output_completed?: boolean
  team_response_completed?: boolean
  metrics?: Metrics
  session_state?: Record<string, string[]>
}

/* Conversation object containing user and agent message pair */
export interface PlaygroundConversation {
  id: string
  run_id: string
  user_message: PlaygroundMessage
  agent_message?: PlaygroundMessage
  created_at: number | string
}

export interface IntermediateStep {
  event: string
  id: string
  data: {
    // Keep original chunk data for reference
    originalChunk?: RunResponseContent
  }
}

/* Agent Session types */

export interface MemoryChat {
  message?: Message
  messages?: Message[]
  response?: RunResponseContent
}

export interface AgentSession {
  session_id: string
  agent_id?: string
  user_id?: string
  memory?: {
    messages: Message[]
    runs?: MemoryChat[]
    chats?: MemoryChat[]
  }
}
export interface CreatePlaygroundEndpointPayload {
  endpoint: string
  name: string
}
export interface SessionEntry {
  session_id: string
  session_name: string
  created_at: number | string
  updated_at?: number
  session_state: string
}

export interface Memories {
  memory: string
  topics: string[]
  updated_at: string
}

export interface SessionsData {
  data: SessionEntry[]
  meta: { page: number; total_pages: number }
}

export type InfiniteSessionsData = {
  pages: Array<{
    data: SessionEntry[]
    meta: { page: number; total_pages: number }
  }>
  pageParams: []
}
