import { useState } from 'react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import Paragraph from '@/components/ui/typography/Paragraph/Paragraph'
import Icon from '@/components/ui/icon'
import { Separator } from '@/components/ui/separator'

import RunsTable from '@/components/common/Playground/MessageAreaWrapper/RunsTable'
import { StepsTree } from '@/components/pages/WorkflowsPage/WorkflowSidebar/WorkflowConfiguration/WorkflowStepsTree/StepTree'
import { useWorkflowById } from '@/hooks/workflows/useWorkflowById'

type WorkflowRun = {
  run_id: string
  run_input: string | Record<string, unknown>
}

interface WorkflowsSidebarProps {
  items: WorkflowRun[]
  activeRunId: string | null
}

const WorkflowsSidebar = ({
  items = [],
  activeRunId = null
}: WorkflowsSidebarProps) => {
  const [isStepsAccordionCollapsed, setIsStepsAccordionCollapsed] =
    useState(false)
  const [isRunsAccordionCollapsed, setIsRunsAccordionCollapsed] =
    useState(false)

  const { data: workflowById } = useWorkflowById()

  const steps = workflowById?.steps

  if (!steps) return null

  return (
    <div className="flex-shrink-0 space-y-0 pr-6">
      <div className="border-l-[1px] border-border pl-4">
        <Accordion
          type="single"
          collapsible
          defaultValue="steps"
          value={isStepsAccordionCollapsed ? '' : 'steps'}
          onValueChange={(value) => setIsStepsAccordionCollapsed(value === '')}
        >
          <AccordionItem value="steps" className="border-b-0 border-border">
            <AccordionTrigger
              className="h-12 py-0"
              iconPosition="right"
              icon="chevron-down"
            >
              <div className="flex items-center gap-2">
                <Icon type="workflow" className="h-4 w-4" />
                <Paragraph size="body" className="text-primary">
                  Steps
                </Paragraph>
              </div>
            </AccordionTrigger>
            <AccordionContent className="max-h-[204px] w-full overflow-y-auto overflow-x-hidden pb-3">
              <StepsTree steps={steps} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {items.length > 0 && (
        <>
          <div className="py-4">
            <Separator />
          </div>
          <div className="border-l-[1px] border-border pl-4">
            <Accordion
              type="single"
              collapsible
              defaultValue="runs"
              value={isRunsAccordionCollapsed ? '' : 'runs'}
              onValueChange={(value) =>
                setIsRunsAccordionCollapsed(value === '')
              }
            >
              <AccordionItem value="runs" className="border-b-0">
                <AccordionTrigger
                  className="h-12 py-0"
                  iconPosition="right"
                  icon="chevron-down"
                >
                  <Paragraph size="body" className="text-primary">
                    Runs
                  </Paragraph>
                </AccordionTrigger>
                <AccordionContent className="max-h-[300px] overflow-y-auto pb-3">
                  <RunsTable
                    items={items}
                    activeRunId={activeRunId}
                    getRunId={(r: WorkflowRun) => r.run_id}
                    getLabel={(r: WorkflowRun) => {
                      const value = r.run_input
                      if (typeof value === 'string') return value
                      try {
                        return JSON.stringify(value)
                      } catch {
                        return String(value)
                      }
                    }}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </>
      )}
    </div>
  )
}

export default WorkflowsSidebar
