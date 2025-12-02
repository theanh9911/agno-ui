import { StepExecutorRun, StepResult } from '@/types/workflow'
import StepAccordionItem from './StepAccordionItem'
import { Accordion } from '@/components/ui/accordion'

export const StepsOutputSheet = ({
  steps,
  step_executor_runs,
  messageStatus
}: {
  steps: StepResult[]
  step_executor_runs: StepExecutorRun[]
  messageStatus?: string
}) => {
  return (
    <Accordion type="multiple" className="pb-5">
      {steps.map((step, stepIndex) => (
        <StepAccordionItem
          key={`step-${stepIndex}-${step.step_id}`}
          step={step}
          stepIndex={stepIndex}
          step_executor_runs={step_executor_runs}
          messageStatus={messageStatus}
        />
      ))}
    </Accordion>
  )
}
