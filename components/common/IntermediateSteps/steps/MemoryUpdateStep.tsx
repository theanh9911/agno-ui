import Tooltip from '@/components/common/Tooltip'
import Icon from '@/components/ui/icon/Icon'
import Paragraph from '@/components/ui/typography/Paragraph'
import { Badge } from '@/components/ui/badge'
import { IntermediateStep } from '@/types/playground'
import { eventTypeHelpers, getAgentInfo } from '../utils'

interface MemoryUpdateStepProps {
  step: IntermediateStep
  isTeam: boolean
}

const MemoryUpdateStep = ({ step, isTeam }: MemoryUpdateStepProps) => {
  const isMemoryCompleted =
    eventTypeHelpers.isCompleted(step.event, 'MemoryUpdate') ||
    eventTypeHelpers.isCompleted(step.event, 'UpdatingMemory')
  const memoryAgentId = isTeam ? getAgentInfo(step) : null

  return (
    <div className="flex items-center gap-4">
      <Tooltip
        delayDuration={0}
        content={
          <Paragraph size="body" className="text-accent">
            Memory Update
          </Paragraph>
        }
        side="top"
      >
        <Icon type="memory-stick" size="xs" className="shrink-0 text-muted" />
      </Tooltip>
      <div className="flex flex-wrap items-center gap-2">
        {memoryAgentId && (
          <span className="text-muted-foreground text-sm">
            {memoryAgentId}:
          </span>
        )}
        <Badge
          variant="secondary"
          className="uppercase"
          icon={!isMemoryCompleted ? 'loader-2' : undefined}
          iconPosition="right"
        >
          <span>Memory Update{isMemoryCompleted ? 'd' : ''}</span>
        </Badge>
      </div>
    </div>
  )
}

export default MemoryUpdateStep
