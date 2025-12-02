import { type AnimationProps } from 'framer-motion'
import { DateRange } from './types/globals'
import { getCacheKey } from './utils/misc'
import { EvalRunType } from './types/evals'
import { SortByValue } from './types/memory'
import { ROUTES } from './routes'
import { FilterType, SortBy } from './types/filter'
import { IconType } from './components/ui/icon'

export const AUTH_TOKEN_HEADER = 'X-AGNO-AUTH-TOKEN'
export const USER_ID_HEADER = 'X-USER-ID'
export const TEAM_ID_HEADER = 'X-TEAM-ID'

interface Workspace {
  workspace_id?: string
  org_id?: string | undefined
}
interface SessionParams extends Workspace {
  currentOS?: string
  session_id?: string
  dbId?: string
  type?: FilterType
  table?: string
}
export type MetricsDefaultPageParams = Workspace & {
  dateRange?: DateRange
}
export const CACHE_KEY_PREFIX = {
  PLAYGROUND_SESSION_RUNS: 'playground-agent-session-runs',
  PLAYGROUND_ENDPOINT: 'playground-endpoint',
  PLAYGROUND_WORKFLOWS: 'playground-workflow',
  PLAYGROUND_WORKFLOWS_ENDPOINT: 'playground-workflows-endpoint',
  PLAYGROUND_WORKFLOW_SESSION_RUNS: 'playground-workflow-session-runs',
  PLAYGROUND_WORKFLOW: 'playground-workflow',
  PLAYGROUND_AGENT: 'playground-agent',
  PLAYGROUND_SESSIONS: 'playground-sessions',
  PLAYGROUND_TEAMS: 'playground-teams',
  PLAYGROUND_TEAM_SESSION_RUNS: 'playground-team-session-runs',
  METRICS: 'metrics',
  ALL_SESSIONS: 'sessions',
  AGENT_SESSION: 'session',
  AGENT_RUNS: 'runs',
  KNOWLEDGE: 'knowledge',
  KNOWLEDGE_DOCUMENT_STATUS: 'knowledge-document-status',
  PLAYGROUND_ENDPOINTS: 'playground-endpoints',
  PLAYGROUND_AGENTS: 'playground-agents',
  ENDPOINT_STATUS: 'endpoint-status',
  REGISTRY_ENTITIES: 'registry-entities',
  OS_COMPONENTS_DETAILS: 'os-components-details',
  REGISTRY_APPS: 'registry-apps',
  APP_ENTITIES: 'app-entities',
  PLAYGROUND_MEMORIES: 'playground-memories',
  APP_MEMORIES: 'app-memories',
  APP_MEMORIES_USERS: 'app-memories-users',
  EVALS_RUNS: 'evals-runs',
  OS: 'os',
  OS_LIST: 'os-list',
  OS_CONFIG: 'os-config',
  OS_CONFIG_STATUS: 'os-config-status',
  OS_SECURITY_KEY: 'os-security-key',
  ORGANIZATION_MEMBERSHIPS: 'organization-memberships',
  ORGANIZATION_INVITATIONS: 'organization-invitations',
  OS_MODELS: 'os-models',
  MANUAL_STATUS: 'manual-status',
  MANUAL_SESSIONS: 'manual-sessions',
  // Billing
  BILLING_STATUS: 'billing-status',

  //Traces
  TRACES_LIST: 'traces-list',
  TRACES_DETAIL: 'traces-detail',
  TRACES_GROUP_BY_SESSION: 'traces-group-by-session'
}
export const CACHE_KEYS = {
  TEAMS: 'teams',
  ORGANIZATIONS: 'organizations',
  USER: 'user',
  USER_STORAGE_KEY: 'userData',
  AUTH_CACHE_KEYS: {
    USER: ['user']
  },
  OS_LIST: (org_id: string) => getCacheKey(CACHE_KEY_PREFIX.OS_LIST, [org_id]),
  PLAYGROUND_ENDPOINTS: (workspace: Workspace) =>
    getCacheKey(CACHE_KEY_PREFIX.PLAYGROUND_ENDPOINTS, [workspace.org_id]),
  METRICS: (params: {
    OSId: string | null
    dbId: string
    dateRange: DateRange
    table: string
  }) =>
    getCacheKey(CACHE_KEY_PREFIX.METRICS, [
      params.OSId,
      params.dbId,
      params.dateRange?.start,
      params.dateRange?.end,
      params.table
    ]),
  ENDPOINT_STATUS: (OSId: string | null, id?: string) => [
    CACHE_KEY_PREFIX.ENDPOINT_STATUS,
    OSId,
    id
  ],
  KNOWLEDGE: (params: {
    OSId: string | null
    dbId: string
    page: number
    limit: number
    sortBy: string
    table: string
  }) => [
    CACHE_KEY_PREFIX.KNOWLEDGE,
    params.OSId,
    params.dbId,
    String(params.page),
    String(params.limit),
    params.sortBy,
    params.table
  ],
  KNOWLEDGE_DOCUMENT_STATUS: (params: {
    OSId: string | null
    dbId: string
    sortBy: string
    page: number
    limit: number
    table: string
  }) => [
    CACHE_KEY_PREFIX.KNOWLEDGE_DOCUMENT_STATUS,
    params.OSId,
    params.dbId,
    params.sortBy,
    String(params.page),
    String(params.limit),
    params.table
  ],
  AGENTS: (OSId: string | null) => [CACHE_KEY_PREFIX.PLAYGROUND_AGENTS, OSId],

  PLAYGROUND_SESSION_RUNS: (
    OSId: string | null,
    dbId: string,
    sessionId: string,
    Id: string,
    table: string
  ) => [
    CACHE_KEY_PREFIX.PLAYGROUND_SESSION_RUNS,
    sessionId,
    Id,
    OSId,
    dbId,
    table
  ],

  PLAYGROUND_ENDPOINT: (workspace: Workspace) =>
    getCacheKey(CACHE_KEY_PREFIX.PLAYGROUND_ENDPOINT, [
      workspace.workspace_id,
      workspace.org_id
    ]),

  PLAYGROUND_WORKFLOWS: (currentOS: string) =>
    getCacheKey(CACHE_KEY_PREFIX.PLAYGROUND_WORKFLOWS, [currentOS]),
  PLAYGROUND_WORKFLOWS_ENDPOINT: (workspace: Workspace) =>
    getCacheKey(CACHE_KEY_PREFIX.PLAYGROUND_WORKFLOWS_ENDPOINT, [
      workspace.workspace_id,
      workspace.org_id
    ]),

  PLAYGROUND_AGENT: (OSId: string | null) => [
    CACHE_KEY_PREFIX.PLAYGROUND_AGENT,
    OSId
  ],

  PLAYGROUND_TEAMS: (OSId: string | null) => [
    CACHE_KEY_PREFIX.PLAYGROUND_TEAMS,
    OSId
  ],

  PLAYGROUND_SESSIONS: ({
    OSId,
    dbId,
    id,
    table,
    type
  }: {
    OSId: string | null
    dbId: string
    id: string
    table: string
    type: FilterType
  }) => [CACHE_KEY_PREFIX.PLAYGROUND_SESSIONS, OSId, dbId, id, table, type],

  PLAYGROUND_WORKFLOW_SESSION_RUNS: (workflowId: string, sessionId: string) =>
    getCacheKey(CACHE_KEY_PREFIX.PLAYGROUND_WORKFLOW_SESSION_RUNS, [
      workflowId,
      sessionId
    ]),
  PLAYGROUND_WORKFLOW: (workflowId: string) =>
    getCacheKey(CACHE_KEY_PREFIX.PLAYGROUND_WORKFLOW, [workflowId]),
  //sessions page
  ALL_SESSIONS: (
    page: number,
    pageSize: number,
    currentOS: string,
    dbId: string,
    type: string,
    sortBy: string,
    table: string
  ) =>
    getCacheKey(CACHE_KEY_PREFIX.ALL_SESSIONS, [
      String(page),
      String(pageSize),
      type,
      currentOS,
      dbId,
      sortBy,
      table
    ]),
  AGENT_SESSION: (session: SessionParams) =>
    getCacheKey(CACHE_KEY_PREFIX.AGENT_SESSION, [
      session.currentOS,
      session.session_id,
      session.type,
      session.dbId
    ]),
  AGENT_RUNS: (session: SessionParams) =>
    getCacheKey(CACHE_KEY_PREFIX.AGENT_RUNS, [
      session.currentOS,
      session.session_id,
      session.type,
      session.dbId,
      session.table
    ]),
  REGISTRY_ENTITIES: (params: MetricsDefaultPageParams) => [
    CACHE_KEY_PREFIX.REGISTRY_ENTITIES,
    params.workspace_id,
    params.org_id
  ],
  OS_COMPONENTS_DETAILS: (
    componentId: string,
    type: string,
    OSId: string | null
  ) => [CACHE_KEY_PREFIX.OS_COMPONENTS_DETAILS, componentId, type, OSId],

  APP_ENTITIES: (params: MetricsDefaultPageParams, app_id: string) => [
    CACHE_KEY_PREFIX.APP_ENTITIES,
    params.workspace_id,
    params.org_id,
    app_id
  ],

  PLAYGROUND_MEMORIES: (params: { OSId: string | null; id: string }) => [
    CACHE_KEY_PREFIX.PLAYGROUND_MEMORIES,
    params.OSId,
    params.id
  ],
  APP_MEMORIES: (params: {
    OSId: string | null
    dbId: string
    table: string
    memoryId: string
    sort_by?: SortByValue
    page?: number
    limit?: number
    userId?: string
  }) => [
    CACHE_KEY_PREFIX.APP_MEMORIES,
    params.OSId,
    params.dbId,
    params.memoryId,
    params.sort_by,
    String(params.page),
    String(params.limit),
    params.userId,
    params.table
  ],
  APP_MEMORIES_USERS: (params: {
    OSId: string | null
    dbId: string
    memoryId: string
    sort_by?: SortByValue
    page?: number
    limit?: number
    table: string
  }) => [
    CACHE_KEY_PREFIX.APP_MEMORIES_USERS,
    params.OSId,
    params.dbId,
    params.sort_by,
    String(params.page),
    String(params.limit),
    params.table
  ],
  EVALS_RUNS: (params: {
    OSId: string | null
    dbId: string
    table: string
    page?: number
    limit?: number
    model_id?: string
    eval_type?: Array<EvalRunType> | null
    type?: 'agent' | 'team'
    sort_by?: SortBy.UPDATED_AT_ASC | SortBy.UPDATED_AT_DESC
  }) => [
    CACHE_KEY_PREFIX.EVALS_RUNS,
    params.OSId,
    params.dbId,
    String(params.page),
    String(params.limit),
    params.model_id,
    params.eval_type && params.eval_type.length > 0
      ? params.eval_type.join(',')
      : undefined,
    params.type,
    params.sort_by,
    params.table
  ],
  OS_CONFIG: (OSId: string | null) => [CACHE_KEY_PREFIX.OS_CONFIG, OSId],
  OS_CONFIG_STATUS: (OSId: string | null) => [
    CACHE_KEY_PREFIX.OS_CONFIG_STATUS,
    OSId
  ],
  OS_SECURITY_KEY: (OSId: string | null) => [
    CACHE_KEY_PREFIX.OS_SECURITY_KEY,
    OSId
  ],
  OS_MODELS: (OSId: string | null) => [CACHE_KEY_PREFIX.OS_MODELS, OSId],
  MANUAL_STATUS: (OSId: string | null, sessionId: string) => [
    CACHE_KEY_PREFIX.MANUAL_STATUS,
    OSId,
    sessionId
  ],
  MANUAL_SESSIONS: (
    OSId: string | null,
    isManual?: boolean,
    platform?: string,
    limit?: number,
    offset?: number
  ) => [
    CACHE_KEY_PREFIX.MANUAL_SESSIONS,
    OSId,
    isManual,
    platform,
    limit,
    offset
  ],
  ORGANIZATION_MEMBERSHIPS: (organizationId: string) => [
    CACHE_KEY_PREFIX.ORGANIZATION_MEMBERSHIPS,
    organizationId
  ],
  ORGANIZATION_INVITATIONS: (organizationId: string) => [
    CACHE_KEY_PREFIX.ORGANIZATION_INVITATIONS,
    organizationId
  ],
  ORGANIZATION_CACHE_KEYS: {
    CURRENT_ORGANIZATION: ['current-organization'],
    ORGANIZATIONS_LIST: ['organizations-list']
  },
  // Billing
  BILLING_STATUS: (organizationId: string | null) => [
    CACHE_KEY_PREFIX.BILLING_STATUS,
    organizationId
  ],

  //Traces
  TRACES_LIST: (params: {
    OSId: string | null
    dbId: string
    page: number
    limit: number
    table: string
    sessionId: string
  }) => [
    CACHE_KEY_PREFIX.TRACES_LIST,
    params.OSId,
    params.dbId,
    params.page,
    params.limit,
    params.table,
    params.sessionId
  ],
  TRACES_DETAIL: (params: {
    OSId: string | null
    dbId: string
    table: string
    traceId: string
  }) => [
    CACHE_KEY_PREFIX.TRACES_DETAIL,
    params.OSId,
    params.dbId,
    params.table,
    params.traceId
  ],
  TRACES_GROUP_BY_SESSION: (params: {
    OSId: string | null
    dbId: string
    page: number
    limit: number
    table: string
  }) => [
    CACHE_KEY_PREFIX.TRACES_GROUP_BY_SESSION,
    params.OSId,
    params.dbId,
    params.page,
    params.limit,
    params.table
  ]
}

