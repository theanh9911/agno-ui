import { useCallback, useMemo, type FC } from 'react'
import { formatDate, formatLargeNumber } from '@/utils/format'

import ChartsHeader from './ChartsHeader/ChartsHeader'

import {
  fillMissingDates,
  prepareMetricsChartExportData,
  exportChartData
} from '../utils'

import { Chart } from './Charts'
import { CustomBarChart } from './Charts'

import { ChartProps } from './Charts/types'
import { DateRange } from '@/types/globals'
import { Metrics } from '@/types/metrics'

import { ChartEnum, labelMap } from '../constant'
import NoDataChart from '../BlankStates/NoDataChart'

interface MetricsChartProps extends DateRange {
  label: string
  format: ChartProps['yTickFormat']
  data: Metrics[]
}

const MetricsChart: FC<MetricsChartProps> = ({
  label,
  format,
  data,
  start,
  end
}) => {
  const dataRes = useMemo(() => data ?? [], [data])

  const filledData = useMemo(() => {
    return fillMissingDates(
      dataRes,
      label,
      start.toISOString(),
      end.toISOString()
    )
  }, [label, dataRes, start, end])

  const total = useMemo(() => {
    return dataRes?.reduce(
      (sum, item) => sum + (Number(item[label as keyof Metrics]) || 0),
      0
    )
  }, [dataRes, label])

  const formattedData = useMemo(() => {
    if (!filledData) return []

    return filledData.map((item) => {
      const matchingOriginalItem = dataRes.find((originalItem) => {
        const originalDateStr = new Date(originalItem?.date).toDateString()
        const itemDateStr = item?.date.toDate().toDateString()
        return originalDateStr === itemDateStr
      })

      return {
        name: formatDate(item?.date, 'chart'),
        [item.label]:
          Number(matchingOriginalItem?.[item.label as keyof Metrics]) || 0
      }
    })
  }, [filledData, dataRes, label])

  const formattedTotal = useMemo(() => {
    if (typeof total === 'number') return formatLargeNumber(total)
    return 'N/A'
  }, [total])

  const createTooltipLabelFormatter = useCallback(
    (data: typeof formattedData) => (index: unknown) => {
      const item = data[index as number]
      return item ? formatDate(item?.name, 'chart') : 'N/A'
    },
    []
  )

  const tooltipLabelFormatter = useMemo(
    () => createTooltipLabelFormatter(formattedData),
    [formattedData, createTooltipLabelFormatter]
  )

  const handleExport = useCallback(
    (type: 'csv' | 'json') => {
      const exportPreparationResult = prepareMetricsChartExportData(
        filledData,
        label
      )
      if (!exportPreparationResult) return

      const { jsonData, csvData, fileName } = exportPreparationResult
      exportChartData(type, fileName, type === 'json' ? jsonData : csvData)
    },
    [filledData, label]
  )

  if (formattedTotal === '0') {
    return <NoDataChart title={label} />
  }

  return (
    <div className="flex h-full flex-shrink-0 flex-col space-y-4">
      <ChartsHeader
        title={labelMap[label as ChartEnum]}
        total={formattedTotal}
        onExport={handleExport}
      />

      {label === 'users_count' ? (
        <CustomBarChart
          cols={[label]}
          data={formattedData}
          yTickFormat={format}
          tooltipLabelFormatter={tooltipLabelFormatter}
        />
      ) : (
        <Chart
          cols={[label]}
          data={formattedData}
          yTickFormat={format}
          tooltipLabelFormatter={tooltipLabelFormatter}
        />
      )}
    </div>
  )
}

export default MetricsChart
