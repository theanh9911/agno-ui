import { memo, useEffect, useRef } from 'react'

import Icon from '@/components/ui/icon'

import { WorkflowAgentMessage, WorkflowUserMessage } from './WorkflowMessage'
import AgentThinkingLoader from '@/components/common/Playground/MessageAreaWrapper/AgentThinkingLoader'
import { StepExecutorRun, StepResult, WorkflowData } from '@/types/workflow'
import { Button } from '@/components/ui/button'
import { StepsOutputSheet } from './StepsOutputSheet'
import { useSheet } from '@/providers/SheetProvider'
import Paragraph from '@/components/ui/typography/Paragraph'
import { useWorkflowRunsForSession } from '@/hooks/workflows/useWorkflowRunsForSession'

const WorkflowChatArea = memo(
  ({ messages, session }: { messages: WorkflowData[]; session?: string }) => {
    // Get streaming state for this session using the hook
    const { isStreaming } = useWorkflowRunsForSession(session)

    return (
      <div className="space-y-16">
        {messages?.map((message, index) => {
          if (!message || !message.run_id) return null

          const isLastMessage =
            index === messages.length - 1 || message.run_id?.includes('temp-')

          const messageIsStreaming = isStreaming && message.status === 'RUNNING'

          return (
            <div
              key={message.run_id}
              id={`conversation-${message.run_id}`}
              className={`flex flex-col gap-y-4 ${isLastMessage ? 'min-h-[calc(100vh-19rem)]' : ''}`}
            >
              {message?.run_input && (
                <div id={`user-message-${message.run_id}`}>
                  <WorkflowUserMessage message={message.run_input} />
                </div>
              )}

              {/* Steps area: keep a consistent top margin to avoid layout shift */}
              {message.run_id?.startsWith('temp-') && messageIsStreaming ? (
                <div className="flex items-start">
                  <AgentThinkingLoader />
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 pl-10">
                    {message?.step_results?.length > 0 && (
                      <StepsOutputButton
                        messageStatus={message.status}
                        steps={message.step_results}
                        step_executor_runs={message.step_executor_runs}
                        runId={message.run_id ?? ''}
                      />
                    )}
                  </div>

                  {message?.events?.length || message.content ? (
                    <WorkflowAgentMessage
                      content={message.content}
                      events={message.events}
                      id={message.run_id ?? ''}
                      isStreaming={messageIsStreaming}
                      images={message.images}
                      videos={message.videos}
                      audio={message.audio}
                      response_audio={message.response_audio}
                    />
                  ) : message.status === 'CANCELLED' ? (
                    <WorkflowAgentMessage
                      content={message.content ?? 'Workflow run cancelled.'}
                      id={message.run_id ?? ''}
                      events={message.events}
                      images={message.images}
                      videos={message.videos}
                      audio={message.audio}
                      isStreaming={false}
                      response_audio={message.response_audio}
                    />
                  ) : null}
                </>
              )}
            </div>
          )
        })}
      </div>
    )
  }
)
WorkflowChatArea.displayName = 'WorkflowChatArea'

export default WorkflowChatArea

export const StepsOutputButton = ({
  steps,
  step_executor_runs,
  runId,
  messageStatus
}: {
  steps: StepResult[]
  step_executor_runs: StepExecutorRun[]
  runId: string
  messageStatus?: string
}) => {
  const { openSheet, replaceSheetData, isCurrent } = useSheet()
  const sheetId = `steps-output-${runId}`
  const previousSheetIdRef = useRef<string | null>(null)

  const handleClick = () => {
    openSheet(
      (data: unknown) => {
        const { steps, step_executor_runs } =
          (data as {
            steps: StepResult[]
            step_executor_runs: StepExecutorRun[]
          }) ?? {}
        return (
          <StepsOutputSheet
            messageStatus={messageStatus}
            steps={steps ?? []}
            step_executor_runs={step_executor_runs ?? []}
          />
        )
      },
      {
        side: 'right',
        title: 'Step Outputs',
        id: sheetId,
        initialData: {
          steps: steps ?? [],
          step_executor_runs: step_executor_runs ?? []
        }
      }
    )
  }

  // Live update the sheet content when steps/executor runs change while the sheet is open
  useEffect(() => {
    // Update if the currently open sheet matches the latest id
    if (isCurrent(sheetId)) {
      replaceSheetData({
        steps: steps ?? [],
        step_executor_runs: step_executor_runs ?? []
      })
    } else if (
      previousSheetIdRef.current &&
      isCurrent(previousSheetIdRef.current)
    ) {
      // Also update if the open sheet is still using the previous id (e.g., temp run id)
      replaceSheetData({
        steps: steps ?? [],
        step_executor_runs: step_executor_runs ?? []
      })
    }

    // Track the last seen sheet id to support temp→real run id transitions
    previousSheetIdRef.current = sheetId
  }, [steps, step_executor_runs])

  return (
    <Button
      className="flex h-6 w-fit items-center gap-2 rounded-sm bg-secondary px-2 text-primary"
      variant="ghost"
      onClick={handleClick}
    >
      <Icon type="list-end" size="xs" className="shrink-0" />
      {steps.length > 0 && (
        <>
          <Paragraph size="label" className="shrink-0 text-muted">
            {steps.length}
          </Paragraph>
        </>
      )}
      <Paragraph size="label" className="uppercase">
        Step outputs
      </Paragraph>
      <Icon type="caret-right" size="xs" />
    </Button>
  )
}
