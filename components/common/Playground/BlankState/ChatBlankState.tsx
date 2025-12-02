import { motion } from 'framer-motion'
import Paragraph from '@/components/ui/typography/Paragraph'
import Tooltip from '@/components/common/Tooltip'
import useAIStreamHandler from '@/hooks/playground/useAIStreamHandler'
import { usePlaygroundQueries } from '@/hooks/playground/usePlaygroundQueries'
import { useFetchOSConfig } from '@/hooks/os/useFetchOSConfig'
import { useRef } from 'react'
import { useFilterType } from '@/hooks/useFilterType'
import Icon from '@/components/ui/icon'
import { useWorkflowById } from '@/hooks/workflows'
import { useWorkflowRun } from '@/hooks/workflows/useWorkflowRun'
import { useOSStore } from '@/stores/OSStore'
import { cn } from '@/utils/cn'
import { useTeamsQuery } from '@/hooks/playground/useTeamsQuery'
import { useAgentsQuery } from '@/hooks/playground/useAgentsQuery'
import { useWorkflows } from '@/hooks/workflows'

const DEFAULT_AGENT_PROMPTS = [
  'Which tools do you have access to?',
  'Tell me about yourself',
  "What's your special skill?"
]

const DEFAULT_TEAM_PROMPTS = [
  'What team members do you have?',
  'What tools do your members have access to?',
  'What do your members specialize in?'
]

const PromptCard = ({
  content,
  index,
  onClick
}: {
  content: string
  index: number
  onClick: (content: string) => void
}) => {
  const textRef = useRef<HTMLParagraphElement>(null)

  const cardContent = (
    <motion.div
      className="flex w-full max-w-[325px] select-none items-center justify-center overflow-hidden rounded-full border border-border bg-secondary p-3 px-4 py-2 hover:cursor-pointer hover:bg-secondary/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={() => onClick(content)}
    >
      <Paragraph ref={textRef} size="body" className="truncate text-center">
        {content}
      </Paragraph>
    </motion.div>
  )

  const isTruncated = textRef.current
    ? textRef.current.scrollHeight > textRef.current.clientHeight
    : false

  return isTruncated ? (
    <Tooltip
      content={content}
      delayDuration={0}
      contentClassName="max-w-[300px] break-words"
    >
      {cardContent}
    </Tooltip>
  ) : (
    <div>{cardContent}</div>
  )
}

const ChatBlankState = () => {
  const { handleStreamResponse } = useAIStreamHandler()
  const { isTeam, isWorkflow } = useFilterType()
  const { data: workflow } = useWorkflowById()
  const { selectedId } = usePlaygroundQueries()
  const { data: osConfig } = useFetchOSConfig()
  const { runWorkflow } = useWorkflowRun()
  const { currentOS } = useOSStore()
  const { data: teams = [] } = useTeamsQuery()
  const { data: agents = [] } = useAgentsQuery()
  const { data: workflows } = useWorkflows()

  const customPrompts =
    selectedId && osConfig?.chat?.quick_prompts?.[selectedId]

  // Check if workflow has no schema (non-schema workflows only)
  const isNonSchemaWorkflow = isWorkflow && !workflow?.input_schema?.properties

  const data = isWorkflow ? workflows : isTeam ? teams : agents

  const workflowSchema = workflow?.input_schema

  const selectedItem = (data ?? []).find(
    (item) => 'id' in item && item.id === selectedId
  ) as unknown as { input_schema?: unknown } | undefined

  const inputSchema = isWorkflow ? workflowSchema : selectedItem?.input_schema

  // Use custom prompts (max 3) if available, otherwise fall back to defaults

  // If custom prompts are available, return them for agents, teams, and non-schema workflows.
  // Otherwise, return the default prompts for agents and teams, and null for workflows.
  const getPrompts = () => {
    if (inputSchema) {
      return null
    }
    if (customPrompts && Array.isArray(customPrompts)) {
      return customPrompts.slice(0, 3)
    }

    switch (true) {
      case isWorkflow:
        return null
      case isTeam:
        return DEFAULT_TEAM_PROMPTS
      default:
        return DEFAULT_AGENT_PROMPTS
    }
  }

  const prompts = getPrompts()

  // Check if we're in workflow schema mode (chat input will overlay)

  const hasSchema = Boolean(inputSchema)

  return (
    <div
      className={cn(
        'flex size-full flex-grow flex-col items-center gap-6 px-4',
        hasSchema ? 'mt-[12%]' : 'justify-center'
      )}
    >
      <div className="flex max-w-[800px] flex-col items-center gap-2">
        <Icon type="messages-square" size={20} className="text-primary" />
        <Paragraph size="lead" className="text-primary">
          {isWorkflow ? workflow?.name : 'New Session'}
        </Paragraph>
        <Paragraph
          size="body"
          className={cn(
            'text-center text-muted',
            isWorkflow && 'whitespace-pre-line break-words'
          )}
        >
          {hasSchema
            ? isWorkflow
              ? workflow?.description
              : `Enter your input to get started with your ${isTeam ? 'team' : 'agent'}.`
            : isWorkflow
              ? workflow?.description
              : `Start chatting with your ${isTeam ? 'team' : 'agent'} to see the response here.`}
        </Paragraph>
      </div>
      {!isWorkflow && (
        <div
          className={cn(
            'flex items-center justify-center gap-3',
            !hasSchema && 'mb-[10%]'
          )}
        >
          {prompts?.map((content: string, index: number) => (
            <PromptCard
              key={content}
              content={content}
              index={index}
              onClick={async (content: string) => {
                if (isNonSchemaWorkflow) {
                  if (!selectedId) return
                  await runWorkflow(
                    selectedId,
                    { message: content },
                    currentOS?.endpoint_url || '',
                    undefined
                  )
                } else {
                  await handleStreamResponse(content)
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
export default ChatBlankState
