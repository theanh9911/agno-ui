import {
  AgentDetails,
  OSConfig,
  OSModelsResponse,
  TeamDetails
} from '@/types/os'
import { APIRoutes } from './routes'
import { WorkflowDetails } from '@/types/workflow'
import { request } from '@/utils/request'

type OsConfigStatus = {
  status: 'ok'
}

export const getOsConfig = async (endpoint: string) =>
  request<OSConfig>(APIRoutes.GetOsConfig(endpoint), 'GET')
export const getOsConfigStatus = async (endpoint: string) =>
  request<OsConfigStatus>(APIRoutes.GetOsConfigStatus(endpoint), 'GET')
export const getOSAgentByIdAPI = async (endpoint: string, id: string) => {
  if (!id) {
    throw new Error('agent_id is required to fetch agent')
  }
  return request<AgentDetails>(APIRoutes.GetOsAgentById(endpoint, id), 'GET')
}

export const getOSWorkflowByIdAPI = async (endpoint: string, id: string) => {
  if (!id) {
    throw new Error('workflow_id is required to fetch workflow')
  }
  return request<WorkflowDetails>(
    APIRoutes.GetOsWorkflowById(endpoint, id),
    'GET'
  )
}

export const getOSTeamByIdAPI = async (endpoint: string, id: string) => {
  if (!id) {
    throw new Error('team_id is required to fetch team')
  }
  return request<TeamDetails>(APIRoutes.GetOsTeamById(endpoint, id), 'GET')
}

export const getOSModelsAPI = async (endpoint: string) => {
  return request<OSModelsResponse>(APIRoutes.GetOSModels(endpoint), 'GET')
}