export const NAVIGATION_ANIMATION_DURATION = 0.3

export const HEADER_ANIMATION_PROPS: AnimationProps = {
  initial: { opacity: 0, translateY: 5 },
  animate: { opacity: 1, translateY: 0 },
  exit: { opacity: 0, translateY: -5 },
  transition: { duration: NAVIGATION_ANIMATION_DURATION }
}

/**
 * Represents an array of content objects used for CLI authentication status messages.
 */
export const AuthContent = [
  {
    id: 'cli',
    title: 'Redirecting to Auth Page',
    description: "If the page isn't loading, press the button below to retry.",
    button: 'RETRY AUTHENTICATION'
  },
  {
    id: 'cli-legacy',
    title: 'Authenticating your workspace',
    description:
      'Authentication is being processed directly on this page. Please wait a moment.'
  },
  {
    id: 'success',
    title: 'Authentication successful',
    description:
      'You can continue in the terminal. Redirecting to the dashboard in 4s.',
    icon: 'check',
    button: 'BACK TO HOME',
    buttonIcon: 'home',
    link: '/'
  },
  {
    id: 'error',
    title: 'Authentication failed',
    description:
      'Retry the authentication in the CLI. Learn more ways to authenticate in our docs',
    icon: 'cross',
    button: 'GO TO DOCS',
    buttonIcon: 'external-link',
    link: 'https://docs.agno.com/introduction/monitoring'
  }
]

