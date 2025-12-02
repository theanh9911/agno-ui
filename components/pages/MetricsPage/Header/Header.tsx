import { useCallback, useMemo } from 'react'
import { HeaderWrapper } from '@/components/layouts/Header'
import { MonthPicker } from '../MetricsControls'
import ExportDropdown from '../MetricsControls/ExportDropdown'
import DatabaseSelector from '@/components/common/DatabaseSelector'
import { useDateFilters } from '../hooks/useDateFilters'
import { useMetrics } from '@/hooks/metrics/useMetricQuery'
import {
  exportAllChartsData,
  extractModelMetrics,
  fillMissingDates
} from '../utils'
import { chartConfigs } from '../constant'
import { useFetchOSConfig } from '@/hooks/os'

interface HeaderProps {
  sessionsExists: boolean
}

const Header = ({ sessionsExists }: HeaderProps) => {
  const { start, end } = useDateFilters()
  const { data: metricsData } = useMetrics()
  const { data: osConfig } = useFetchOSConfig()
  const showDatabaseSelector = Boolean(
    osConfig && osConfig.metrics?.dbs.length > 0
  )

  const allChartsExportData = useMemo(() => {
    if (!metricsData?.metrics?.length) return []

    return chartConfigs.map(({ chartType }) => {
      const filledData = fillMissingDates(
        metricsData?.metrics || [],
        chartType,
        start.toISOString(),
        end.toISOString()
      )

      return {
        label: chartType,
        data: filledData.map((item) => ({
          date: item.date.toDate(),
          label: item.label,
          value: item.value
        }))
      }
    })
  }, [metricsData?.metrics, start, end])

  const handleExport = useCallback(
    (type: 'csv' | 'json') => {
      if (!metricsData?.metrics?.length) return

      // Extract models data for export using utility function
      const allModelMetrics = extractModelMetrics(metricsData.metrics)

      exportAllChartsData(
        type,
        allChartsExportData,
        metricsData?.metrics || [],
        allModelMetrics
      )
    },
    [allChartsExportData, metricsData?.metrics]
  )

  return (
    <HeaderWrapper
      bottomContent={{
        ...(showDatabaseSelector && {
          leftContent: (
            <div className="flex flex-col">
              <DatabaseSelector />
            </div>
          )
        }),
        rightContent: (
          <div className="flex items-center gap-x-4">
            <ExportDropdown
              onExport={handleExport}
              disabled={!sessionsExists}
            />
            <MonthPicker />
          </div>
        )
      }}
    />
  )
}

export default Header
