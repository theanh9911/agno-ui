import { FC, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { MetricsChart, TokenChart } from '../MetricsChart'
import ModelsRunChart from '../MetricsChart/ModelsRunChart'

import NoDataChart from '../BlankStates/NoDataChart'
import type { Metrics } from '@/types/metrics'

interface MetricsChartsGridProps {
  sessionsExists: boolean
  start: Date
  end: Date
  metricsData?: { metrics: Metrics[] }
  transformedChartData: Array<{
    chartType: string
    title: string
    data: Metrics[]
  }>
  isTeaser?: boolean
}

type CardWrapperProps = {
  sessionsExists: boolean
  title: string
  children: React.ReactNode
}

const CardWrapper = ({ sessionsExists, title, children }: CardWrapperProps) => (
  <Card className="relative h-[20.25rem] min-w-[27rem] max-w-[51rem] hover:bg-secondary/50">
    {sessionsExists ? children : <NoDataChart title={title} />}
  </Card>
)

const MetricsChartsGrid: FC<MetricsChartsGridProps> = ({
  sessionsExists,
  start,
  end,
  metricsData,
  transformedChartData,
  isTeaser = false
}) => {
  const GridContent = useMemo(
    () => (
      <>
        <CardWrapper sessionsExists={!!sessionsExists} title="TotalTokens">
          <TokenChart
            start={start}
            end={end}
            data={metricsData?.metrics ?? []}
          />
        </CardWrapper>
        {transformedChartData.map(({ chartType, title, data }) => (
          <CardWrapper
            key={chartType}
            sessionsExists={!!sessionsExists}
            title={title}
          >
            <MetricsChart
              start={start}
              end={end}
              label={chartType}
              format="integer"
              data={data}
            />
          </CardWrapper>
        ))}
        <CardWrapper sessionsExists={!!sessionsExists} title="ModelsRuns">
          <ModelsRunChart data={metricsData?.metrics ?? []} />
        </CardWrapper>
      </>
    ),
    [sessionsExists, start, end, metricsData?.metrics, transformedChartData]
  )

  if (isTeaser) {
    return (
      <motion.div
        initial={{ opacity: 0, transform: 'translateY(10px)' }}
        animate={{ opacity: 1, transform: 'translateY(0px)' }}
        transition={{ duration: 0.4, ease: [0.25, 0.25, 0, 1] }}
        className="grid-responsive-charts mx-6 mb-8 gap-6"
      >
        {GridContent}
      </motion.div>
    )
  }

  return (
    <div className="grid-responsive-charts mx-6 mb-8 gap-6">{GridContent}</div>
  )
}

export default MetricsChartsGrid
