import { useMemo, useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import IntermediateStepsTrigger from '@/components/common/IntermediateSteps/IntermediateStepsTrigger'
import { WorkflowRealtimeEvent } from '@/types/workflow'
import WorkflowEventsMapping from './WorkflowEventsMapping'
import { getEventsLabel, processWorkflowEvents } from './utils'

export const WorkflowIntermediateSteps = ({
  events,
  isStreaming = false
}: {
  events: WorkflowRealtimeEvent[]
  isStreaming?: boolean
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const { processedEvents, completedRunIds } = useMemo(
    () => processWorkflowEvents(events),
    [events]
  )

  const handleAccordionChange = (value: string) => {
    const opening = value !== ''
    setIsOpen(opening)
  }

  const latestLabel = useMemo(
    () => getEventsLabel(processedEvents),
    [processedEvents]
  )

  if (!processedEvents?.length) return null

  return (
    <Accordion
      type="single"
      collapsible
      value={isOpen ? 'intermediate-steps' : ''}
      onValueChange={handleAccordionChange}
    >
      <AccordionItem value={'intermediate-steps'}>
        <AccordionTrigger
          className="flex w-fit gap-2"
          showIcon={false}
          iconPosition="right"
        >
          <IntermediateStepsTrigger
            label={latestLabel}
            isOpen={isOpen}
            isStreaming={isStreaming}
          />
        </AccordionTrigger>
        <AccordionContent className="flex w-full flex-col gap-4 border-l border-border pl-4 pt-3">
          <WorkflowEventsMapping
            events={processedEvents}
            completedRunIds={completedRunIds}
            isStreaming={isStreaming}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default WorkflowIntermediateSteps
