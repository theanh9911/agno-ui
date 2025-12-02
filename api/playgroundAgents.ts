import { APIRoutes } from '@/api/routes'
import { RunResponseContent } from '@/types/Agent'
import { Pagination } from '@/types/pagination'
import { Memories, SessionEntry, type AgentSession } from '@/types/playground'
import { AgentDetails } from '@/types/os'

import { request } from '@/utils/request'

export const getPlaygroundAgentsAPI = async (endpoint: string) =>
  request<AgentDetails[]>(APIRoutes.GetPlaygroundAgents(endpoint), 'GET')

//Sessions
export const renamePlaygroundAgentSessionAPI = async (
  sessionId: string,
  name: string,
  agentId: string,
  endpoint: string
) =>
  request<{ message: string }>(
    APIRoutes.RenamePlaygroundAgentSession(endpoint)
      .replace('{session_id}', sessionId)
      .replace('{agent_id}', agentId),
    'POST',
    {
      body: { session_name: name }
    }
  )

export const deletePlaygroundAgentSessionAPI = async (
  sessionId: string,
  agentId: string,
  endpoint: string
) =>
  request<{ message: string }>(
    APIRoutes.DeletePlaygroundAgentSession(endpoint)
      .replace('{session_id}', sessionId)
      .replace('{agent_id}', agentId),
    'DELETE'
  )

export const getPlaygroundAgentSessionAPI = async (
  sessionId: string,
  agentId: string,
  endpoint: string,
  userId: string
) => {
  const url = APIRoutes.GetPlaygroundAgentSession(endpoint)
    .replace('{session_id}', sessionId)
    .replace('{agent_id}', agentId)

  return request<AgentSession>(url, 'GET', {
    queryParam: {
      user_id: userId
    }
  })
}
export const getPlaygroundAgentSessionRunsAPI = async (
  sessionId: string,
  agentId: string,
  endpoint: string
) => {
  return request<RunResponseContent[]>(
    APIRoutes.GetPlaygroundAgentSessionRuns(endpoint)
      .replace('{agent_id}', agentId)
      .replace('{session_id}', sessionId),
    'GET'
  )
}

interface SessionEntryWithAgent extends SessionEntry {
  data: SessionEntry[]
  meta: Pagination
}

export const getAllPlaygroundAgentSessionsAPI = async (
  endpoint: string,
  agentId: string,
  page: number = 1,
  limit?: number,
  userId?: string
) =>
  request<SessionEntryWithAgent>(
    APIRoutes.GetAllPlaygroundAgentSessions(endpoint).replace(
      '{agent_id}',
      agentId
    ),
    'GET',
    {
      queryParam: {
        page,
        ...(userId ? { user_id: userId } : {}),
        ...(limit ? { limit } : {})
      }
    }
  )

//Endpoints

export const getAgentsMemoriesAPI = async (
  endpoint: string,
  agentId: string,
  userId: string
) =>
  request<Memories[]>(
    APIRoutes.GetAgentMemories(endpoint).replace('{agent_id}', agentId),
    'GET',
    {
      queryParam: {
        user_id: userId
      }
    }
  )
