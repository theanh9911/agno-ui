import Tooltip from '@/components/common/Tooltip'
import Icon from '@/components/ui/icon/Icon'
import Paragraph from '@/components/ui/typography/Paragraph'
import { ToolComponent } from '../../Playground/Tools/ToolsComponent'
import { IntermediateStep } from '@/types/playground'
import { eventTypeHelpers, getAgentInfo, getToolCalls } from '../utils'

interface ToolCallsStepProps {
  step: IntermediateStep
  isTeam: boolean
}

const ToolCallsStep = ({ step, isTeam }: ToolCallsStepProps) => {
  const isCompleted = eventTypeHelpers.isCompleted(step.event, 'ToolCall')
  const toolCalls = getToolCalls(step)
  const toolCallAgentId = isTeam ? getAgentInfo(step) : null

  return (
    <div className="flex items-center gap-4">
      <Tooltip
        delayDuration={0}
        content={
          <Paragraph size="body" className="text-accent">
            Tool Call
          </Paragraph>
        }
        side="top"
      >
        <Icon type="hammer" size="xs" className="shrink-0 text-muted" />
      </Tooltip>
      <div className="flex flex-wrap items-center gap-2">
        {toolCallAgentId && (
          <span className="text-muted-foreground text-sm">
            {toolCallAgentId}:
          </span>
        )}
        {toolCalls.map((toolCall) => (
          <ToolComponent
            key={`${step.id}-${toolCall.tool_call_id || toolCall.tool_name}`}
            tool={toolCall}
            isCompleted={isCompleted}
          />
        ))}
      </div>
    </div>
  )
}

export default ToolCallsStep
