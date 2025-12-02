import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import Icon from '@/components/ui/icon'
import Paragraph from '@/components/ui/typography/Paragraph'
import MessageContentRenderer from '@/components/common/MessageContentRenderer'
import { IntermediateStep } from '@/types/playground'
import { ToolCall } from '@/types/Agent'
import { ToolComponent } from '../Playground/Tools/ToolsComponent'
import DetailAction from '../Playground/DetailAction/DetailAction'

interface MemberResponsesListProps {
  agentResponses: IntermediateStep[]
  openAccordions: Record<string, boolean>
  handleMemberAccordionChange: (accordionId: string, value: string) => void
  getToolsForAgentResponse: (
    agentId: string,
    responseStep: IntermediateStep
  ) => Array<ToolCall & { isCompleted?: boolean }>
  messageIsStreaming: boolean
}

const MemberResponsesList = ({
  agentResponses,
  openAccordions,
  handleMemberAccordionChange,
  getToolsForAgentResponse,
  messageIsStreaming
}: MemberResponsesListProps) => {
  return (
    <>
      {agentResponses.map((step, index) => {
        const originalChunk = step.data.originalChunk!
        const memberAccordionId = `member-${originalChunk.agent_id}-${index}`

        return (
          <Accordion
            type="single"
            collapsible
            key={`${originalChunk.agent_id}-${index}`}
            defaultValue={
              openAccordions?.[memberAccordionId] ? memberAccordionId : ''
            }
            onValueChange={(value) =>
              handleMemberAccordionChange?.(memberAccordionId, value)
            }
          >
            <AccordionItem value={memberAccordionId}>
              <AccordionTrigger className="flex w-fit gap-2" showIcon={false}>
                <div className="flex items-center gap-2">
                  <Icon
                    type="caret-down"
                    size="xs"
                    className={`text-muted transition-transform duration-200 ${
                      openAccordions?.[memberAccordionId]
                        ? 'rotate-180'
                        : 'rotate-0'
                    }`}
                  />
                  <Icon type="agent" size="xs" color="brand" />
                  <Paragraph size="label" className="uppercase text-muted">
                    {originalChunk?.agent_name || originalChunk?.agent_id}
                  </Paragraph>
                </div>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 pt-2 text-primary/80">
                <div className="flex flex-col">
                  {originalChunk?.agent_id &&
                    getToolsForAgentResponse?.(originalChunk.agent_id, step)
                      ?.length > 0 && (
                      <div className="flex flex-wrap items-start gap-2">
                        {originalChunk?.agent_id &&
                          getToolsForAgentResponse?.(
                            originalChunk.agent_id,
                            step
                          )?.map((tool) => (
                            <ToolComponent
                              key={
                                tool?.tool_call_id ||
                                `${tool?.tool_name}-${tool?.created_at}`
                              }
                              tool={tool}
                              isCompleted={tool?.isCompleted}
                              type="single"
                            />
                          ))}
                      </div>
                    )}
                </div>
                <MessageContentRenderer chunk={originalChunk} />
                {!messageIsStreaming && (
                  <DetailAction
                    copy
                    content={
                      (typeof originalChunk?.content === 'string'
                        ? originalChunk?.content
                        : originalChunk?.response_audio?.transcript) ||
                      undefined
                    }
                  />
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )
      })}
    </>
  )
}

export default MemberResponsesList
