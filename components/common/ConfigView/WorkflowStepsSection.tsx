import React from 'react'
import { WorkflowStep } from '@/types/workflow'
import Icon from '@/components/ui/icon'
import { IconToStepTypeMap } from '@/utils/workflows'
import Paragraph from '@/components/ui/typography/Paragraph'
import { cn } from '@/utils/cn'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import Tooltip from '@/components/common/Tooltip'

interface StepItemProps {
  step: WorkflowStep
  depth: number
  index: number
  loopCounter?: { count: number }
}

// Helper to format step names
const formatStepName = (
  step: WorkflowStep,
  index: number,
  loopCounter?: { count: number }
): string => {
  // If step has a name, use it
  if (step.name && step.name.trim()) {
    return step.name
  }

  // For unnamed Condition steps, just return "Condition"
  if (step.type === 'Condition') {
    return 'Condition'
  }

  // For unnamed Loop steps, use loop counter
  if (step.type === 'Loop' && loopCounter) {
    const num = ++loopCounter.count
    return `Loop ${num}`
  }

  // Fallback to type
  return step.type || `Step ${index + 1}`
}

const StepItem: React.FC<StepItemProps> = ({
  step,
  depth,
  index,
  loopCounter
}) => {
  const stepIcon = step.type ? IconToStepTypeMap[step.type] : 'divider-vertical'
  const hasNestedSteps = step.steps && step.steps.length > 0
  const displayName = formatStepName(step, index, loopCounter)
  const isRootStep = depth === 0
  const isCondition = step.type === 'Condition'
  const isLoop = step.type === 'Loop'

  const stepContent = (
    <div className="flex cursor-pointer items-center gap-2 truncate py-2">
      {/* Step Icon with Type Tooltip */}
      <Tooltip content={step.type || 'Step'} asChild>
        <div className="shrink-0">
          <Icon type={stepIcon} size="xs" className="text-primary" />
        </div>
      </Tooltip>

      {/* Step Name with Tooltip for Description */}
      {step.description ? (
        <Tooltip content={step.description} asChild>
          <Paragraph size="sm" className="min-w-0 truncate text-primary">
            {displayName}
          </Paragraph>
        </Tooltip>
      ) : (
        <Paragraph size="sm" className="min-w-0 truncate text-primary">
          {displayName}
        </Paragraph>
      )}
    </div>
  )

  if (!hasNestedSteps) {
    return (
      <div
        className={cn(
          'group relative flex items-center',
          isRootStep
            ? 'border-l-2 border-primary/30 pl-3'
            : 'border-l-2 border-border pl-5',
          depth > 0 && 'ml-6'
        )}
      >
        {stepContent}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'group relative',
        isRootStep
          ? 'border-l-2 border-primary/30'
          : 'border-l-2 border-border',
        depth > 0 && 'ml-6'
      )}
    >
      <Accordion type="single" collapsible>
        <AccordionItem value="open" className="border-0">
          <AccordionTrigger
            icon="caret-down"
            iconPosition="right"
            iconColor="text-primary"
            iconSize="size-3"
            className={cn(
              'py-0 hover:no-underline',
              isRootStep ? 'pl-3' : 'pl-5'
            )}
          >
            {stepContent}
          </AccordionTrigger>
          <AccordionContent className="pb-2 pl-4 pt-2">
            <div className="flex flex-col gap-y-2">
              {/* Show conditional/loop context */}
              {isCondition && (
                <Paragraph size="xsmall" className="italic text-muted">
                  Runs if condition evaluates to true:
                </Paragraph>
              )}
              {isLoop && (
                <Paragraph size="xsmall" className="italic text-muted">
                  Repeats until condition is met:
                </Paragraph>
              )}

              {/* Nested steps */}
              <div className="flex flex-col gap-y-1">
                {step.steps?.map((nestedStep, nestedIndex) => (
                  <StepItem
                    key={`${nestedStep.name || nestedStep.type}-${nestedIndex}`}
                    step={nestedStep}
                    depth={depth + 1}
                    index={nestedIndex}
                    loopCounter={loopCounter}
                  />
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

interface WorkflowStepsSectionProps {
  steps: WorkflowStep[]
}

export const WorkflowStepsSection: React.FC<WorkflowStepsSectionProps> = ({
  steps
}) => {
  if (!steps || steps.length === 0) {
    return null
  }

  // Create counter for tracking loop numbers across the tree
  const loopCounter = { count: 0 }

  return (
    <div className="rounded-lg bg-secondary/30 p-3">
      <div className="flex flex-col gap-y-3">
        {steps.map((step, index) => (
          <StepItem
            key={`${step.name || step.type}-${index}`}
            step={step}
            depth={0}
            index={index}
            loopCounter={loopCounter}
          />
        ))}
      </div>
    </div>
  )
}
