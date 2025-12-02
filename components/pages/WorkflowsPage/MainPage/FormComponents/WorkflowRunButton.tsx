import { Button } from '@/components/ui/button'
import Icon from '@/components/ui/icon'

export type WorkflowRunButtonState = 'idle' | 'loading' | 'streaming'

export interface WorkflowRunButtonProps {
  onRun: () => void
  disabled?: boolean
  state?: WorkflowRunButtonState
  compact?: boolean
}

const WorkflowRunButton = ({
  onRun,
  disabled = false,
  state = 'idle',
  compact = false
}: WorkflowRunButtonProps) => {
  const icon =
    state === 'loading' ? (
      <Icon type="loader-2" size="xs" className="animate-spin text-secondary" />
    ) : state === 'streaming' ? (
      <Icon type="stop" size="xs" className="text-secondary" />
    ) : (
      <Icon type="arrow-up-from-dot" size="xs" className="text-secondary" />
    )

  if (compact) {
    return (
      <Button
        onClick={onRun}
        variant="default"
        size="iconXs"
        className="size-6 shrink-0 rounded-sm"
        disabled={disabled}
      >
        {icon}
      </Button>
    )
  }

  return (
    <Button
      onClick={onRun}
      variant="default"
      size="iconXs"
      className="size-8 shrink-0 rounded-md"
      disabled={disabled}
    >
      {icon}
    </Button>
  )
}

export default WorkflowRunButton
