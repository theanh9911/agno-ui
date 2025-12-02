import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { IntermediateStep, RunEvent } from '@/types/playground'
import { useMemo, useState } from 'react'
import { useFilterType } from '@/hooks/useFilterType'
import {
  getEventType,
  eventTypeHelpers,
  handleEventDeduplication
} from './utils'
import IntermediateStepsMapping from './IntermediateStepsMapping'
import { IntermediateStepsType } from './types'
import { getIntermediateStepsLabel } from './utils'
import IntermediateStepsTrigger from './IntermediateStepsTrigger'
// Step components are used within StepRenderer imported by mapping

interface IntermediateStepsProps {
  intermediateSteps: IntermediateStep[]
  streamingError?: boolean
  isReasoningStreaming?: boolean
  messageKey?: string
  type?: IntermediateStepsType
  defaultOpen?: boolean
  // Controlled accordion props
  open?: boolean
  onOpenChange?: (open: boolean) => void
  // Optional external label override
  label?: string
  isResponseStreaming?: boolean
}

const IntermediateSteps = ({
  intermediateSteps,
  streamingError = false,
  isReasoningStreaming = false,
  defaultOpen = false,
  label,
  isResponseStreaming = false
}: IntermediateStepsProps) => {
  const { isTeam } = useFilterType()
  const [internalOpen, setInternalOpen] = useState(defaultOpen || false)

  // Mapping now imports and uses a centralized StepRenderer; nothing to compute here

  // Memoize the processed steps computation based on intermediateSteps
  const processedSteps = useMemo(() => {
    if (!intermediateSteps) return []

    let steps = intermediateSteps
      .filter((step) => !step.event.includes(RunEvent.RunContent))
      .reduce((acc: IntermediateStep[], step) => {
        const eventType = getEventType(step.event)

        if (
          eventTypeHelpers.isToolCall(eventType) ||
          eventTypeHelpers.isReasoning(eventType) ||
          eventTypeHelpers.isMemoryUpdate(eventType)
        ) {
          handleEventDeduplication(acc, step, eventType)
        } else {
          acc.push(step)
        }

        return acc
      }, [])

    // If there's a streaming error, filter out incomplete tool calls and memory updates
    if (streamingError) {
      steps = steps.filter((step) => {
        const eventType = getEventType(step.event)

        // Keep completed tool calls and memory updates, filter out incomplete ones
        if (eventTypeHelpers.isToolCall(eventType)) {
          return step.event.includes(RunEvent.ToolCallCompleted)
        }

        if (eventTypeHelpers.isMemoryUpdate(eventType)) {
          return step.event.includes(RunEvent.MemoryUpdateCompleted)
        }

        // Keep completed reasoning, filter out incomplete reasoning
        if (eventTypeHelpers.isReasoning(eventType)) {
          return step.event.includes(RunEvent.ReasoningCompleted)
        }

        // Keep all other steps (run events, etc.)
        return true
      })
    }

    return steps
  }, [intermediateSteps, streamingError])

  const handleAccordionChange = (value: string) => {
    const isOpening = value !== ''
    setInternalOpen(isOpening)
  }

  if (!intermediateSteps) return null

  const displayLabel = useMemo(
    () => label ?? getIntermediateStepsLabel(intermediateSteps, isTeam),
    [label, intermediateSteps, isTeam]
  )

  return (
    <Accordion
      type="single"
      collapsible
      value={internalOpen ? 'intermediate-steps' : ''}
      onValueChange={handleAccordionChange}
    >
      <AccordionItem value={'intermediate-steps'}>
        <AccordionTrigger
          className="flex w-fit max-w-full gap-2"
          showIcon={false}
          iconPosition="right"
        >
          <IntermediateStepsTrigger
            label={displayLabel}
            isOpen={internalOpen}
            isStreaming={isResponseStreaming}
          />
        </AccordionTrigger>
        <AccordionContent className="flex w-full flex-col gap-4 border-l border-border pl-4 pt-3">
          <IntermediateStepsMapping
            processedSteps={processedSteps}
            isTeam={isTeam}
            isReasoningStreaming={isReasoningStreaming}
            allSteps={intermediateSteps}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default IntermediateSteps
