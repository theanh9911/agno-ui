import { DOC_LINKS } from '@/docs'
import CtaCard from './CtaCard'
import { useMemo } from 'react'
import { CtaCardProps } from '../type'
import BlankPlaceholder from './BlankPlaceholder'
import { OSCreateConnectDialogModeType } from '@/types/os'
import OSConnectDialogContent from '@/components/common/OSCreateConnectDialogContent/OSConnectDialogContent'
import { useDialog } from '@/providers/DialogProvider'

const CTA_CARD_BASE_CONTENT = [
  {
    id: 'build',
    icon: 'wrench' as const,
    title: 'Build with Agno',
    description: 'Learn how to build your AgentOS',
    buttonTitle: 'go to our docs',
    externalLinkText: 'What is an AgentOS?',
    onButtonClick: () => window.open(DOC_LINKS.platform.home, '_blank'),
    externalLink: DOC_LINKS.agentOS.introduction
  },
  {
    id: 'create',
    icon: 'create' as const,
    title: 'Create your AgentOS',
    description: 'Kickstart your AgentOS from scratch',
    buttonTitle: 'Create your AgentOS',
    externalLinkText: 'How to create an AgentOS',
    externalLink: DOC_LINKS.agentOS.createFirstOS
  },
  {
    id: 'connect',
    icon: 'link' as const,
    title: 'Connect your AgentOS',
    description: 'Connect to an existing AgentOS',
    buttonTitle: 'Connect your AgentOS',
    externalLinkText: 'How to connect an AgentOS',
    externalLink: DOC_LINKS.agentOS.connectOS
  }
] as const

const NoConnectedOS = () => {
  const { openDialog } = useDialog()

  const handleCreateDialogOpen = () => {
    openDialog(
      <OSConnectDialogContent
        initialMode={OSCreateConnectDialogModeType.USER_SELECTION}
      />
    )
  }

  const handleConnectDialogOpen = () => {
    openDialog(
      <OSConnectDialogContent
        initialMode={OSCreateConnectDialogModeType.CONNECT}
      />
    )
  }

  const ctaCardContent: CtaCardProps[] = useMemo(
    () =>
      CTA_CARD_BASE_CONTENT.map((item) => {
        let onButtonClick = () => {}

        if (item.id === 'create') {
          onButtonClick = handleCreateDialogOpen
        } else if (item.id === 'connect') {
          onButtonClick = handleConnectDialogOpen
        } else onButtonClick = item.onButtonClick

        return {
          ...item,
          onButtonClick
        }
      }),
    [handleCreateDialogOpen, handleConnectDialogOpen]
  )

  return (
    <div className="flex size-full flex-col gap-8">
      <div className="grid-responsive-basic grid w-full gap-6">
        {ctaCardContent.map((item) => (
          <CtaCard key={item.title} {...item} />
        ))}
      </div>
      <BlankPlaceholder />
    </div>
  )
}

export default NoConnectedOS
