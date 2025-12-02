import { ChatInput } from '@/components/common/Playground/ChatArea/ChatInput'
import MessageArea from '@/components/common/Playground/ChatArea/MessageArea/MessageArea'
import { chatMessage } from '@/utils/MockData'
import { PlaygroundMessage } from '@/types/playground'
import { messagesToConversations } from '@/utils/conversationUtils'
import React from 'react'
import TeaserPageWrapper from '@/components/common/TeaserPageWrapper'

const ChatTeaserPage = () => {
  return (
    <TeaserPageWrapper className="flex h-full flex-row-reverse overflow-hidden">
      <main className="flex-1">
        <div className="flex h-full flex-col overflow-hidden">
          <div className="flex min-h-0 flex-grow flex-col justify-center">
            <div className="mx-auto min-h-0 w-full max-w-2xl space-y-9 px-4 pb-4 pt-16">
              <MessageArea
                conversations={messagesToConversations(
                  chatMessage as PlaygroundMessage[]
                )}
              />
            </div>
          </div>

          <div className="pointer-events-none sticky bottom-0 px-4 pb-2">
            <ChatInput />
          </div>
        </div>
      </main>
    </TeaserPageWrapper>
  )
}

export default ChatTeaserPage
