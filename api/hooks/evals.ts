import { APIRoutes } from './routes'
import { request } from '@/utils/request'
import { EvalRun } from '@/types/evals'
import { EvalRunType } from '@/types/evals'

export interface EvalsFilter {
  url: string
  db_id: string
  page: number
  limit: number
  agent_id?: string
  model_id?: string
  eval_type?: Array<EvalRunType> | null
  type?: 'agent' | 'team'
  sort_by?: string
  sort_order?: string
  table?: string
}

export interface DeleteEvalsRuns {
  url: string
  db_id: string
  eval_run_ids: string[]
  table?: string
}

export interface UpdateEvalsRuns {
  url: string
  db_id: string
  eval_run_id: string
  eval_run_name: string
  table?: string
}

export const getEvalsRuns = async ({ options }: { options: EvalsFilter }) => {
  const {
    url,
    db_id,
    page,
    limit,
    agent_id,
    model_id,
    eval_type,
    type,
    sort_by,
    sort_order,
    table
  } = options

  return request<EvalRun>(APIRoutes.GetEvalsRuns(url), 'GET', {
    queryParam: Object.fromEntries(
      Object.entries({
        db_id,
        ...(table && { table }),
        page,
        limit,
        agent_id,
        model_id,
        eval_types:
          eval_type && eval_type.length > 0 ? eval_type.join(',') : undefined,
        type,
        sort_by,
        sort_order
      }).filter(
        ([, value]) => value !== undefined && value !== null && value !== ''
      )
    ) as Record<string, string | number>
  })
}

export const deleteEvalsRuns = async (options: DeleteEvalsRuns) => {
  const { url, db_id, eval_run_ids, table } = options
  return request(APIRoutes.DeleteEvalsRuns(url), 'DELETE', {
    body: {
      eval_run_ids
    },
    queryParam: {
      db_id,
      ...(table && { table })
    }
  })
}

export const updateEvalsRuns = async (options: UpdateEvalsRuns) => {
  const { url, db_id, eval_run_id, eval_run_name, table } = options
  return request(APIRoutes.UpdateEvalsRuns(url, eval_run_id), 'PATCH', {
    body: {
      name: eval_run_name
    },
    queryParam: {
      db_id,
      ...(table && { table })
    }
  })
}

export interface CreateEvalRunPayload {
  id: string
  agent_id?: string
  team_id?: string
  input: string
  expected_output?: string
  num_iterations?: number
  name: string
  warmup_runs?: number
  url: string
  db_id: string

  eval_type: EvalRunType
  table?: string
  model_id?: string
  model_provider?: string
  expected_tool_calls?: string[]
}

export const createEvalRun = async (options: CreateEvalRunPayload) => {
  const { url, db_id, table } = options
  return request(APIRoutes.CreateEvalRun(url), 'POST', {
    body: {
      ...options
    },
    queryParam: {
      db_id,
      ...(table && { table })
    }
  })
}
