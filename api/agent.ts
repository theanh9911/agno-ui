import { APIRoutes } from '@/api/routes'
import {
  AgentSessionDataWithTeamAndWorkflow,
  SessionList,
  type RunResponseContent
} from '@/types/Agent'
import { request } from '@/utils/request'
import { Pagination } from '../types/pagination'
import { FilterType } from '@/types/filter'
import { WorkflowData } from '@/types/workflow'

type AgentReadFilter = {
  user_id?: string
  id_agent_session?: string
  workspace_id?: string
  session_id?: string
  team_id?: string
  current_user_id?: string
  agent_id?: string
  teams_id?: string
  type?: FilterType
}

type AgentSessionReadListFilter = {
  page?: number
  type?: FilterType
  limit?: number
  sort_by?: string
  sort_order?: string
  component_id?: string
} & AgentReadFilter

export interface SessionsListResponse {
  data: SessionList[]
  meta: Pagination
}

export const getSessionsListAPI = async (
  endpoint: string,
  db_id: string,
  filter: AgentSessionReadListFilter,
  table?: string
) =>
  request<SessionsListResponse>(APIRoutes.GetAgentSessions(endpoint), 'GET', {
    queryParam: Object.fromEntries(
      Object.entries({ ...filter, db_id, ...(table && { table }) }).filter(
        ([, value]) => value !== undefined && value !== null && value !== ''
      )
    ) as Record<string, string | number>
  })

export const getSessionAPI = async (
  endpoint: string,
  db_id: string,
  filter: AgentReadFilter,
  table?: string
) => {
  const { session_id, ...restFilter } = filter

  if (!session_id) {
    throw new Error('session_id is required to fetch agent session')
  }

  return request<AgentSessionDataWithTeamAndWorkflow>(
    APIRoutes.GetAgentSession(endpoint, session_id),
    'GET',
    {
      queryParam: Object.fromEntries(
        Object.entries({
          ...restFilter,
          db_id,
          ...(table && { table })
        }).filter(
          ([, value]) => value !== undefined && value !== null && value !== ''
        )
      )
    }
  )
}

// Simplified version to avoid complex conditional types that cause runtime issues
export const getAgentRunsAPI = async (
  endpoint: string,
  db_id: string,
  filter: AgentReadFilter,
  table?: string
) =>
  request<RunResponseContent[] | WorkflowData[]>(
    APIRoutes.ReadAgentRuns(endpoint, filter.session_id!),
    'GET',
    {
      queryParam: Object.fromEntries(
        Object.entries({ ...filter, db_id, ...(table && { table }) }).filter(
          ([, value]) => value !== undefined && value !== null && value !== ''
        )
      ) as Record<string, string>
    }
  )

// Rename Session API
export const renameSessionAPI = async (
  endpoint: string,
  session_id: string,
  db_id: string,
  type: FilterType,
  newName: string,
  table?: string
) =>
  request<{ message: string }>(
    APIRoutes.RenameSession(endpoint, session_id),
    'POST',
    {
      queryParam: Object.fromEntries(
        Object.entries({ type, db_id, ...(table && { table }) }).filter(
          ([, value]) => value !== undefined && value !== null && value !== ''
        )
      ) as Record<string, string>,
      body: { session_name: newName }
    }
  )

// Delete Session API
export const deleteSessionAPI = async (
  endpoint: string,
  session_id: string,
  db_id: string,
  type: FilterType,
  table?: string
) =>
  request<{ message: string }>(
    APIRoutes.DeleteSession(endpoint, session_id),
    'DELETE',
    {
      queryParam: Object.fromEntries(
        Object.entries({ type, db_id, ...(table && { table }) }).filter(
          ([, value]) => value !== undefined && value !== null && value !== ''
        )
      ) as Record<string, string>
    }
  )
