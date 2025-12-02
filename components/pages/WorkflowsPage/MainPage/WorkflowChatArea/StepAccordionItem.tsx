import React from 'react'
import Icon from '@/components/ui/icon'
import Paragraph from '@/components/ui/typography/Paragraph'
import Spinner from '@/components/common/Spinner'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { StepResult, StepExecutorRun } from '@/types/workflow'
import StepTools from './StepTools'
import StepMetrics from './StepMetrics'
import {
  generateStepNumber,
  getExecutorRunDetails,
  getWorkflowStepDetails,
  isExecutorRun,
  StepAccordionItemProps,
  StepDetails
} from './utils'
import MessageContentRenderer from '@/components/common/MessageContentRenderer'

// Helper function to get all step details
const getStepDetails = (
  step: StepResult | StepExecutorRun,
  stepIndex: number
): StepDetails => {
  if (isExecutorRun(stepIndex)) {
    return getExecutorRunDetails(step as StepExecutorRun)
  }

  // At this point, we know step is StepResult since it's not an executor run
  return getWorkflowStepDetails(step as StepResult, stepIndex)
}

const getExecutorRunsForStep = (
  step: StepResult | StepExecutorRun,
  step_executor_runs: StepExecutorRun[]
): StepExecutorRun[] => {
  if (!('step_id' in step) || !step.step_id) return []
  return step_executor_runs.filter(
    (executorRun) => executorRun.workflow_step_id === step.step_id
  )
}

const StepAccordionItem: React.FC<StepAccordionItemProps> = ({
  step,
  stepIndex,
  step_executor_runs,
  depth = 0,
  parentStepNumber,
  metrics,
  showMetrics,
  messageStatus
}) => {
  const hasExecutedSteps = step_executor_runs.length > 0
  const {
    displayName,
    displayIcon,
    accordionValue,
    stepTypeIcon,
    stepTypeLabel
  } = getStepDetails(step, stepIndex)

  // Get executor runs for this step
  const stepExecutorRuns = getExecutorRunsForStep(step, step_executor_runs)

  // Generate step number for display (only for workflow steps, not executor runs)
  const stepNumber = !isExecutorRun(stepIndex)
    ? generateStepNumber(depth, stepIndex, parentStepNumber)
    : null
  // TODO: Refactor JSX into smaller sub-components for better maintainability:
  // - StepHeader.tsx: Handle the accordion trigger with step number, type icon, and name
  // - StepContent.tsx: Handle the accordion content including step content, tools, and nested steps
  // - StepTools.tsx: Already exists, but could be enhanced
  // - StepNestedSteps.tsx: Handle the recursive rendering of nested steps and executor runs

  return (
    <AccordionItem
      key={accordionValue}
      value={accordionValue}
      className="border-0"
    >
      <AccordionTrigger
        showIcon={true}
        icon="caret-down"
        iconColor="text-muted"
        className="flex w-full justify-start gap-2 text-muted"
      >
        <div className="flex items-center gap-2">
          {stepNumber && (
            <>
              <Paragraph size="label" className="shrink-0">
                STEP {stepNumber}
              </Paragraph>

              {stepTypeIcon && (
                <span>
                  {
                    <Icon
                      type={stepTypeIcon}
                      size="xs"
                      className="text-muted"
                    />
                  }
                </span>
              )}
              {stepTypeLabel && (
                <span className="text-muted">{stepTypeLabel}</span>
              )}
            </>
          )}

          <div className="flex items-center gap-2 truncate">
            {displayIcon && (
              <span>
                <Icon type={displayIcon} size="xs" className="text-muted" />
              </span>
            )}
            {displayName && <span className="truncate">{displayName}</span>}
          </div>

          {step.status === 'RUNNING' && messageStatus === 'RUNNING' && (
            <Spinner />
          )}
        </div>
      </AccordionTrigger>
      {(hasExecutedSteps || step.content || stepExecutorRuns.length > 0) && (
        <AccordionContent className="pb-0">
          <div className="flex flex-col gap-2">
            {step.tools && step.tools.length > 0 && (
              <div className="flex w-full flex-wrap gap-2 overflow-hidden">
                {step.tools.map((tool, index) => (
                  <StepTools key={index} tool={tool} />
                ))}
              </div>
            )}

            {/* Step Content */}
            {step.content && (
              <div className="overflow-hidden">
                <MessageContentRenderer
                  content={step.content}
                  images={step?.images}
                  videos={step?.videos}
                  audio={step?.audio}
                  response_audio={step?.response_audio}
                />
              </div>
            )}

            {showMetrics && step.metrics && isExecutorRun(stepIndex) && (
              <StepMetrics metrics={step.metrics} name="Run" />
            )}
            {/* Executor Runs for this step */}
            {stepExecutorRuns.length > 0 && (
              <div className="mb-0 border-l border-border pl-4">
                <Accordion
                  type="multiple"
                  defaultValue={stepExecutorRuns.map(
                    (_, index) => `executor-${index}`
                  )}
                  className="w-full space-y-2"
                >
                  {stepExecutorRuns.map((executorRun, index) => (
                    <div key={executorRun.run_id || `executor-${index}`}>
                      <StepAccordionItem
                        messageStatus={messageStatus}
                        step={executorRun}
                        stepIndex={-1}
                        step_executor_runs={step_executor_runs}
                        depth={depth + 1}
                        parentStepNumber={stepNumber || undefined}
                        metrics={executorRun.metrics}
                        showMetrics={showMetrics}
                      />
                    </div>
                  ))}
                </Accordion>
              </div>
            )}

            {/* Error Display */}
            {'error' in step && step.error && (
              <div className="overflow-hidden">
                <Paragraph
                  size="body"
                  className="overflow-wrap-anywhere whitespace-pre-wrap break-words text-destructive"
                >
                  {step.error}
                </Paragraph>
              </div>
            )}

            {/* Always show nested steps */}
            {'steps' in step &&
              Array.isArray(step.steps) &&
              step.steps.length > 0 && (
                <div className="border-l border-border pl-4">
                  <Accordion
                    type="multiple"
                    defaultValue={[]}
                    className="w-full space-y-2"
                  >
                    {step.steps.map((executedStep, index) => {
                      const nestedStepKey =
                        executedStep.step_run_id ||
                        `nested-step-${index}-${('step_id' in executedStep && executedStep.step_id) || ('workflow_step_id' in executedStep && executedStep.workflow_step_id) || 'unknown'}-${executedStep.run_id || ''}`

                      return (
                        <StepAccordionItem
                          key={nestedStepKey}
                          messageStatus={messageStatus}
                          step={executedStep}
                          stepIndex={index}
                          step_executor_runs={step_executor_runs}
                          depth={depth + 1}
                          parentStepNumber={stepNumber || undefined}
                          metrics={executedStep.metrics}
                        />
                      )
                    })}
                  </Accordion>
                </div>
              )}

            {showMetrics && metrics && !isExecutorRun(stepIndex) && (
              <StepMetrics metrics={metrics} name="Step" />
            )}
          </div>
        </AccordionContent>
      )}
    </AccordionItem>
  )
}

export default StepAccordionItem
