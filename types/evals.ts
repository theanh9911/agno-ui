import { Pagination } from './pagination'

export enum EvalRunType {
  Accuracy = 'accuracy',
  Reliability = 'reliability',
  Performance = 'performance'
}

export interface AccuracyResultItem {
  score: number
  input: string
  output: string
  reason: string
  expected_output: string
}

export interface AccuracyData {
  results: AccuracyResultItem[]
  [key: string]: number | AccuracyResultItem[]
}

export interface PerformanceData {
  runs: Array<{
    runtime: number
    memory: number
  }>
  result: {
    avg_run_time: number
    max_run_time: number
    min_run_time: number
    p95_run_time: number
    median_run_time: number
    avg_memory_usage: number
    max_memory_usage: number
    min_memory_usage: number
    p95_memory_usage: number
    std_dev_run_time: number
    median_memory_usage: number
    std_dev_memory_usage: number
  }
}

export interface ReliabilityData {
  eval_status: string
  failed_tool_calls: string[]
  passed_tool_calls: string[]
}
export interface EvalRunData {
  agent_id: string
  created_at: string
  evaluated_entity_name: string | null
  id: string
  name: string | null
  team_id: string | null
  eval_type: EvalRunType
  user_id: string
  eval_data: AccuracyData | PerformanceData | ReliabilityData
  model_id: string
  model_provider?: string
  updated_at: string
  eval_input?: {
    input?: string
    expected_output?: string
    expected_tool_calls?: string[]
    num_iterations?: number
    warmup_runs?: number
    additional_context?: string | null
    additional_guidelines?: string | null
  }
}

export interface EvalRun {
  data: EvalRunData[]
  meta: Pagination
}

export type PendingEvalRunData = {
  id: string
  eval_name: string
  entity_id: string
  model: string
  updated_at: string
  type: string
  agent_id?: string
  team_id?: string
}
