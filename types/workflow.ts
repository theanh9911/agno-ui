import { IconType } from '@/components/ui/icon'
import { Message, Metrics, ImageData, VideoData, AudioData } from './Agent'
import { ResponseAudio } from './playground'

export enum WorkflowEvent {
  WorkflowStarted = 'WorkflowStarted',
  WorkflowCompleted = 'WorkflowCompleted',
  WorkflowFailed = 'WorkflowFailed',
  StepStarted = 'StepStarted',
  StepCompleted = 'StepCompleted',
  ParallelExecutionStarted = 'ParallelExecutionStarted',
  ParallelExecutionCompleted = 'ParallelExecutionCompleted',
  ConditionExecutionStarted = 'ConditionExecutionStarted',
  ConditionExecutionCompleted = 'ConditionExecutionCompleted',
  LoopExecutionStarted = 'LoopExecutionStarted',
  LoopExecutionCompleted = 'LoopExecutionCompleted',
  RouterExecutionStarted = 'RouterExecutionStarted',
  RouterExecutionCompleted = 'RouterExecutionCompleted',
  StepsExecutionStarted = 'StepsExecutionStarted',
  StepsExecutionCompleted = 'StepsExecutionCompleted',
  WorkflowAgentStarted = 'WorkflowAgentStarted',
  WorkflowAgentCompleted = 'WorkflowAgentCompleted'
}
export type WorkflowStatus =
  | 'PENDING'
  | 'RUNNING'
  | 'COMPLETED'
  | 'ERROR'
  | 'CANCELLED'
  | 'PAUSED'

export type WorkflowData = {
  run_id: string
  run_input: string
  user_id: string
  content: string | object
  content_type: string
  status: WorkflowStatus
  error?: string | null
  step_results: StepResult[]
  step_executor_runs: StepExecutorRun[]
  metrics: RunMetrics
  created_at: number
  images?: ImageData[]
  videos?: VideoData[]
  audio?: AudioData[]
  response_audio?: ResponseAudio
  // All realtime websocket events associated with this workflow run
  events?: WorkflowRealtimeEvent[]
}

export type StepResult = {
  content: string | object | null
  step_name?: string
  step_id?: string
  step_type?: StepType
  executor_type?: string
  executor_name?: string
  step_run_id: string
  created_at?: string
  run_id?: string
  images?: ImageData[]
  videos?: VideoData[]
  audio?: AudioData[]
  response_audio?: ResponseAudio
  tools?: ToolCall[]
  metrics: Metrics
  success: boolean
  error: string | null
  stop: boolean
  steps?: StepResult[]
  status?: WorkflowStatus
}

export type StepExecutorRun = {
  content?: string | object | null
  content_type?: string
  metrics?: Metrics
  model?: string
  model_provider?: string
  run_id?: string
  agent_id?: string
  agent_name?: string
  team_session_id?: string
  team_id?: string
  team_name?: string
  member_responses?: StepExecutorRun[]
  session_id: string
  parent_run_id: string
  formatted_tool_calls?: string[]
  created_at?: number
  status?: WorkflowStatus
  messages?: Message[]
  tools?: ToolCall[]
  workflow_step_id?: string
  images?: ImageData[]
  videos?: VideoData[]
  audio?: AudioData[]
  response_audio?: ResponseAudio
}

export type RunMetrics = {
  total_steps: number
  steps: Record<
    string,
    {
      step_name: string
      executor_type: string
      executor_name: string
      metrics: Metrics
    }
  >
}

export type ToolCall = {
  tool_call_id: string
  tool_name: string
  tool_args: {
    member_id: string
    task_description: string
    expected_output: string
  }
  tool_call_error: boolean
  result: string
  metrics: {
    time: number
  }
  stop_after_tool_call: boolean
  created_at: number
  requires_confirmation: null | boolean
  confirmed: null | boolean
  confirmation_note: null | string
  requires_user_input: null | boolean
  user_input_schema: null | object
  answered: null | boolean
  external_execution_required: null | boolean
}

