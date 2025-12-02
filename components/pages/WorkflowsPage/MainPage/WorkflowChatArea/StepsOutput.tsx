import React, { useState } from 'react'
import Icon from '@/components/ui/icon'
import { StepExecutorRun, StepResult, RunMetrics } from '@/types/workflow'
import { Metrics } from '@/types/Agent'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import Paragraph from '@/components/ui/typography/Paragraph'
import StepAccordionItem from './StepAccordionItem'
import { cn } from '@/utils/cn'
import { RunProps } from '@/components/pages/SessionsPage/SessionsDetails/Session/Tabs/RunsTab/Run/types'

interface StepsOutputProps {
  steps: StepResult[]
  step_executor_runs: StepExecutorRun[]
  showIcon?: boolean
  className?: string
  label?: string
  run?: RunProps['run']
  showMetrics?: boolean
  messageStatus?: string
}

const StepsOutput = ({
  steps,
  step_executor_runs,
  className,
  label = 'STEP OUTPUTS',
  showIcon = true,
  run,
  showMetrics,
  messageStatus
}: StepsOutputProps) => {
  const [, setIsOpen] = useState(false)

  const handleAccordionChange = (value: string) => {
    setIsOpen(value === 'workflow-steps')
  }

  // Function to get step-specific metrics from run.metrics.steps
  // Arguments: stepName - the name of the step to get metrics for
  // Returns: the metrics for the step
  const getStepMetrics = (stepName?: string): Metrics | undefined => {
    if (!run?.metrics || !stepName) return undefined
    const runMetrics = run.metrics as RunMetrics
    return runMetrics.steps?.[stepName]?.metrics
  }

  if (!steps || steps.length === 0) {
    return null
  }

  return (
    <div
      className={cn(
        'flex w-full max-w-full flex-row items-start gap-4 overflow-hidden max-md:break-words',
        className
      )}
    >
      {showIcon && (
        <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-sm bg-secondary p-1">
          <Icon type="workflow-steps" size="xs" className="text-primary" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <Accordion
          type="multiple"
          onValueChange={(values) => handleAccordionChange(values[0] || '')}
          className="w-full"
        >
          <AccordionItem value="workflow-steps" className="border-0">
            <AccordionTrigger
              showIcon={true}
              icon="caret-down"
              iconPosition="left"
              className="flex w-full justify-start gap-2"
            >
              <Paragraph size="label">{label}</Paragraph>
            </AccordionTrigger>
            <AccordionContent className="pb-0">
              <Accordion type="multiple" className="m-0 w-full p-0">
                {steps.map((step, stepIndex) => (
                  <StepAccordionItem
                    key={`step-${stepIndex}-${step.step_id}`}
                    step={step}
                    stepIndex={stepIndex}
                    step_executor_runs={step_executor_runs}
                    metrics={getStepMetrics(step.step_name)}
                    showMetrics={showMetrics}
                    messageStatus={messageStatus}
                  />
                ))}
              </Accordion>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}

export default StepsOutput
