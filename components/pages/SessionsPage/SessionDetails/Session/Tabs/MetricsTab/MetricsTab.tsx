import { filterMetrics, formatKey } from '@/components/pages/SessionsPage/utils'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import Paragraph from '@/components/ui/typography/Paragraph'
import { Metrics } from '@/types/Agent'
import React from 'react'

interface MetricsTabProps {
  metrics?: Metrics
  isLoading: boolean
}

const MetricsTab: React.FC<MetricsTabProps> = ({ metrics, isLoading }) => {
  const filteredMetrics = filterMetrics(metrics ?? {})

  if (isLoading) {
    return <Skeleton className="h-full w-full animate-pulse" />
  }

  if (!filteredMetrics || Object.keys(filteredMetrics).length === 0) {
    return (
      <Card className="flex h-auto w-full flex-col gap-4 p-3">
        <Paragraph size="body" className="text-muted">
          No metrics available
        </Paragraph>
      </Card>
    )
  }

  return (
    <Card className="flex h-auto w-full flex-col gap-4 p-3">
      {filteredMetrics && (
        <div className="grid grid-cols-[30%_70%] gap-4">
          {Object.entries(filteredMetrics).map(([key, value]) => (
            <React.Fragment key={key}>
              <Paragraph size="label" className="uppercase text-muted">
                {formatKey(key)}
              </Paragraph>
              <Paragraph size="body" className="text-primary">
                {value}
                {key.includes('time') ? 's' : key.includes('token') ? '' : ''}
              </Paragraph>
            </React.Fragment>
          ))}
        </div>
      )}
    </Card>
  )
}

export default MetricsTab
