import { DOC_LINKS } from '@/docs'
import { IconType } from '@/components/ui/icon/types'
import { OSCreateConnectDialogModeType } from '@/types/os'

interface CommandPart {
  text: string
  type: 'command' | 'subcommand' | 'argument' | 'flag'
}

export interface UserTypeStep {
  title: string
  description?: string
  command?: CommandPart[]
  link?: string
  linkText?: string
}

interface UserSelectionOption {
  mode:
    | OSCreateConnectDialogModeType.OLD_USER
    | OSCreateConnectDialogModeType.NEW_USER
  icon: IconType
  title: string
  description: string
}

export const USER_SELECTION_OPTIONS: UserSelectionOption[] = [
  {
    mode: OSCreateConnectDialogModeType.OLD_USER,
    icon: 'graduation-cap' as IconType,
    title: 'I am familiar with Agno',
    description: 'Learn how to migrate to the new structure'
  },
  {
    mode: OSCreateConnectDialogModeType.NEW_USER,
    icon: 'plus' as IconType,
    title: "I'm starting from scratch",
    description: 'Create your AgentOS using a template'
  }
]

export const USER_CREATION_STEPS: Record<
  | OSCreateConnectDialogModeType.OLD_USER
  | OSCreateConnectDialogModeType.NEW_USER,
  UserTypeStep[]
> = {
  [OSCreateConnectDialogModeType.OLD_USER]: [
    {
      title: 'Migrate your existing Agno Agent System',
      link: DOC_LINKS.platform.migration,
      linkText: 'Go to migration guide'
    }
  ],
  [OSCreateConnectDialogModeType.NEW_USER]: [
    {
      title: '1. Install Agno and Agno Infra in your virtual environment',
      command: [
        { text: 'pip', type: 'command' },
        { text: 'install', type: 'subcommand' },
        { text: 'agno', type: 'argument' },
        { text: 'agno-infra', type: 'argument' }
      ]
    },
    {
      title: '2. Create an AgentOS project',
      command: [
        { text: 'ag', type: 'command' },
        { text: 'infra', type: 'subcommand' },
        { text: 'create', type: 'argument' }
      ]
      // TODO: add infra link
      // link: DOC_LINKS.agentOS.createFirstOS
    },
    {
      title: '3. Run your AgentOS',
      command: [
        { text: 'ag', type: 'command' },
        { text: 'infra', type: 'subcommand' },
        { text: 'up', type: 'argument' }
      ]
      // TODO: add infra link
      // link: DOC_LINKS.agentOS.createFirstOS
    }
  ]
}
