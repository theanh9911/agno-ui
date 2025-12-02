import React, { forwardRef } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import Icon, { IconType } from '@/components/ui/icon'
import Paragraph from '@/components/ui/typography/Paragraph'
import MarkdownRenderer from '@/components/ui/typography/MarkdownRenderer'
import References from '@/components/common/Playground/References'
import Reasoning from '@/components/common/Playground/Reasoning/Reasoning'
import { ToolComponent } from '@/components/common/Playground/Tools/ToolsComponent'
import { FormatType } from '@/components/pages/SessionsPage/types'
import { extractUserInput } from '@/components/pages/SessionsPage/utils'
import {
  formatDate,
  getFormattedReasoningTimeFromMessage
} from '@/utils/format'
import { cn } from '@/utils/cn'
import Run from './Run'
import { RunProps } from './types'
import { ToolCall } from '@/types/Agent'
import RunContent from './RunContent'
import AgentResponse from './AgentResponse'
import StepsOutput from '@/components/pages/WorkflowsPage/MainPage/WorkflowChatArea/StepsOutput'

interface RunMainInfoProps {
  run: RunProps['run']
  index: number
  isTeam: boolean
  allTools?: ToolCall[]
  viewMode: FormatType
  isWorkflow: boolean
}

function getContentArray(
  run: RunProps['run'],
  isTeam: boolean,
  isWorkflow: boolean,
  allTools: ToolCall[] | undefined,
  viewMode: FormatType
) {
  return [
    {
      key: 'user',
      icon: 'user-face',
      role: run.parent_run_id ? 'Team Leader' : 'user',
      response:
        viewMode === FormatType.Text ? (
          <Paragraph size="body">{extractUserInput(run.run_input)}</Paragraph>
        ) : (
          <MarkdownRenderer inline>
            {extractUserInput(run?.run_input)}
          </MarkdownRenderer>
        ),
      time: formatDate(run.created_at!, 'time-for-chat'),
      show: true
    },
    {
      key: 'tools',
      icon: 'tool',
      role: 'Tools',
      response: (
        <div className="flex w-full flex-wrap gap-2">
          {allTools?.map((tool, index) => (
            <ToolComponent
              key={`${tool?.tool_name}-${tool.created_at}-${index}`}
              tool={tool}
            />
          ))}
        </div>
      ),
      show: allTools && allTools.length > 0
    },
    {
      key: 'reasoning',
      icon: 'reasoning',
      role: 'Reasoning',
      response: (
        <Reasoning
          type="accordion"
          reasoning={run?.reasoning_steps ?? []}
          time={getFormattedReasoningTimeFromMessage(run)}
        />
      ),
      show: run?.reasoning_steps && run?.reasoning_steps.length > 0
    },
    {
      key: 'references',
      icon: 'context',
      role: 'References',
      response: <References references={run?.references ?? []} />,
      show:
        run?.references &&
        run?.references.length > 0 &&
        run?.references[0].references?.length > 0
    },
    {
      key: 'workflow-steps',
      icon: '',
      role: '',
      response: (
        <StepsOutput
          steps={run.step_results || []}
          step_executor_runs={run.step_executor_runs || []}
          run={run}
          showMetrics={true}
        />
      ),
      show: run.step_results && run.step_results.length > 0
    },
    {
      key: 'agent',
      icon: isTeam
        ? 'team-orange-bg'
        : isWorkflow
          ? 'workflow-with-orange-bg'
          : 'avatar',
      role: isTeam ? 'Team' : isWorkflow ? 'Workflow' : 'Agent',
      response: <AgentResponse run={run} viewMode={viewMode} />,
      time: run?.metrics?.response_times?.[0]
        ? `${run?.metrics?.response_times[0].toFixed(3)} SEC`
        : undefined,
      show: true
    }
  ]
}

const RunMainInfo = forwardRef<HTMLDivElement, RunMainInfoProps>(
  ({ run, isTeam, isWorkflow, index, allTools, viewMode }, ref) => {
    const contentArray = getContentArray(
      run,
      isTeam,
      isWorkflow,
      allTools,
      viewMode
    )

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-y-5 transition-all duration-300 ease-in-out'
        )}
      >
        {contentArray.map((item) => {
          // Render each item
          const content = item.show ? (
            <div
              key={item.key}
              className="group flex w-full justify-between gap-4 rounded-md p-3 hover:bg-secondary/50"
            >
              <RunContent
                icon={item.icon as IconType}
                role={item.role}
                response={item.response}
                time={item.time}
                viewMode={viewMode}
              />
            </div>
          ) : null

          // After "tools", render Member Responses Accordion
          if (item.key === 'tools' && (run.children?.length ?? 0) > 0) {
            return (
              <React.Fragment key={item.key}>
                {content}
                <Accordion type="single" collapsible className="mb-6 w-full">
                  <AccordionItem value={`member-responses-${index}`}>
                    <AccordionTrigger
                      className="flex w-full items-start justify-between gap-2 p-3"
                      iconPosition="right"
                    >
                      <div className="flex items-center gap-2">
                        <div className="rounded-sm bg-secondary p-1">
                          <Icon
                            type="messages-square"
                            size="xs"
                            className="shrink-0"
                          />
                        </div>
                        <Paragraph size="mono" className="uppercase text-muted">
                          Member Responses
                        </Paragraph>
                      </div>
                      <Separator className="mx-3 my-auto flex-1 text-center" />
                    </AccordionTrigger>
                    <AccordionContent className="ml-5 mt-4 flex flex-col gap-2">
                      {run.children?.map((child, idx) => (
                        <Run key={child.run_id} run={child} index={idx} />
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </React.Fragment>
            )
          }

          return content
        })}
      </div>
    )
  }
)

export default RunMainInfo
