import React, { useMemo } from 'react'
import dayjs from 'dayjs'
import MetricsChartsGrid from '../MetricsChartsGrid/MetricsChartsGrid'
import { chartConfigs } from '../constant'
import { metrics } from '@/utils/MockData'
import TeaserPageWrapper from '@/components/common/TeaserPageWrapper'

const MetricsTeaserPage = () => {
  const mockStart = dayjs('2025-07-01').startOf('month').toDate()
  const mockEnd = dayjs('2025-07-01').endOf('month').toDate()

  // Transform data for charts using static metrics
  const transformedChartData = useMemo(() => {
    return chartConfigs.map((config) => ({
      ...config,
      data: (metrics?.metrics || []).map((item) => ({
        ...item
      }))
    }))
  }, [])

  return (
    <TeaserPageWrapper>
      <MetricsChartsGrid
        sessionsExists={true}
        start={mockStart}
        end={mockEnd}
        metricsData={metrics}
        transformedChartData={transformedChartData}
        isTeaser={true}
      />
    </TeaserPageWrapper>
  )
}

export default MetricsTeaserPage
