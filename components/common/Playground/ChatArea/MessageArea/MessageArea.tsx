import References from '@/components/common/Playground/References'
import Icon from '@/components/ui/icon'
import DetailAction from '@/components/common/Playground/DetailAction'
import {
  useTeamsPlaygroundStore,
  useAgentsPlaygroundStore
} from '@/stores/playground'

import {
  PlaygroundMessage,
  PlaygroundConversation,
  RunEvent
} from '@/types/playground'

import { AgentMessage, UserMessage } from './Message'

import Tooltip from '@/components/common/Tooltip'
import Paragraph from '@/components/ui/typography/Paragraph'
import { ToolComponent } from '@/components/common/Playground/Tools/ToolsComponent'
import MemberResponses from '@/components/common/MemberResponses/MemberResponses'
import Reasoning from '@/components/common/Playground/Reasoning/Reasoning'

import { useFilterType } from '@/hooks/useFilterType'
import { memo } from 'react'
import { getFormattedReasoningTimeFromMessage } from '@/utils/format'

interface MessageListProps {
  conversations: PlaygroundConversation[]
}

interface MessageWrapperProps {
  message: PlaygroundMessage
  isLastMessage: boolean
  messageKey: string
}

const AgentMessageWrapper = memo(
  ({ message, isLastMessage }: MessageWrapperProps) => {
    const { isTeam } = useFilterType()
    const { isStreaming: isTeamStreaming } = useTeamsPlaygroundStore(
      (state) => state
    )
    const { isStreaming: isAgentStreaming } = useAgentsPlaygroundStore(
      (state) => state
    )
    const isStreaming = isTeam ? isTeamStreaming : isAgentStreaming
    const messageIsStreaming = isStreaming && isLastMessage
    const tools = message.tool_calls ?? []
    const firstTool = tools[0]
    const reasoningArr = message.reasoning ?? []
    const intermediateStepsArr = message.intermediateSteps ?? []

    const hasTools = tools?.length > 0
    const hasReasoning = reasoningArr?.length > 0
    const hasMemberResponses =
      isTeam &&
      intermediateStepsArr.some((step) => step.event === RunEvent.RunContent)
    const hasTopRowContent = hasTools || hasReasoning || hasMemberResponses

    return (
      <div className="relative flex flex-col gap-y-9">
        {hasTopRowContent && (
          <div className="flex flex-wrap items-center gap-2 pl-9">
            {hasTools && (
              <ToolComponent
                key={
                  firstTool?.tool_call_id ||
                  `${firstTool?.tool_name}-${firstTool?.created_at}`
                }
                tools={tools}
                totalToolsCount={tools.length}
                type="multiple"
              />
            )}

            {hasReasoning && (
              <Reasoning
                type="sheet"
                reasoning={reasoningArr}
                time={getFormattedReasoningTimeFromMessage(message)}
                open={false}
              />
            )}

            {hasMemberResponses && (
              <MemberResponses
                type="sheet"
                intermediateSteps={intermediateStepsArr}
              />
            )}
          </div>
        )}

        {message.references &&
          message.references.length > 0 &&
          message.references[0].references?.length > 0 && (
            <div className="flex items-start gap-4">
              <div>
                <Tooltip
                  delayDuration={0}
                  content={
                    <Paragraph size="body" className="text-accent">
                      References
                    </Paragraph>
                  }
                  side="top"
                >
                  <Icon type="context" size="xs" />
                </Tooltip>
              </div>
              <References references={message.references} />
            </div>
          )}

        <AgentMessage message={message} isStreaming={messageIsStreaming} />
        {!messageIsStreaming &&
          (message.content || message.response_audio?.transcript) && (
            <div className="absolute -bottom-6 left-1">
              <DetailAction
                copy
                content={message.content || message.response_audio?.transcript}
                className="pl-9"
                sessionState={
                  Object.keys(message?.session_state || {}).length > 0
                    ? message.session_state
                    : undefined
                }
                metrics={
                  message?.metrics && Object.keys(message.metrics).length > 0
                    ? message.metrics
                    : undefined
                }
              />
            </div>
          )}
      </div>
    )
  }
)
AgentMessageWrapper.displayName = 'AgentMessageWrapper'
const MessageArea = ({ conversations }: MessageListProps) => {
  const { isTeam } = useFilterType()
  const { isStreaming: isTeamStreaming } = useTeamsPlaygroundStore((s) => s)
  const { isStreaming: isAgentStreaming } = useAgentsPlaygroundStore((s) => s)
  const isStreaming = isTeam ? isTeamStreaming : isAgentStreaming
  return (
    <div className="space-y-16">
      {conversations.map((conversation, index) => {
        const conversationKey =
          conversation.id || `conversation-${conversation.run_id}`
        const isLastConversation = index === conversations.length - 1

        return (
          <div
            key={conversationKey}
            id={`conversation-${conversation.run_id}`}
            className={`flex flex-col gap-y-6 ${isLastConversation ? 'min-h-[calc(100vh-19rem)]' : ''}`}
          >
            {/* User Message */}
            {conversation.user_message &&
              (!!conversation.user_message.content?.trim() ||
                !!conversation.user_message.response_audio?.transcript?.trim() ||
                (Array.isArray(conversation.user_message.images) &&
                  conversation.user_message.images.length > 0) ||
                (Array.isArray(conversation.user_message.videos) &&
                  conversation.user_message.videos.length > 0) ||
                (Array.isArray(conversation.user_message.audios) &&
                  conversation.user_message.audios.length > 0)) && (
                <UserMessage
                  message={conversation.user_message}
                  animateOnMount={
                    isLastConversation &&
                    (isStreaming || conversation.user_message.run_id === 'temp')
                  }
                />
              )}
            {/* Agent Message */}
            {conversation.agent_message && (
              <AgentMessageWrapper
                message={conversation.agent_message}
                isLastMessage={isLastConversation}
                messageKey={`${conversationKey}-agent`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default memo(MessageArea)
MessageArea.displayName = 'MessageArea'
