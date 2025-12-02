import { HeaderWrapper } from '@/components/layouts/Header'
import NewChatSessionButton from '@/components/pages/AgentsPlaygroundPage/NewChatSessionButton'
import ChatSessionsSheet from './ChatSessionsSheet'
import LeftSideChatHeader from './LeftSideChatHeader'
import ConfigSheet from '../ChatInput/ConfigSheet'
import { Memory } from '../../MessageAreaWrapper/Memory/Memory'

export const ChatHeader = () => {
  const rightSideRenderContent = (
    <div className="flex items-center gap-2">
      <Memory />
      <ConfigSheet />
      <ChatSessionsSheet />
      <NewChatSessionButton />
    </div>
  )

  return (
    <HeaderWrapper
      className="h-[72px] px-4 pb-8 pt-4"
      bottomContent={{
        leftContent: <LeftSideChatHeader />,
        rightContent: rightSideRenderContent
      }}
    />
  )
}
