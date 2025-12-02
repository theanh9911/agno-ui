export enum ChartEnum {
  USERS_COUNT = 'users_count',
  AGENT_RUNS_COUNT = 'agent_runs_count',
  AGENT_SESSIONS_COUNT = 'agent_sessions_count',
  TEAM_RUNS_COUNT = 'team_runs_count',
  TEAM_SESSIONS_COUNT = 'team_sessions_count',
  WORKFLOW_RUNS_COUNT = 'workflow_runs_count',
  WORKFLOW_SESSIONS_COUNT = 'workflow_sessions_count',
  TOKEN_METRICS = 'token_metrics',
  MODELS_RUNS = 'model_metrics'
}

export const labelMap: Record<ChartEnum, string> = {
  [ChartEnum.USERS_COUNT]: 'Users',
  [ChartEnum.AGENT_RUNS_COUNT]: 'Agent Runs',
  [ChartEnum.AGENT_SESSIONS_COUNT]: 'Agent Sessions',
  [ChartEnum.TEAM_RUNS_COUNT]: 'Team Runs',
  [ChartEnum.TEAM_SESSIONS_COUNT]: 'Team Sessions',
  [ChartEnum.WORKFLOW_RUNS_COUNT]: 'Workflow Runs',
  [ChartEnum.WORKFLOW_SESSIONS_COUNT]: 'Workflow Sessions',
  [ChartEnum.TOKEN_METRICS]: 'Total tokens',
  [ChartEnum.MODELS_RUNS]: 'Models Runs'
}

export const chartConfigs: { chartType: ChartEnum; title: string }[] = [
  { chartType: ChartEnum.USERS_COUNT, title: 'Users' },
  { chartType: ChartEnum.AGENT_RUNS_COUNT, title: 'Agent Runs' },
  { chartType: ChartEnum.AGENT_SESSIONS_COUNT, title: 'Agent Sessions' },
  { chartType: ChartEnum.TEAM_RUNS_COUNT, title: 'Team Runs' },
  { chartType: ChartEnum.TEAM_SESSIONS_COUNT, title: 'Team Sessions' },
  { chartType: ChartEnum.WORKFLOW_RUNS_COUNT, title: 'Workflow Runs' },
  { chartType: ChartEnum.WORKFLOW_SESSIONS_COUNT, title: 'Workflow Sessions' }
]
