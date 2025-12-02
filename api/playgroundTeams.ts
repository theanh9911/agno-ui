import { request } from '@/utils/request'
import { APIRoutes } from '@/api/routes'
import { TeamSessions } from '@/types/PlaygroundTeams'
import { Memories } from '@/types/playground'
import { Pagination } from '@/types/pagination'
import { RunResponseContent } from '@/types/Agent'
import { TeamDetails } from '@/types/os'

export const getPlaygroundTeamsAPI = async (endpoint: string) =>
  request<TeamDetails[]>(APIRoutes.GetPlaygroundTeams(endpoint), 'GET')

export const getPlaygroundTeamAPI = async (endpoint: string, teamId: string) =>
  request<TeamDetails>(APIRoutes.GetPlaygroundTeam(endpoint, teamId), 'GET')

interface TeamSessionsData {
  data: TeamSessions[]
  meta: Pagination
}

export const getAllPlaygroundTeamSessionsAPI = async (
  endpoint: string,
  teamId: string,

  page: number = 1,

  limit?: number,
  userId?: string
) =>
  request<TeamSessionsData>(
    APIRoutes.GetAllPlaygroundTeamSessions(endpoint, teamId),
    'GET',
    {
      queryParam: {
        page,
        ...(userId ? { user_id: userId } : {}),
        ...(limit ? { limit } : {})
      }
    }
  )

export const getPlaygroundTeamSessionAPI = async (
  endpoint: string,
  teamId: string,
  sessionId: string,
  userId?: string
) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request<any>(
    APIRoutes.GetPlaygroundTeamSession(endpoint, teamId, sessionId),
    'GET',
    {
      queryParam: userId !== undefined ? { user_id: userId } : {}
    }
  )

export const getPlaygroundTeamSessionRunsAPI = async (
  sessionId: string,
  teamId: string,
  PlaygroundApiUrl: string
) => {
  return request<RunResponseContent[]>(
    APIRoutes.GetPlaygroundTeamSessionRuns(PlaygroundApiUrl)
      .replace('{team_id}', teamId)
      .replace('{session_id}', sessionId),
    'GET'
  )
}
export const deletePlaygroundTeamSessionAPI = async (
  sessionId: string,
  endpoint: string,
  teamId: string
) =>
  request(
    APIRoutes.DeletePlaygroundTeamSession(endpoint, teamId, sessionId),
    'DELETE'
  )

export const renamePlaygroundTeamSessionAPI = async (
  sessionId: string,
  newTitle: string,
  endpoint: string,
  teamId: string
) =>
  request<{ message: string }>(
    APIRoutes.RenamePlaygroundTeamSession(endpoint, teamId, sessionId),
    'POST',
    {
      body: {
        session_name: newTitle
      }
    }
  )

export const getTeamsMemoriesAPI = async (
  endpoint: string,
  teamId: string,
  userId: string
) =>
  request<Memories[]>(APIRoutes.GetTeamMemories(endpoint, teamId), 'GET', {
    queryParam: {
      user_id: userId
    }
  })
