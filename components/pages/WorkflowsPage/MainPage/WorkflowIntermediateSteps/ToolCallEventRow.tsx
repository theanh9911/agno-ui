import Tooltip from '@/components/common/Tooltip'
import { ToolComponent } from '@/components/common/Playground/Tools/ToolsComponent'
import Icon from '@/components/ui/icon'
import Paragraph from '@/components/ui/typography/Paragraph'
import { ToolCall as AgentToolCall } from '@/types/Agent'

interface ToolCallEventRowProps {
  tool?: AgentToolCall
  isCompleted: boolean
  isWorkflowStreaming: boolean
}

export function ToolCallEventRow({
  tool,
  isCompleted,
  isWorkflowStreaming
}: ToolCallEventRowProps) {
  if (!tool) return null
  return (
    <div className="flex items-start gap-4">
      <Tooltip
        delayDuration={0}
        content={
          <Paragraph size="body" className="text-accent">
            Tool Calls
          </Paragraph>
        }
        side="top"
      >
        <Icon type="hammer" size="xs" className="text-muted" />
      </Tooltip>
      <div className="flex flex-wrap gap-2">
        <ToolComponent
          tool={tool}
          isCompleted={isCompleted || !isWorkflowStreaming}
          type="single"
        />
      </div>
    </div>
  )
}

export default ToolCallEventRow
