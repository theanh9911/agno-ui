import { PageWrapper } from '@/components/layouts/PageWrapper'
import { MAX_PAGE_WRAPPER_WIDTHS } from '@/constants'
import { useMetrics } from '@/hooks/metrics/useMetricQuery'
import React, { useMemo } from 'react'
import { Helmet } from 'react-helmet-async'

import { BlankState } from '@/components/common/BlankState'
import OsBlankState from '@/components/common/OsBlankState/OsBlankState'
import { useDateFilters } from './hooks/useDateFilters'
import { chartConfigs } from './constant'
import MetricsChartsGrid from './MetricsChartsGrid/MetricsChartsGrid'
import Header from './Header/Header'
import {
  PageViewState,
  usePageViewOptions
} from '@/hooks/os/usePageViewOptions'
import MetricsTeaserPage from './BlankStates/MetricsTeaserPage'
import { Card } from '@/components/ui/card'
import LoadingChart from './BlankStates/LoadingChart'
import { useDatabase } from '@/providers/DatabaseProvider/DatabaseProvider'
import { useFetchOSConfig } from '@/hooks/os'

const MetricsPage = () => {
  const { start, end } = useDateFilters()
  const { selectedDatabase } = useDatabase()
  const { data: osConfig } = useFetchOSConfig()
  // useMetrics has its own enabled logic based on endpoint and database
  const { data: metricsData } = useMetrics()

  // Transform data for charts
  const transformedChartData = useMemo(() => {
    return chartConfigs.map((config) => ({
      ...config,
      data: (metricsData?.metrics || []).map((item) => ({
        ...item
      }))
    }))
  }, [metricsData?.metrics])

  // Check if we have data
  const sessionsExists = metricsData && metricsData?.metrics?.length > 0
  const hasNoDatabases = Boolean(
    osConfig && selectedDatabase && !selectedDatabase?.metrics?.db
  )

  const { view } = usePageViewOptions({
    additionalChecks: () => {
      if (hasNoDatabases) return PageViewState.NO_DATABASES
      return PageViewState.CONTENT
    }
  })
  return (
    <>
      <Helmet>
        <title>Metrics | Agno</title>
      </Helmet>
      <PageWrapper
        customWidth={MAX_PAGE_WRAPPER_WIDTHS}
        className="overflow-y-auto overflow-x-hidden"
      >
        {view === PageViewState.LOADING && (
          <div>
            <Header sessionsExists={!!sessionsExists} />
            <div>
              <div className="grid-responsive-charts mx-6 mb-8 gap-6">
                {chartConfigs.map(() => (
                  <Card className="relative h-[20.25rem] min-w-[27rem] max-w-[51rem] hover:bg-secondary/50">
                    <LoadingChart />
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
        {(view === PageViewState.DISCONNECTED ||
          view === PageViewState.INACTIVE ||
          view === PageViewState.AUTH_FAILED ||
          view === PageViewState.MISSING_SECURITY_KEY) && (
          <>
            <MetricsTeaserPage />
            <OsBlankState status={view} />
          </>
        )}

        {view === PageViewState.NO_DATABASES && (
          <div>
            <Header sessionsExists={!!sessionsExists} />

            <div className="mx-auto mt-28 h-[340px] w-[600px]">
              <BlankState
                visual="eval-blank-state-icon"
                title="No databases found"
                description="Please add a database to view metrics"
              />
            </div>
          </div>
        )}

        {view === PageViewState.CONTENT && (
          <div>
            <Header sessionsExists={!!sessionsExists} />
            <MetricsChartsGrid
              sessionsExists={!!sessionsExists}
              start={start}
              end={end}
              metricsData={metricsData}
              transformedChartData={transformedChartData}
            />
          </div>
        )}
      </PageWrapper>
    </>
  )
}

export default MetricsPage
