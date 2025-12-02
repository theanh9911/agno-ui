import Icon from '@/components/ui/icon'
import Paragraph from '@/components/ui/typography/Paragraph'
import React, { useState } from 'react'
import { useTheme } from 'next-themes'
import Heading from '@/components/ui/typography/Heading'
import { Button } from '@/components/ui/button'
import { useInvalidateOSStatus } from '@/hooks/os/useInvalidateOSStatus'
import { OSCreateConnectDialogModeType } from '@/types/os'
import OSConnectDialogContent from '@/components/common/OSCreateConnectDialogContent/OSConnectDialogContent'
import { useDialog } from '@/providers/DialogProvider'
import SettingsModal from '@/components/modals/SettingsModal/SettingsModal'

import { DOC_LINKS } from '@/docs'
import Link from '@/components/ui/Link'
import { IconType } from '@/components/ui/icon/types'
import { useOSStore } from '@/stores/OSStore'

interface OsBlankStateProps {
  status: 'disconnected' | 'inactive' | 'auth-failed' | 'missing-security-key'
}

interface StatusConfig {
  title: string
  description: string
  buttons: {
    primary?: {
      icon?: IconType
      text: string
      onClick: () => void
      className?: string
      isLoading?: boolean
    }
    secondary?: {
      text: string
      href: string
      className?: string
    }
  }
}

type StatusConfigMap = {
  [K in OsBlankStateProps['status']]: StatusConfig
}

const OsBlankState = ({ status }: OsBlankStateProps) => {
  const { resolvedTheme } = useTheme()
  const { invalidateOSStatus } = useInvalidateOSStatus()
  const [isLoading, setIsLoading] = useState(false)
  const { openDialog } = useDialog()
  const setSelectedOS = useOSStore((state) => state.setSelectedOS)
  const currentOS = useOSStore((state) => state.currentOS)
  const handleRefresh = () => {
    setIsLoading(true)
    invalidateOSStatus()
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }

  const handleOpenSettings = () => {
    setSelectedOS(currentOS)
    openDialog(<SettingsModal defaultPage="os" />)
  }

  const handleConnectOS = () => {
    openDialog(
      <OSConnectDialogContent
        initialMode={OSCreateConnectDialogModeType.CONNECT}
      />
    )
  }

  const statusConfig: StatusConfigMap = {
    disconnected: {
      title: 'No AgentOS connected',
      description:
        'Connect an AgentOS to your organization to access this page',
      buttons: {
        primary: {
          text: 'Connect AgentOS',
          onClick: handleConnectOS
        },
        secondary: {
          text: 'Learn more',
          href: DOC_LINKS.agentOS.connectOS
        }
      }
    },
    inactive: {
      title: 'AgentOS not active',
      description:
        'Your AgentOS is connected but is not active. After running the AgentOS you need to refresh the page.',
      buttons: {
        primary: {
          text: 'Refresh',
          onClick: handleRefresh,
          isLoading: isLoading
        },
        secondary: {
          text: 'Learn more',
          href: DOC_LINKS.agentOS.connectOS
        }
      }
    },
    'auth-failed': {
      title: 'Authentication Failed',
      description:
        "Your security key doesn't match the one configured in the SDK. Check that you're using the correct key.",
      buttons: {
        primary: {
          text: 'Check key',
          onClick: handleOpenSettings
        },
        secondary: {
          text: 'Learn more',
          href: DOC_LINKS.agentOS.security
        }
      }
    },
    'missing-security-key': {
      title: 'Missing security key',
      description:
        'Your AgentOS requires a security key to be set for authentication.',
      buttons: {
        primary: {
          icon: 'plus',
          text: 'Set key',
          onClick: handleOpenSettings
        },
        secondary: {
          text: 'Learn more',
          href: DOC_LINKS.agentOS.security
        }
      }
    }
  }

  const currentConfig = statusConfig[status]
  return (
    <div
      className="absolute inset-0 z-10 flex h-full w-full justify-center"
      style={{
        background:
          resolvedTheme === 'dark'
            ? 'linear-gradient(180deg, #111113 42.88%, rgba(17, 17, 19, 0.00) 100%)'
            : 'linear-gradient(180deg, #FFF 42.88%, rgba(255, 255, 255, 0.00) 100%)'
      }}
    >
      <div
        className="absolute h-[50%] w-full"
        style={{ backdropFilter: 'blur(4px)' }}
      />
      <div
        className="absolute top-[45%] h-[15%] w-full"
        style={{ backdropFilter: 'blur(3px)' }}
      />
      <div
        className="absolute top-[58%] h-[5%] w-full"
        style={{ backdropFilter: 'blur(2px)' }}
      />
      <div
        className="absolute top-[62%] h-[5%] w-full"
        style={{ backdropFilter: 'blur(1px)' }}
      />
      <div className="z-[100] mt-20 flex w-[18.75rem] flex-col items-center gap-4 text-center">
        <div className="flex items-center justify-center">
          <Icon type="os-blank-state-icon" size={90} />
        </div>
        <Heading size={3}>{currentConfig.title}</Heading>
        <Paragraph size="body" className="text-center text-primary">
          {currentConfig.description}
        </Paragraph>
        <div className="flex max-w-xs justify-center gap-2">
          {currentConfig.buttons.primary && (
            <div className="flex min-w-[84px]">
              <Button
                icon={currentConfig.buttons.primary.icon}
                onClick={currentConfig.buttons.primary.onClick}
                className="flex w-full outline-none focus-visible:rounded-md focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:ring-offset-0"
                isLoading={currentConfig.buttons.primary.isLoading}
              >
                {currentConfig.buttons.primary.text}
              </Button>
            </div>
          )}
          {currentConfig.buttons.secondary && (
            <Link
              href={currentConfig.buttons.secondary.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex outline-none focus-visible:rounded-md focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:ring-offset-0"
            >
              <Button variant="secondary">
                {currentConfig.buttons.secondary.text}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default OsBlankState
