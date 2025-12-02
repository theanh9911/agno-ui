import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import Icon from '@/components/ui/icon'
import { Separator } from '@/components/ui/separator'
import Paragraph from '@/components/ui/typography/Paragraph'
import React from 'react'
import Messages from '../Messages'
import { DetailedRunProps } from './types'
import Run from './Run'
import { cn } from '@/utils/cn'

const DetailedRun = ({
  run,
  index,
  isTeam,
  isShowingDetails,
  messages
}: DetailedRunProps) => {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={`run-${index}`}
      className="w-full"
    >
      <AccordionItem
        key={`accordion-${index}`}
        value={run.parent_run_id ? `member-${index}` : `run-${index}`}
        className=""
      >
        <AccordionTrigger
          className="flex w-full items-start justify-between gap-2 p-3"
          iconPosition="right"
        >
          <div className="flex items-center gap-2">
            <Icon size="xs" className="text-muted/50" type="run" />
            {run?.parent_run_id ? (
              <Paragraph size="mono" className="uppercase text-muted">
                MEMBER RUN ...{index + 1}
              </Paragraph>
            ) : (
              <Paragraph size="mono" className="uppercase text-muted">
                RUN ...{index + 1}
              </Paragraph>
            )}
          </div>
          <Separator className="mx-3 my-auto flex-1 text-center" />
        </AccordionTrigger>
        <AccordionContent>
          <div className={cn('flex flex-col gap-y-4 overflow-hidden')}>
            {messages?.map((message, idx) => (
              <Messages
                message={message}
                index={idx}
                parentRunId={run?.parent_run_id}
                key={`${message?.role}-${idx}`}
                isShowingDetails={isShowingDetails}
              />
            ))}
          </div>

          {/* Render children recursively when showing details */}
          {(run.children?.length ?? 0) > 0 && (
            <div className="ml-5 mt-2 flex flex-col gap-2">
              {run?.children?.map((child, idx) => (
                <Run
                  key={child.run_id}
                  run={child}
                  index={idx}
                  isTeam={isTeam}
                />
              ))}
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default DetailedRun
