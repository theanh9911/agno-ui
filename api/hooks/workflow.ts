import { request } from '@/utils/request'

import { APIRoutes } from './routes'
import { WorkflowData, WorkflowDetails } from '@/types/workflow'
import { SessionsData } from '@/types/playground'

interface Workflow {
  description: string
  id: string
  name: string
  db_id: string
}

export const getWorkflowsAPI = async (workflowUrl: string) =>
  request<Workflow[]>(APIRoutes.GetPlaygroundWorkflows(workflowUrl), 'GET', {})

export const getWorkflow = async (workflowUrl: string, workflowId: string) => {
  return request<WorkflowDetails>(
    APIRoutes.GetWorkflow(workflowUrl, workflowId),
    'GET'
  )
}

export const getAllPlaygroundWorkflowSessionsAPI = async (
  base: string,

  workflowId: string
) =>
  request<SessionsData>(
    APIRoutes.GetPlaygroundWorkflowSessions(base).replace(
      '{workflow_id}',
      workflowId
    ),
    'GET'
  )

export const renamePlaygroundWorkflowSessionAPI = async (
  base: string,
  sessionId: string,
  workflowId: string,
  name: string
) =>
  request<{ message: string }>(
    APIRoutes.RenamePlaygroundWorkflowSession(base)
      .replace('{workflow_id}', workflowId)
      .replace('{session_id}', sessionId),
    'POST',
    { body: { name } }
  )

export const deletePlaygroundWorkflowSessionAPI = async (
  base: string,
  sessionId: string,
  workflowId: string
) =>
  request<{ message: string }>(
    APIRoutes.DeletePlaygroundWorkflowSession(base)
      .replace('{workflow_id}', workflowId)
      .replace('{session_id}', sessionId),
    'DELETE'
  )

export const getPlaygroundWorkflowSessionRunsAPI = async (
  base: string,
  workflowId: string,
  sessionId: string,
  userId: string
) =>
  request<WorkflowData[]>(
    APIRoutes.GetPlaygroundWorkflowSessionRuns(base)
      .replace('{workflow_id}', workflowId)
      .replace('{session_id}', sessionId),
    'GET',
    {
      queryParam: {
        user_id: userId
      }
    }
  )
