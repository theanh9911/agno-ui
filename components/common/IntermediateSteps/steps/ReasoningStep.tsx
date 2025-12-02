import Icon from '@/components/ui/icon/Icon'
import Reasoning from '../../Playground/Reasoning/Reasoning'
import { IntermediateStep, ReasoningStepContent } from '@/types/playground'
import { getAgentInfo, getReasoningData } from '../utils'

interface ReasoningStepProps {
  step: IntermediateStep
  isTeam: boolean
  isReasoningStreaming?: boolean
  allSteps: IntermediateStep[]
  defaultOpen?: boolean
  heightLimit?: number | undefined
}

const ReasoningStep = ({
  step,
  isTeam,
  isReasoningStreaming = false,
  defaultOpen = false,
  heightLimit = undefined
}: ReasoningStepProps) => {
  const agentId = isTeam ? getAgentInfo(step) : null
  const reasoningLabel = agentId ? `Reasoning by ${agentId}` : 'Reasoning'

  const reasoning: ReasoningStepContent[] = getReasoningData(step)

  return (
    <div className="flex items-start gap-4">
      <Icon
        type="brain-circuit-2"
        size="xs"
        className="mt-1.5 shrink-0 text-muted"
      />
      <Reasoning
        type="accordion"
        isLoading={isReasoningStreaming}
        defaultOpen={defaultOpen}
        reasoning={reasoning || []}
        label={reasoningLabel}
        heightLimit={heightLimit}
      />
    </div>
  )
}

export default ReasoningStep
