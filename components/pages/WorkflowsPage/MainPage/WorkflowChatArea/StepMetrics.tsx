import React from 'react'
import Icon, { IconType } from '@/components/ui/icon'
import Paragraph from '@/components/ui/typography/Paragraph'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Metrics } from '@/types/Agent'
import { formatSmallerTime } from '@/utils/format'

interface StepMetricsProps {
  metrics: Metrics
  name?: string
}

const MetricItem: React.FC<{
  icon?: IconType
  label: string
  value: string | number
  className?: string
  unit?: string
}> = ({ label, value, icon, unit }) => (
  <div className="flex items-center gap-2">
    <Paragraph size="label" className="w-[200px] truncate uppercase">
      {label}
    </Paragraph>
    <div className="flex items-center gap-2">
      {icon && <Icon type={icon} size="xs" className="shrink-0 text-muted" />}
      <Paragraph size="body" className="w-[200px] truncate text-primary">
        {value} {unit}
      </Paragraph>
    </div>
  </div>
)

const StepMetrics: React.FC<StepMetricsProps> = ({ metrics, name = 'Run' }) => {
  const hasMetrics =
    metrics &&
    Object.values(metrics).some(
      (value) =>
        value !== null &&
        value !== undefined &&
        (Array.isArray(value) ? value.length > 0 : true)
    )

  if (!hasMetrics) {
    return null
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="metrics" className="border-0">
        <AccordionTrigger
          showIcon={true}
          icon="caret-down"
          iconPosition="right"
          iconColor="text-primary"
          className="flex w-full justify-between gap-2 rounded-md"
        >
          <div className="flex items-center gap-2">
            <Icon type="bar-chart-4" size="xs" className="shrink-0" />
            <Paragraph size="label" className="uppercase tracking-wide">
              {name} Metrics
            </Paragraph>
          </div>
        </AccordionTrigger>

        <AccordionContent className="rounded-md bg-secondary/50 p-4">
          <div className="flex flex-col gap-2">
            {metrics.input_tokens && (
              <MetricItem label="Input Tokens" value={metrics.input_tokens} />
            )}

            {metrics.output_tokens && (
              <MetricItem label="Output Tokens" value={metrics.output_tokens} />
            )}

            {metrics.total_tokens && (
              <MetricItem label="Total Tokens" value={metrics.total_tokens} />
            )}

            {metrics.time_to_first_token && (
              <MetricItem
                icon="time"
                label="Time to First Token"
                value={
                  formatSmallerTime(Number(metrics.time_to_first_token)).value
                }
                unit={
                  formatSmallerTime(Number(metrics.time_to_first_token)).unit
                }
              />
            )}

            {metrics.duration && typeof metrics.duration === 'number' && (
              <MetricItem
                icon="time"
                label="Duration"
                value={formatSmallerTime(metrics.duration).value}
                unit={formatSmallerTime(metrics.duration).unit}
              />
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default StepMetrics
