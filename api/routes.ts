export const AGNO_API_URL = import.meta.env.VITE_AGNO_API_URL
export const PLAYGROUND_DEMO_AGENT_URL = 'https://demo.agnoagents.com/v1'
export const APIRoutes = {
  ReadAuthToken: `${AGNO_API_URL}/v1/user/token-header`,

  // Evals

  GetEvalsRuns: (endpoint: string) => `${endpoint}/eval-runs`,
  DeleteEvalsRuns: (endpoint: string) => `${endpoint}/eval-runs`,
  UpdateEvalsRuns: (endpoint: string, eval_run_id: string) =>
    `${endpoint}/eval-runs/${eval_run_id}`,

  CreateEvalRun: (endpoint: string) => `${endpoint}/eval-runs`,

  // OS System
  GetOsConfig: (url: string) => `${url}/config`,
  GetOsConfigStatus: (url: string) => `${url}/health`,
  GetOsAgentById: (url: string, agent_id: string) =>
    `${url}/agents/${agent_id}`,
  GetOsTeamById: (url: string, team_id: string) => `${url}/teams/${team_id}`,
  GetOsWorkflowById: (url: string, workflow_id: string) =>
    `${url}/workflows/${workflow_id}`,

  GetOSModels: (url: string) => `${url}/models`,

  // Dashboard
  ReadDashboardSessions: `${AGNO_API_URL}/v1/dashboard/sessions`,
  ReadDashboardTokens: `${AGNO_API_URL}/v1/dashboard/tokens`,
  ReadDashboardUsers: `${AGNO_API_URL}/v1/dashboard/users`,
  ReadDashboardRuns: `${AGNO_API_URL}/v1/dashboard/runs`,
  ReadDashboardSessionsExists: `${AGNO_API_URL}/v1/dashboard/session-exists`,

  //Sessions
  //Agent Sessions

  GetAgentSessions: (url: string) => `${url}/sessions`,
  GetAgentSession: (url: string, sessionId: string) =>
    `${url}/sessions/${sessionId}`,
  ReadAgentRuns: (url: string, sessionId: string) =>
    `${url}/sessions/${sessionId}/runs`,
  RenameSession: (url: string, sessionId: string) =>
    `${url}/sessions/${sessionId}/rename`,
  DeleteSession: (url: string, sessionId: string) =>
    `${url}/sessions/${sessionId}`,
  GetManualStatus: (url: string, userId: string) =>
    `${url}/control/status/${userId}`,
  ToggleManualMode: (url: string) => `${url}/control/toggle-manual-mode`,
  GetManualSessions: (url: string) => `${url}/custom-sessions`,

  // Metrics

  GetMetrics: (url: string) => `${url}/metrics`,
  RefreshMetrics: (url: string) => `${url}/metrics/refresh`,
  // Team Sessions
  GetTeamSessions: `${AGNO_API_URL}/v1/team-sessions`,
  GetTeamSession: `${AGNO_API_URL}/v1/team-sessions/{session-id}`,

  //Team Runs
  GetTeamRuns: `${AGNO_API_URL}/v1/team-runs`,

  // Playground
  PlaygroundStatus: (PlaygroundApiUrl: string) => `${PlaygroundApiUrl}/status`,

  GetPlaygroundEnpoints: `${AGNO_API_URL}/v1/playground/endpoint/get`,
  CreatePlaygroundEndpoint: `${AGNO_API_URL}/v1/playground/endpoint/create`,
  DeletePlaygroundEndpoint: `${AGNO_API_URL}/v1/playground/endpoint/{id_playground_endpoint}`,

  GetPlaygroundAgents: (PlaygroundApiUrl: string) =>
    `${PlaygroundApiUrl}/agents`,
  PlaygroundAgentRun: (PlaygroundApiUrl: string) =>
    `${PlaygroundApiUrl}/agents/{agent_id}/runs`,

  PlaygroundAgentRunContinue: (PlaygroundApiUrl: string) =>
    `${PlaygroundApiUrl}/agents/{agent_id}/runs/{run_id}/continue`,

  // Cancel runs
  PlaygroundAgentRunCancel: (PlaygroundApiUrl: string) =>
    `${PlaygroundApiUrl}/agents/{agent_id}/runs/{run_id}/cancel`,
  PlaygroundTeamRunCancel: (PlaygroundApiUrl: string) =>
    `${PlaygroundApiUrl}/teams/{team_id}/runs/{run_id}/cancel`,

  GetAgentMemories: (PlaygroundApiUrl: string) =>
    `${PlaygroundApiUrl}/agents/{agent_id}/memories`,

  GetAllPlaygroundAgentSessions: (PlaygroundApiUrl: string) =>
    `${PlaygroundApiUrl}/agents/{agent_id}/sessions`,

  GetPlaygroundAgentSession: (PlaygroundApiUrl: string) =>
    `${PlaygroundApiUrl}/agents/{agent_id}/sessions/{session_id}`,
  RenamePlaygroundAgentSession: (PlaygroundApiUrl: string) =>
    `${PlaygroundApiUrl}/agents/{agent_id}/sessions/{session_id}/rename`,
  DeletePlaygroundAgentSession: (PlaygroundApiUrl: string) =>
    `${PlaygroundApiUrl}/agents/{agent_id}/sessions/{session_id}`,

  GetPlaygroundAgentSessionRuns: (PlaygroundApiUrl: string) =>
    `${PlaygroundApiUrl}/agents/{agent_id}/sessions/{session_id}/runs`,

  //Workflows

  GetPlaygroundWorkflows: (workflowUrl: string) => `${workflowUrl}/workflows`,

  GetWorkflow: (workflowUrl: string, workflowId: string) =>
    `${workflowUrl}/workflows/${workflowId}`,

  WorkflowRun: (workflowUrl: string) =>
    `${workflowUrl}/workflows/{workflow_id}/runs`,

  WorkflowRunCancel: (workflowUrl: string) =>
    `${workflowUrl}/workflows/{workflow_id}/runs/{run_id}/cancel`,

  GetAllPlaygroundWorkflowSessions: (workflowUrl: string) =>
    `${workflowUrl}/workflows/{workflow_id}/sessions/{session_id}`,

  GetPlaygroundWorkflowSessions: (workflowUrl: string) =>
    `${workflowUrl}/workflows/{workflow_id}/sessions`,

  RenamePlaygroundWorkflowSession: (workflowUrl: string) =>
    `${workflowUrl}/playground/v1/workflows/{workflow_id}/sessions/{session_id}/rename`,

  DeletePlaygroundWorkflowSession: (workflowUrl: string) =>
    `${workflowUrl}/playground/workflows/{workflow_id}/sessions/{session_id}`,

  GetPlaygroundWorkflowSessionRuns: (workflowUrl: string) =>
    `${workflowUrl}/workflows/{workflow_id}/sessions/{session_id}/runs`,

  // Teams

  GetPlaygroundTeams: (PlaygroundApiUrl: string) => `${PlaygroundApiUrl}/teams`,

  GetPlaygroundTeam: (PlaygroundApiUrl: string, teamId: string) =>
    `${PlaygroundApiUrl}/teams/${teamId}`,

  PlaygroundTeamRuns: (PlaygroundApiUrl: string, teamId: string) =>
    `${PlaygroundApiUrl}/teams/${teamId}/runs`,

  GetAllPlaygroundTeamSessions: (PlaygroundApiUrl: string, teamId: string) =>
    `${PlaygroundApiUrl}/teams/${teamId}/sessions`,

  GetPlaygroundTeamSessionRuns: (PlaygroundApiUrl: string) =>
    `${PlaygroundApiUrl}/teams/{team_id}/sessions/{session_id}/runs`,

  GetTeamMemories: (PlaygroundApiUrl: string, teamId: string) =>
    `${PlaygroundApiUrl}/team/${teamId}/memories`,

  GetPlaygroundTeamSession: (
    PlaygroundApiUrl: string,
    teamId: string,
    sessionId: string
  ) => `${PlaygroundApiUrl}/teams/${teamId}/sessions/${sessionId}`,

  RenamePlaygroundTeamSession: (
    PlaygroundApiUrl: string,
    teamId: string,
    sessionId: string
  ) => `${PlaygroundApiUrl}/teams/${teamId}/sessions/${sessionId}/rename`,

  DeletePlaygroundTeamSession: (
    PlaygroundApiUrl: string,
    teamId: string,
    sessionId: string
  ) => `${PlaygroundApiUrl}/teams/${teamId}/sessions/${sessionId}`,

  // Memory Page
  GetMemories: (url: string) => `${url}/memories`,
  GetMemory: (url: string, memoryId: string) => `${url}/memories/${memoryId}`,
  DeleteMemory: (url: string) => `${url}/memories`,
  UpdateMemory: (url: string, memoryId: string) =>
    `${url}/memories/${memoryId}`,
  CreateMemory: (url: string) => `${url}/memories`,
  GetAllMemoryUsers: (url: string) => `${url}/user_memory_stats`,

  //knowledge
  GetDocument: (endpoint: string) => `${endpoint}/knowledge/content`,
  GetDocumentById: (endpoint: string, contentId: string) =>
    `${endpoint}/knowledge/content/${contentId}`,
  UploadDocument: (endpoint: string) => `${endpoint}/knowledge/content`,
  EditDocument: (endpoint: string, contentId: string) =>
    `${endpoint}/knowledge/content/${contentId}`,
  DeleteDocument: (endpoint: string, contentId: string) =>
    `${endpoint}/knowledge/content/${contentId}`,
  DeleteAllDocuments: (endpoint: string) => `${endpoint}/knowledge/content`,
  GetDocumentStatus: (endpoint: string, contentId: string) =>
    `${endpoint}/knowledge/content/${contentId}/status`,
  GetKnowledgeConfig: (endpoint: string) => `${endpoint}/knowledge/config`,

  //traces
  GetTraces: (endpoint: string) => `${endpoint}/traces`,
  GetTraceById: (endpoint: string, traceId: string) =>
    `${endpoint}/traces/${traceId}`,
  GetTracesGroupBySession: (endpoint: string) =>
    `${endpoint}/trace_session_stats`
}