export const backgroundClassname =
  'absolute bottom-0 left-0 right-0 opacity-[10%]'

export const modeDescriptions: Record<string, string> = {
  route:
    'In Route Mode, the Team Leader directs user queries to the most appropriate team member based on the content of the request.',
  coordinate:
    'In Coordinate Mode, the Team Leader delegates tasks to team members and synthesizes their outputs into a cohesive response.',
  collaborate:
    'In Collaborate Mode, all members answer at once. The coordinator checks for consensus and merges the replies.'
}

export const MAX_PAGE_WRAPPER_WIDTHS = 3384

export const REGISTRY_APP_COMPONENTS = {
  AGENTS: 'agents',
  TEAMS: 'teams',
  WORKFLOWS: 'workflows'
} as const
export const OS_COMPONENTS = {
  AGENTS: 'agent',
  TEAMS: 'team',
  WORKFLOWS: 'workflow'
} as const

export enum DomainEnum {
  session = 'session',
  memory = 'memory',
  evals = 'evals',
  metrics = 'metrics',
  knowledge = 'knowledge',
  traces = 'traces'
}
export enum InterfaceEnum {
  WHATSAPP = 'whatsapp',
  SLACK = 'slack',
  CHAT = 'discord'
}

export const NAVIGATION_ROUTES = {
  home: { path: ROUTES.UserHome, label: 'Home', icon: 'home' as IconType },
  chat: {
    path: ROUTES.UserChat,
    label: 'Chat',
    icon: 'chat-bubble' as IconType
  },
  knowledge: {
    path: ROUTES.UserKnowledge,
    label: 'Knowledge',
    icon: 'book' as IconType
  },
  // knowledgeV2: {
  //   path: ROUTES.UserKnowledgeV2,
  //   label: 'Knowledge V2',
  //   icon: 'book' as IconType
  // },
  memory: {
    path: ROUTES.UserMemory,
    label: 'Memory',
    icon: 'memory-stick' as IconType
  },
  // memoryV2: {
  //   path: ROUTES.UserMemoryV2,
  //   label: 'Memory V2',
  //   icon: 'memory-stick' as IconType
  // },
  evaluation: {
    path: ROUTES.UserEvaluation,
    label: 'Evaluation',
    icon: 'evaluation' as IconType
  },
  sessions: {
    path: ROUTES.UserSessions,
    label: 'Sessions',
    icon: 'run' as IconType
  },
  traces: {
    path: ROUTES.UserTraces,
    label: 'Traces',
    icon: 'list-tree' as IconType
  },
  metrics: {
    path: ROUTES.UserMetrics,
    label: 'Metrics',
    icon: 'chart-line' as IconType
  }
}

export const AGNO_CACHE_PREFIX = 'agno/os'
export const getLocalStorageKey = (key: string) => `${AGNO_CACHE_PREFIX}/${key}`

export interface AuthPageProps {
  type?: 'signin' | 'signup'
}

export const COMPONENT_ICON_LIST = {
  [OS_COMPONENTS.TEAMS]: 'team',
  [OS_COMPONENTS.AGENTS]: 'agent',
  [OS_COMPONENTS.WORKFLOWS]: 'workflow'
}

export const ENVIRONMENT = {
  LOCAL: 'local',
  LIVE: 'live'
} as const

// File upload constants
export const MAX_FILES = 5
export const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20 MB

export const MEDIA_SESSION_NAME = 'Media Session'
