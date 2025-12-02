import { ROUTES } from '@/routes'
import { DOC_LINKS } from '@/docs'
import { IconType } from '@/components/ui/icon'
import { NAVIGATION_ROUTES } from '@/constants'
import { OSComponentsType } from '@/types/os'

export const iconType: Record<OSComponentsType, IconType> = {
  team: 'team',
  agent: 'agent',
  workflow: 'workflow'
}
export interface CardData {
  label: string
  icon: IconType
  description: string
  link: string
  imageDark?: string
  imageLight?: string
}

export const HOMEPAGE_CARDS: CardData[] = [
  {
    label: NAVIGATION_ROUTES.chat.label,
    icon: NAVIGATION_ROUTES.chat.icon,
    description: 'Interact with your agents, teams and workflows.',
    link: ROUTES.UserChat
  },
  {
    label: NAVIGATION_ROUTES.knowledge.label,
    icon: NAVIGATION_ROUTES.knowledge.icon,
    description: 'View and manage your knowledge bases.',
    link: NAVIGATION_ROUTES.knowledge.path
  },
  {
    label: NAVIGATION_ROUTES.memory.label,
    icon: NAVIGATION_ROUTES.memory.icon,
    description: 'View and manage user memories and learnings.',
    link: NAVIGATION_ROUTES.memory.path
  },
  {
    label: NAVIGATION_ROUTES.evaluation.label,
    icon: NAVIGATION_ROUTES.evaluation.icon,
    description:
      'Test the accuracy, reliability and performance of your agents.',
    link: NAVIGATION_ROUTES.evaluation.path
  },
  {
    label: NAVIGATION_ROUTES.sessions.label,
    icon: NAVIGATION_ROUTES.sessions.icon,
    description: 'View and manage agents, teams and workflow sessions.',
    link: NAVIGATION_ROUTES.sessions.path
  },
  {
    label: NAVIGATION_ROUTES.metrics.label,
    icon: NAVIGATION_ROUTES.metrics.icon,
    description: 'Monitor the usage of your agents, teams and workflows.',
    link: NAVIGATION_ROUTES.metrics.path
  }
]

type EmptyStateDataType = {
  title: string
  description: string
  docLink?: string
  visual: IconType
}

export const emptyStateData: Record<string, EmptyStateDataType> = {
  noAgentConfig: {
    title: 'No config available',
    description:
      'Visit our docs for more information on how to configure your agent',
    docLink: DOC_LINKS.platform.agents.introduction,
    visual: 'agent-blank-state-visual'
  },

  noWorkflowAgents: {
    title: 'No config available',
    description:
      'Visit our docs for more information on how to configure your workflow',
    docLink: DOC_LINKS.platform.workflows.introduction,
    visual: 'workflow-blank-state-visual'
  },
  noTeamAgents: {
    title: 'No config available',
    description:
      'Visit our docs for more information on how to configure your team',
    docLink: DOC_LINKS.platform.teams.introduction,
    visual: 'team-blank-state-visual'
  }
}
