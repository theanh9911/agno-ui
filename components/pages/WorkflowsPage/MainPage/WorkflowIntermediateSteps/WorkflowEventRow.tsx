import Tooltip from '@/components/common/Tooltip'
import { Badge } from '@/components/ui/badge'
import Icon from '@/components/ui/icon'
import Paragraph from '@/components/ui/typography/Paragraph'

interface WorkflowEventRowProps {
  iconType: import('@/components/ui/icon').IconType
  tooltip: string
  label: string
  badge?: string
  status?:
    | 'PENDING'
    | 'RUNNING'
    | 'COMPLETED'
    | 'ERROR'
    | 'CANCELLED'
    | 'PAUSED'
}

export function WorkflowEventRow({
  iconType,
  tooltip,
  label,
  badge,
  status
}: WorkflowEventRowProps) {
  return (
    <div className="flex items-center gap-4">
      <Tooltip
        delayDuration={0}
        content={
          <Paragraph size="body" className="text-accent">
            {tooltip}
          </Paragraph>
        }
        side="top"
      >
        <Icon type={iconType} size="xs" className="text-muted" />
      </Tooltip>

      <div className="flex flex-wrap items-center gap-2">
        <Paragraph size="sm" className="text-muted">
          {label}
        </Paragraph>
        {badge && (
          <Badge variant="secondary" className="uppercase">
            {badge}
          </Badge>
        )}
        {status === 'RUNNING' && (
          <Badge
            variant="secondary"
            className="uppercase"
            icon="loader-2"
            iconPosition="right"
          >
            Running
          </Badge>
        )}
        {status === 'COMPLETED' && (
          <Badge variant="secondary" className="uppercase">
            Completed
          </Badge>
        )}
        {status === 'ERROR' && (
          <Badge variant="destructive" className="uppercase">
            ERROR
          </Badge>
        )}
      </div>
    </div>
  )
}

export default WorkflowEventRow
