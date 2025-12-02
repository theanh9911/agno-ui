import React, { type FC } from 'react'

import { type ToolsProps } from './type'
import InfoDetails from '../InfoDetails/InfoDetails'
import DetailAction from '@/components/common/Playground/DetailAction'
import { Metrics } from '@/types/Agent'

import { useSessionStore } from '@/stores/SessionsStore'
import { cn } from '@/utils/cn'
import { formatMetricKeys, getFormattedToolCalls } from '@/utils/format'
import MarkdownRenderer from '@/components/ui/typography/MarkdownRenderer/MarkdownRenderer'

const metricKeysToShow: (keyof Metrics)[] = [
  'duration',
  'total_tokens',
  'input_tokens',
  'output_tokens'
]

const renderToolArgs = (toolArgs: Record<string, unknown> | object) => {
  if (typeof toolArgs === 'object' && toolArgs !== null) {
    return (
      <div className="flex flex-col gap-y-1">
        {Object.entries(toolArgs as Record<string, unknown>).map(
          ([key, value]) => (
            <div key={key}>
              <MarkdownRenderer>
                {String('**' + key + '**' + ' : ' + value)}
              </MarkdownRenderer>
            </div>
          )
        )}
      </div>
    )
  } else if (typeof toolArgs === 'string') {
    return <MarkdownRenderer>{toolArgs}</MarkdownRenderer>
  }
  return toolArgs
}

const ToolsContent: FC<ToolsProps> = ({
  tools,
  hover = true,
  customWidth = false,
  role = 'messages'
}) => {
  const isShowingDetails = useSessionStore((state) => state.isShowingDetails)

  const getTitle = (baseTitle: string): string => {
    return role === 'tool' ? `Tool ${baseTitle}` : baseTitle
  }

  return (
    <>
      <div className="flex flex-col gap-y-4">
        {tools.tool_name && (
          <InfoDetails
            title={getTitle('Name')}
            icon="hammer"
            content={tools?.tool_name}
            hover={hover}
            className={cn(isShowingDetails && customWidth && 'w-5/6')}
          />
        )}
        {tools.tool_args && (
          <InfoDetails
            title={getTitle('Args')}
            icon="pencil"
            content={renderToolArgs(tools.tool_args)}
            hover={hover}
            className={cn(isShowingDetails && customWidth && 'w-5/6')}
          />
        )}
        {tools.metrics !== undefined &&
          tools.metrics !== null &&
          Object.keys(tools.metrics).length > 0 && (
            <InfoDetails
              title={getTitle('Metrics')}
              icon="bar-chart-4"
              content={formatMetricKeys(tools.metrics, metricKeysToShow)}
              mode="markdown"
              hover={hover}
              className={cn(isShowingDetails && customWidth && 'w-5/6')}
            />
          )}
        {tools.content && (
          <InfoDetails
            title={getTitle('Content')}
            icon="details"
            content={tools?.content}
            mode="markdown"
            hover={hover}
            className={cn(isShowingDetails && customWidth && 'w-5/6')}
          />
        )}

        {tools?.result && (
          <InfoDetails
            title={getTitle('Result')}
            icon="details"
            mode="json"
            content={tools?.result}
            hover={hover}
            className={cn(isShowingDetails && customWidth && 'w-5/6')}
          />
        )}

        {tools.tool_calls && role === 'messages' && (
          <InfoDetails
            title="Tool Calls"
            icon="hammer"
            content={getFormattedToolCalls(tools?.tool_calls?.[0])}
            hover={hover}
            className={cn(isShowingDetails && customWidth && 'w-5/6')}
          />
        )}

        {tools.role === 'assistant' && <DetailAction copy={false} />}
      </div>
    </>
  )
}

export default ToolsContent
