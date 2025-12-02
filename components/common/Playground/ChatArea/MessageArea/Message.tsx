import { memo, useEffect, useRef, useState } from 'react'

import Icon from '@/components/ui/icon'
import MessageContentRenderer from '@/components/common/MessageContentRenderer'

import { useTeamsPlaygroundStore } from '@/stores/playground'
import { useAgentsPlaygroundStore } from '@/stores/playground'
import type { PlaygroundMessage } from '@/types/playground'

import DynamicHITLComponent from '../../DynamicHITLComponent/DynamicHITLComponent'
import { ToolCall } from '@/types/Agent'
import { toast } from '@/components/ui/toast'
import useAIStreamHandler from '@/hooks/playground/useAIStreamHandler'
import { useFilterType } from '@/hooks/useFilterType'
import { getInitials } from '@/utils/user'
import { useUser } from '@/api/hooks'
import IntermediateSteps from '@/components/common/IntermediateSteps'
import { WorkflowParsedLabels } from '@/components/pages/WorkflowsPage/MainPage/WorkflowChatArea/WorkflowParsedLabels'
import { parseLabel } from '@/utils/playgroundUtils'

interface MessageProps {
  message: PlaygroundMessage
  isStreaming?: boolean
}

interface UserMessageProps {
  message: PlaygroundMessage
  animateOnMount?: boolean
}

export const AgentMessage = ({ message, isStreaming }: MessageProps) => {
  const { isTeam } = useFilterType()
  const { streamingErrorMessage: teamsStreamingErrorMessage } =
    useTeamsPlaygroundStore()
  const { streamingErrorMessage } = useAgentsPlaygroundStore()

  const { handleContinueRun } = useAIStreamHandler()

  const shouldShowHITL =
    message.tools &&
    message.tools.length > 0 &&
    message.tools.some(
      (tool) =>
        tool.requires_user_input === true ||
        tool.requires_confirmation === true ||
        tool.confirmed !== null ||
        tool.answered !== null
    )
  const handleUserInputSubmit = async (
    toolCallId: string,
    tools: ToolCall[]
  ) => {
    try {
      // If toolCallId is empty, it means we're handling multiple tools (SEND CHOICES)
      // Use the tools as provided since they already have the correct states
      if (!toolCallId) {
        await handleContinueRun(tools)
      } else {
        // Single tool submission - only mark the specific tool as answered
        await handleContinueRun(
          tools.map((tool) =>
            tool.tool_call_id === toolCallId
              ? { ...tool, answered: true }
              : tool
          )
        )
      }
    } catch (error) {
      toast.error({
        description: `Error in handleUserInputSubmit: ${
          error instanceof Error ? error.message : String(error)
        }`
      })
    }
  }

  let ErrorMessage
  if (isTeam && teamsStreamingErrorMessage) {
    ErrorMessage = teamsStreamingErrorMessage
  } else if (!isTeam && streamingErrorMessage) {
    ErrorMessage = streamingErrorMessage
  } else {
    ErrorMessage = 'Please try refreshing the page or try again later.'
  }

  let messageContent
  // Handle streaming error state
  if (message.streamingError) {
    messageContent = (
      <p className="break-all text-destructive">
        Something went wrong. {ErrorMessage}
      </p>
    )
  } else if (
    message.tools &&
    message.tools.length > 0 &&
    message.tools.some(
      (tool) =>
        tool.requires_user_input === true ||
        tool.requires_confirmation === true ||
        tool.confirmed !== null ||
        tool.answered !== null
    )
  ) {
    // Don't show thinking loader when waiting for user input/confirmation
    messageContent = message.content ? (
      <MessageContentRenderer content={message.content} />
    ) : null
  } else {
    messageContent = <MessageContentRenderer message={message} />
  }

  return (
    <div
      id={`agent-message-${message.run_id || message.created_at || Date.now()}`}
      className="flex items-start gap-4"
    >
      <div className="shrink-0 pt-1">
        {isTeam ? (
          <Icon
            type="team"
            className="size-6 rounded-[6px] bg-brand p-1 text-white"
          />
        ) : (
          <Icon type="avatar" />
        )}
      </div>

      <div className="flex w-full flex-col gap-3 text-primary">
        {shouldShowHITL && (
          <div className="mb-4 flex transition-opacity duration-200 ease-in-out">
            <DynamicHITLComponent
              key={`hitl-${message.created_at}-${message.tools?.map((tool) => `${tool.tool_call_id}-${tool.answered}-${tool.confirmed}-${tool.requires_user_input}-${tool.requires_confirmation}`).join('-')}`}
              tools={message.tools ?? []}
              onUserInputSubmit={handleUserInputSubmit}
              isLoading={isStreaming}
              dynamicContent={message.dynamicContent}
              disableHitlForm={message.disableHitlForm}
            />
          </div>
        )}
        {message?.intermediateSteps?.length && (
          <IntermediateSteps
            intermediateSteps={message.intermediateSteps}
            streamingError={message?.streamingError || false}
            isReasoningStreaming={message.is_reasoning_streaming}
            isResponseStreaming={isStreaming}
          />
        )}

        {messageContent}
      </div>
    </div>
  )
}

export const UserMessage = memo(
  ({ message, animateOnMount = false }: UserMessageProps) => {
    const [mounted, setMounted] = useState(!animateOnMount)
    const containerRef = useRef<HTMLDivElement | null>(null)
    const { data } = useUser()
    const name = data?.user?.username ?? data?.user?.email ?? 'ME'

    const StruturedInputParsedLabel = message.content
      ? parseLabel(message.content)
      : []

    useEffect(() => {
      if (!animateOnMount) return
      const id = requestAnimationFrame(() => setMounted(true))
      return () => cancelAnimationFrame(id)
    }, [animateOnMount, message?.run_id])

    return (
      <div
        id={`user-message-${message.run_id}`}
        ref={containerRef}
        className={`flex gap-4 text-start max-md:break-words ${
          animateOnMount
            ? `transform transition-all duration-300 ease-out ${
                mounted
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-2 opacity-0'
              }`
            : ''
        }`}
      >
        <div className="flex size-6 shrink-0 items-center justify-center rounded-sm bg-secondary text-[10px]">
          <div className="text-primary">{getInitials(name as string)}</div>
        </div>

        {StruturedInputParsedLabel?.length ? (
          <div className="flex flex-col gap-2">
            <WorkflowParsedLabels message={message.content} />
          </div>
        ) : (
          <MessageContentRenderer message={message} />
        )}
      </div>
    )
  }
)

UserMessage.displayName = 'UserMessage'
