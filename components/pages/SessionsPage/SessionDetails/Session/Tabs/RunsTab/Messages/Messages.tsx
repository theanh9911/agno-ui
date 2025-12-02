import React, { useMemo, type FC } from 'react'

import InfoDetails from '@/components/common/Playground/InfoDetails/InfoDetails'
import ToolsContent from '@/components/common/Playground/Tools'
import Icon from '@/components/ui/icon'
import Paragraph from '@/components/ui/typography/Paragraph'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utils/cn'
import { formatDate } from '@/utils/format'
import { type MessageProps } from './types'

import { ReasoningStepContent } from '@/types/playground'
import { getIconForRole, getRoleLabel } from './constant'
import { formatMetricKeys } from '@/utils/format'

const Messages: FC<MessageProps> = ({
  message,
  index,
  isShowingDetails,
  parentRunId
}) => {
  const formattedDate = useMemo(
    () =>
      message?.created_at
        ? formatDate(message?.created_at, 'time-for-chat')
        : null,
    [message.created_at]
  )

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={`${index?.toString()}-${message.role}`}
      className="w-full"
    >
      <AccordionItem
        value={`${index?.toString()}-${message.role}`}
        key={`${index?.toString()}-${message.role}`}
        className={cn('group rounded-md border-b-0 p-3 hover:bg-secondary/50')}
      >
        <AccordionTrigger iconPosition="right" className="">
          <div className="flex w-full items-center justify-between">
            <div className="flex w-full items-center gap-x-4">
              {message.role !== 'metrics' ? (
                <Icon
                  type={getIconForRole(message?.role ?? '')}
                  className="shrink-0"
                />
              ) : (
                <div className="flex size-6 shrink-0 items-center justify-center rounded-sm bg-secondary/80">
                  <Icon size="xxs" type="bar-chart-4" className="shrink-0" />
                </div>
              )}
              <div className="flex w-full items-center justify-between">
                <Paragraph size="mono" className="uppercase text-muted">
                  {getRoleLabel(message?.role ?? '', parentRunId)}
                </Paragraph>
              </div>
            </div>

            <Paragraph
              size="mono"
              className="flex w-[calc(25%-15px+3rem)] items-center justify-end gap-1 whitespace-nowrap text-muted"
            >
              {formattedDate && formattedDate}
            </Paragraph>
          </div>
        </AccordionTrigger>
        <AccordionContent className="py-4">
          <div className="pl-11">
            {message.role === 'reasoning' ? (
              <div className="flex flex-col gap-4">
                {(
                  JSON.parse(message.content ?? '[]') as ReasoningStepContent[]
                ).map((val, idx) => (
                  <div
                    className={cn(
                      'flex flex-col gap-y-2',
                      isShowingDetails && 'w-5/6'
                    )}
                    key={`${val?.title}-${val?.reasoning}-${val?.action}-${val?.result}-${idx}`}
                  >
                    <InfoDetails
                      title={`Step ${String(idx + 1)}`}
                      icon="check-circle-2"
                      content={`${val.title}\n\n${val.reasoning}`}
                      hover
                    />
                    <div className="flex">
                      <Badge variant="secondary" className="font-mono text-xs">
                        CONFIDENCE: {val.confidence ? val.confidence * 100 : 0}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : message.role === 'metrics' ? (
              <div className="flex flex-col gap-4">
                <InfoDetails
                  title="Run Metrics"
                  icon="bar-chart-4"
                  content={formatMetricKeys(message.metrics ?? {}, [
                    'duration',
                    'total_tokens',
                    'input_tokens',
                    'output_tokens',
                    'completion_tokens',
                    'reasoning_tokens',
                    'prompt_tokens'
                  ])}
                  hover
                />
              </div>
            ) : (
              <ToolsContent tools={message} hover customWidth />
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default Messages
