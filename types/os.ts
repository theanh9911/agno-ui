import { DomainEnum, OS_COMPONENTS } from '@/constants'
import { Model } from './globals'
import { Tool } from './playground'
import { InputSchemaPropertyItem, WorkflowDetails } from './workflow'

export type InputSchema = {
  type: string
  properties: Record<string, InputSchemaPropertyItem>
  required: string[]
  title: string
}

export type Interface = {
  type: string
  version: string
  route: string
}

export type DomainConfig = {
  display_name: string
}
export type DataBase = {
  db_id: string
  domain_config: DomainConfig
  tables?: string[]
}
export type SelectedDatabase = {
  db: DataBase
  table?: string
}
export type Domain = {
  display_name?: string
  dbs: DataBase[]
}
export type DomainType = keyof typeof DomainEnum

type OSComponentDetails = {
  name?: string
  description?: string
}
export type OSAgent = {
  id: string
} & OSComponentDetails
export type OSTeam = {
  id: string
} & OSComponentDetails
export type OSWorkflow = {
  id: string
} & OSComponentDetails

export type ChatConfig = {
  quick_prompts?: Record<string, string[]>
}

export type OSConfig = {
  os_id: string
  interfaces: Interface[]
  chat?: ChatConfig
  session: Domain
  knowledge: Domain
  memory: Domain
  evals: Domain
  traces: Domain
  metrics: Domain
  databases: string[]
  agents: OSAgent[]
  teams: OSTeam[]
  workflows: OSWorkflow[]
} & OSComponentDetails

export type OSComponentsType =
  (typeof OS_COMPONENTS)[keyof typeof OS_COMPONENTS]
// V2 config types for Agents

export interface ToolsConfig {
  tools: Tool[]
  tool_call_limit?: number
  tool_choice?: string | Record<string, unknown>
}

export interface SessionsConfig {
  session_table?: string
  add_history_to_context?: boolean
  enable_session_summaries?: boolean
  num_history_runs?: number
  search_session_history?: boolean
  cache_session?: boolean
  add_session_summary_references?: boolean
  num_history_sessions?: number
}

export interface KnowledgeConfig {
  knowledge_table?: string
  add_references?: boolean
  references_format?: string
  enable_agentic_knowledge_filters?: boolean
  knowledge_filters?: Record<string, unknown>
}

export interface MemoryConfig {
  app_name?: string
  app_url?: string
  enable_agentic_memory?: boolean
  enable_user_memories?: boolean
  add_memory_references?: boolean
  memory_table?: string
  model?: Model
  metadata?: Record<string, unknown>
}

export interface ReasoningConfig {
  reasoning?: boolean
  reasoning_agent_id?: string
  reasoning_min_steps?: number
  reasoning_max_steps?: number
  model?: Model
}

export interface DefaultToolsConfig {
  read_chat_history?: boolean
  search_knowledge?: boolean
  update_knowledge?: boolean
  read_tool_call_history?: boolean
  read_team_history?: boolean
  get_member_information_tool?: boolean
}

export interface SystemMessageConfig {
  system_message?: string
  system_message_role?: string
  description?: string
  instructions?: string | string[]
  expected_output?: string
  additional_context?: string
  build_context?: boolean
  markdown?: boolean
  add_name_to_context?: boolean
  add_datetime_to_context?: boolean
  add_location_to_context?: boolean
  add_state_in_messages?: boolean
  add_member_tools_to_system_message?: boolean
  timezone_identifier?: string
}

export interface ExtraMessagesConfig {
  additional_messages?: Array<Record<string, unknown> | string>
  user_message?:
    | string
    | Record<string, unknown>
    | Array<Record<string, unknown> | string>
  user_message_role?: string
  build_user_context?: boolean
}

export interface ResponseSettingsConfig {
  retries?: number
  delay_between_retries?: number
  exponential_backoff?: boolean
  response_model_name?: string
  parser_model_prompt?: string
  parse_response?: boolean
  structured_outputs?: boolean
  use_json_mode?: boolean
  save_response_to_file?: string
  parser_model?: Model
}

export interface StreamingConfig {
  stream?: boolean
  stream_intermediate_steps?: boolean
  stream_member_events?: boolean
}

export interface TeamSettingsConfig {
  mode?: TeamMode
  enable_agentic_context?: boolean
  share_member_interactions?: boolean
  dependencies?: Record<string, unknown>
  add_dependencies_to_context?: boolean
  parent_team_id?: string
  workflow_id?: string
  workflow_session_id?: string
  role?: string
  extra_data?: Record<string, unknown>
  store_events?: boolean
  os_id?: string
}
export interface AgentDetails {
  id: string
  name?: string
  db_id?: string
  input_schema?: InputSchema | null
  // Model
  model?: Model

  tools?: ToolsConfig

  // Knowledge
  knowledge?: KnowledgeConfig

  // Memory can be legacy Memory or new nested config
  memory?: MemoryConfig

  // Sessions as nested config
  sessions?: SessionsConfig

  // Reasoning / defaults / system / messages / response / streaming
  reasoning?: ReasoningConfig
  default_tools?: DefaultToolsConfig
  system_message?: SystemMessageConfig
  extra_messages?: ExtraMessagesConfig
  response_settings?: ResponseSettingsConfig

  streaming?: StreamingConfig
}
export type TeamMode = 'coordinate' | 'collaborate' | 'route'

export interface TeamDetails {
  id: string
  name?: string
  db_id?: string
  input_schema?: InputSchema | null
  // Model
  model?: Model

  tools?: ToolsConfig

  // Knowledge
  knowledge?: KnowledgeConfig

  // Memory can be legacy Memory or new nested config
  memory?: MemoryConfig

  // Sessions as nested config
  sessions?: SessionsConfig

  // Reasoning / defaults / system / messages / response / streaming
  reasoning?: ReasoningConfig
  default_tools?: DefaultToolsConfig
  system_message?: SystemMessageConfig
  extra_messages?: ExtraMessagesConfig
  response_settings?: ResponseSettingsConfig
  streaming?: StreamingConfig
  members: (AgentDetails | TeamDetails)[]
  mode?: TeamMode
  team_settings?: TeamSettingsConfig
}

export type ComponentsList = {
  agents?: AgentDetails[]
  teams?: TeamDetails[]
  workflows?: WorkflowDetails[]
}

export type OSEndpointBasePayload = {
  name: string
  endpoint_url: string
  org_id: string
  tags: string[]
}

export type AddOSEndpointPayload = OSEndpointBasePayload
export enum OSCreateConnectDialogModeType {
  EDIT = 'edit',
  CONNECT = 'connect',
  USER_SELECTION = 'userSelection',
  NEW_USER = 'newUser',
  OLD_USER = 'oldUser'
}

export type OSModel = {
  id: string
  provider: string
}

export type OSModelsResponse = OSModel[]
