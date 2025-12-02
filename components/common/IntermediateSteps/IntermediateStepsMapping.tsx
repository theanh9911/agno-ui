import { IntermediateStep } from '@/types/playground'
import { IntermediateStepsMappingProps } from './types'
import StepRenderer from './steps/StepRenderer'

const IntermediateStepsMapping = ({
  processedSteps,
  isTeam,
  isReasoningStreaming,
  allSteps
}: IntermediateStepsMappingProps) => {
  return (
    <>
      {processedSteps?.map((step: IntermediateStep, index: number) => (
        <div
          key={`${step.id}-${index}`}
          className="transition-opacity duration-300 ease-in-out"
        >
          <StepRenderer
            step={step}
            isTeam={isTeam}
            isReasoningStreaming={isReasoningStreaming}
            allSteps={allSteps}
          />
        </div>
      ))}
    </>
  )
}

export default IntermediateStepsMapping
