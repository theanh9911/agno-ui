import { IntermediateStep, RunEvent } from '@/types/playground'
import { getEventType } from '../utils'
import RunStatusStep from './RunStatusStep'
import ToolCallsStep from './ToolCallsStep'
import ReasoningStep from './ReasoningStep'
import MemoryUpdateStep from './MemoryUpdateStep'

interface StepRendererProps {
  step: IntermediateStep
  isTeam: boolean
  isReasoningStreaming?: boolean
  allSteps: IntermediateStep[]
}

const StepRenderer = ({
  step,
  isTeam,
  isReasoningStreaming,
  allSteps
}: StepRendererProps) => {
  const eventType = getEventType(step.event)

  switch (eventType) {
    case RunEvent.RunStarted:
    case RunEvent.RunCompleted:
    case RunEvent.RunError:
    case RunEvent.RunCancelled:
      return <RunStatusStep step={step} isTeam={isTeam} />
    case 'ToolCall':
      return <ToolCallsStep step={step} isTeam={isTeam} />
    case RunEvent.ReasoningStarted:
    case RunEvent.ReasoningStep:
    case RunEvent.ReasoningCompleted:
      return (
        <ReasoningStep
          step={step}
          isTeam={isTeam}
          isReasoningStreaming={isReasoningStreaming}
          allSteps={allSteps}
          defaultOpen={true}
          heightLimit={320}
        />
      )
    case RunEvent.MemoryUpdateStarted:
    case RunEvent.MemoryUpdateCompleted:
    case RunEvent.UpdatingMemory:
      return <MemoryUpdateStep step={step} isTeam={isTeam} />
    default:
      return <RunStatusStep step={step} isTeam={isTeam} />
  }
}

export default StepRenderer