// Normalized realtime event structure for workflow websocket messages
export interface WorkflowRealtimeEvent {
  event: string
  created_at: number
  workflow_id?: string
  workflow_name?: string
  workflow_agent?: boolean
  status?: WorkflowStatus
  parent_step_id?: string
  session_id?: string
  run_id?: string
  step_name?: string
  step_id?: string
  step_index?: number
  content?: string | object
  content_type?: string
  step_response?: StepResult
  agent_id?: string
  agent_name?: string
  team_id?: string
  team_name?: string
  model?: string
  model_provider?: string
  tool?: ToolCall
  team_session_id?: string
  workflow_run_id?: string
  parent_run_id?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export interface InputSchemaPropertyItem {
  description?: string
  title?: string
  type?: string | 'string' | 'number' | 'boolean' | 'array' | 'object'
  items?: InputSchemaPropertyItem
  default?: string | number | boolean | null
  anyOf?: Array<{
    type: 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object'
    description?: string
    title?: string
  }>
}

export interface GetWorkflow {
  name: string
  description?: string
  workflow_id: string
  input_schema?: WorkflowStepInputSchema | null
  steps?: WorkflowStep[]
}
import { AgentDetails, TeamDetails } from './os'
import { StepType } from '@/utils/workflows'

export interface Workflow {
  description: string
  workflow_id: string
  name: string
}

export interface WorkflowMetadata {
  name: string
  description: string
}

export interface WorkflowInputFieldDefinition {
  default: string | number | boolean | null
  kind: string
  annotation: string
  required: boolean
}

export type WorkflowInputField = Record<string, WorkflowInputFieldDefinition>

export interface WorkflowInputFieldsResponse {
  name: string
  description: string
  workflow_id: string
  parameters: Record<string, WorkflowInputFieldDefinition>
  storage: string
}

export interface WorkflowDetails {
  id: string
  agents?: AgentDetails
  teams?: TeamDetails
  name: string
  description?: string
  workflow_id: string
  input_schema?: WorkflowStepInputSchema | null
  steps?: WorkflowStep[]
  metadata?: Record<string, unknown>
}
export type WorkflowStepExecutorType = {
  type: 'agent' | 'team' | 'function'
  icon: IconType
  name?: string
  id?: string
  mode?: string
}

export enum WorkflowStepType {
  Step = 'Step',
  Parallel = 'Parallel',
  Loop = 'Loop',
  Condition = 'Condition',
  Router = 'Router',
  Function = 'Function'
}
export const IconToStepTypeMap: Record<StepType, IconType> = {
  Steps: 'divider-vertical',
  Step: 'divider-vertical',
  Parallel: 'network',
  Loop: 'loop',
  Condition: 'split',
  Router: 'replace',
  Function: 'function-square'
}

export interface InputSchemaPropertyItem {
  description?: string
  title?: string
  type?: string | 'string' | 'number' | 'boolean' | 'array' | 'object'
  items?: InputSchemaPropertyItem
  default?: string | number | boolean | null
  anyOf?: Array<{
    type: 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object'
    description?: string
    title?: string
  }>
}

export interface WorkflowStepInputSchema {
  description?: string
  properties?: Record<string, InputSchemaPropertyItem>
  required?: string[]
  title?: string
  type?: string | 'object'
}

export interface WorkflowStep {
  name: string
  description?: string
  input_schema?: WorkflowStepInputSchema | null
  type: StepType
  steps?: WorkflowStep[]
  agent?: AgentDetails
  team?: TeamDetails
}

export interface WorkflowMessage {
  type: 'user' | 'agent'
  content: string
  label?: string
  workflowName?: string
}

export interface WorkflowConfig {
  storage: string
}

export interface WorkflowSession {
  session_id: string
  sessionName: string
  created_at: number
}

export interface WorkflowRun {
  input: {
    args: []
    kwargs: Record<string, Record<string, string>>
  }
  response: {
    event: string
    run_id: string
    content: string
    created_at: number
    session_id: string
    workflow_id: string
    content_type: string
  }
}

export interface WorkflowMemory {
  runs: WorkflowRun[]
}

export interface WorkflowFullSession {
  session_id: string
  workflow_id: string
  user_id: string
  memory: WorkflowMemory
  workflow_data: {
    name: string
    description: string
  }
  session_state: Record<
    string,
    Array<Record<string, Record<string, string> | string>>
  >
  created_at: number
  updated_at: number
}
export interface MessageWithId {
  id: string
  type: 'user' | 'agent'
  content: string
  label?: string
  workflowName?: string
}

export type FormDataValue = string | boolean | number | null
