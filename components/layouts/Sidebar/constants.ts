import { NAVIGATION_ROUTES } from '@/constants'
import { DOC_LINKS } from '@/docs'
import { ROUTES } from '@/routes'
import { type SidebarItem } from '@/types/globals'

export const SIDEBAR_ITEMS: {
  primary: {
    sections: Array<{
      items: SidebarItem[]
    }>
  }
  secondary: {
    sections: Array<{
      items: SidebarItem[]
    }>
  }
} = {
  primary: {
    sections: [
      {
        items: [
          {
            label: NAVIGATION_ROUTES.home.label,
            route: {
              href: NAVIGATION_ROUTES.home.path
            },
            icon: NAVIGATION_ROUTES.home.icon
          }
        ]
      },
      {
        items: [
          {
            label: NAVIGATION_ROUTES.chat.label,
            route: {
              href: NAVIGATION_ROUTES.chat.path
            },
            icon: NAVIGATION_ROUTES.chat.icon
          },
          {
            label: NAVIGATION_ROUTES.knowledge.label,
            route: {
              href: NAVIGATION_ROUTES.knowledge.path
            },
            icon: NAVIGATION_ROUTES.knowledge.icon
          },
          // {
          //   label: NAVIGATION_ROUTES.knowledgeV2.label,
          //   route: {
          //     href: NAVIGATION_ROUTES.knowledgeV2.path
          //   },
          //   icon: NAVIGATION_ROUTES.knowledgeV2.icon
          // },
          {
            label: NAVIGATION_ROUTES.memory.label,
            route: {
              href: NAVIGATION_ROUTES.memory.path
            },
            icon: NAVIGATION_ROUTES.memory.icon
          },
          // {
          //   label: NAVIGATION_ROUTES.memoryV2.label,
          //   route: {
          //     href: NAVIGATION_ROUTES.memoryV2.path
          //   },
          //   icon: NAVIGATION_ROUTES.memoryV2.icon
          // },
          {
            label: NAVIGATION_ROUTES.evaluation.label,
            route: {
              href: NAVIGATION_ROUTES.evaluation.path
            },
            icon: NAVIGATION_ROUTES.evaluation.icon
          },
          {
            label: NAVIGATION_ROUTES.sessions.label,
            route: {
              href: NAVIGATION_ROUTES.sessions.path
            },
            icon: NAVIGATION_ROUTES.sessions.icon
          },
          {
            label: NAVIGATION_ROUTES.traces.label,
            route: {
              href: NAVIGATION_ROUTES.traces.path
            },
            icon: NAVIGATION_ROUTES.traces.icon
          },
          {
            label: NAVIGATION_ROUTES.metrics.label,
            route: {
              href: NAVIGATION_ROUTES.metrics.path
            },
            icon: NAVIGATION_ROUTES.metrics.icon
          }
        ]
      },
      {
        items: [
          {
            label: 'Settings',

            icon: 'settings-2'
          }
        ]
      }
    ]
  },

  secondary: {
    sections: [
      {
        items: [
          {
            label: 'Docs',
            route: {
              href: DOC_LINKS.platform.home
            },
            icon: 'documentation'
          },
          {
            label: 'Community',
            route: {
              href: ROUTES.Community
            },
            icon: 'messages-square'
          },
          {
            label: 'GitHub',
            route: {
              href: ROUTES.GitHub
            },
            icon: 'GitHub'
          }
        ]
      }
    ]
  }
}

export const SETTINGS_SIDEBAR_ITEMS: { items: SidebarItem[] }[] = [
  {
    items: [
      {
        label: 'Profile',

        route: { href: '' }
      }
    ]
  },
  {
    items: [
      {
        label: 'Organization',

        route: { href: '/organization' }
      },
      {
        label: 'AgentOS',

        route: { href: '/os' }
      }
    ]
  },
  {
    items: [
      {
        label: 'Billing',
        route: { href: '/billing' }
      }
    ]
  }
]
