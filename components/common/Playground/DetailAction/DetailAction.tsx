import React, { type FC, useMemo } from 'react'

import CopyButton from '@/components/common/CopyButton'

import { cn } from '@/utils/cn'
import { Metrics } from '@/types/Agent'
import { type IconType } from '@/components/ui/icon'
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/components/ui/popover'
import { formatMetricKeys } from '@/utils/format'
import { useSheet } from '@/providers/SheetProvider'
import SessionState from '../RightSidebar/SessionState/SessionState'
import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/typography/Heading'
import Paragraph from '@/components/ui/typography/Paragraph'

export interface DetailActionProps {
  copy?: boolean
  content?: string | object
  className?: string
  metrics?: Metrics | null
  sessionState?: Record<string, string[]>
}

interface MetricsCardProps {
  iconType: IconType
  title: string
  data: Metrics
}

interface ParsedMetric {
  key: string
  value: string
}

const MetricsCard: FC<MetricsCardProps> = ({ iconType, title, data }) => {
  const parsedMetrics = useMemo<ParsedMetric[]>(() => {
    const metricOrder: (keyof Metrics)[] = [
      'input_tokens',
      'output_tokens',
      'total_tokens',
      'time_to_first_token',
      'duration'
    ]

    const allowedMetrics = metricOrder.filter((key) => key in data)
    const formattedData = formatMetricKeys(data, allowedMetrics)

    return formattedData.split('\n').map((item) => {
      const [key, value] = item.split(':', 2)
      const trimmedKey = key.trim()
      return {
        key: trimmedKey === 'Duration' ? 'Run Duration' : trimmedKey,
        value: value.trim()
      }
    })
  }, [data])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="icon" icon={iconType} className="p-0" />
      </PopoverTrigger>
      <PopoverContent className="w-auto max-w-xs bg-background p-0">
        <div className="border-b border-border px-3 py-2">
          <Heading size={6} className="text-foreground">
            {title}
          </Heading>
        </div>
        <div className="max-h-52 overflow-auto">
          {parsedMetrics?.map((metric, index) => (
            <div
              key={`${metric.key}-${index}`}
              className={cn(
                'flex items-center justify-between gap-4 px-3 py-1.5',
                index !== parsedMetrics.length - 1 && 'border-b border-border'
              )}
            >
              <Paragraph size="xs">{metric.key}</Paragraph>
              <Paragraph size="xs" className="text-right">
                {metric.value}
              </Paragraph>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

const DetailAction: FC<DetailActionProps> = ({
  copy,
  content,
  className,
  metrics,
  sessionState
}) => {
  const { openSheet } = useSheet()

  const handleOpenSessionState = () => {
    openSheet(<SessionState sessionState={sessionState} />, {
      side: 'right',
      title: 'Session State'
    })
  }

  return (
    <div className={cn('flex items-center justify-start gap-4', className)}>
      {copy && content && (
        <CopyButton content={content} className="shrink-0 cursor-pointer p-0" />
      )}
      {metrics && (
        <MetricsCard
          iconType="bar-chart-4"
          title="Run Metrics"
          data={metrics}
        />
      )}
      {sessionState && (
        <Button
          variant="icon"
          icon="braces"
          className="p-0"
          onClick={handleOpenSessionState}
        />
      )}
    </div>
  )
}

export default DetailAction
