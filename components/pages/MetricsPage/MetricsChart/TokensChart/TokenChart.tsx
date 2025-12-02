import { useCallback, useMemo, useState, type FC, memo } from 'react'
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

import { formatLargeNumber, formatDate } from '@/utils/format'
import ChartsHeader from '../ChartsHeader/ChartsHeader'
import {
  exportChartData,
  fillMissingDates,
  prepareTokenChartExportData,
  yTickFormatter
} from '../../utils'
import { useYAxisWidth } from '@/components/pages/MetricsPage/hooks/useYAxisWidth'
import ChartTooltipContent, {
  type TooltipPayloadEntry
} from '../Charts/ChartTooltipContent'
import { useTheme } from 'next-themes'
import Image from '@/components/ui/Image'
import { Metrics } from '@/types/metrics'
import NoDataChart from '../../BlankStates/NoDataChart'

interface TokenChartProps {
  start: Date
  end: Date
  data: Metrics[]
}
interface BarChartData {
  name: string
  [key: string]: string | number
}
const chartCols = [
  {
    dataKey: 'output',
    name: 'Output',
    fillNormal: 'rgb(var(--color-primary))',
    fillHovered: 'rgb(var(--color-brand-brand))'
  },
  {
    dataKey: 'input',
    name: 'Input',
    fillNormal: 'rgb(var(--color-primary), 0.5)',
    fillHovered: 'rgb(var(--color-brand-brand),0.5)'
  },
  {
    dataKey: 'total',
    name: 'Total',
    fillNormal: 'rgb(var(--color-primary), 0.2)',
    fillHovered: 'rgb(var(--color-brand-brand),0.2)'
  }
]
const TokenChart: FC<TokenChartProps> = ({ start, end, data }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  const chartData = useMemo(() => data ?? [], [data])
  const filledData = useMemo(() => {
    const metrics = {
      res: chartData?.map((item) => ({
        date: item.date,
        total_tokens: item.token_metrics?.total_tokens ?? 0,
        input_tokens: item.token_metrics?.input_tokens ?? 0,
        output_tokens: item.token_metrics?.output_tokens ?? 0,
        label: 'Tokens'
      }))
    }
    return fillMissingDates(
      metrics?.res as unknown as Metrics[],
      'Tokens',
      start.toISOString(),
      end.toISOString()
    )
  }, [chartData, start, end])

  const formattedChartData = useMemo(() => {
    return filledData?.map((item) => {
      const matchingOriginalItem = chartData.find(
        (originalItem) =>
          new Date(originalItem?.date).toDateString() ===
          item?.date.toDate().toDateString()
      )
      return {
        name: formatDate(item?.date, 'chart'),
        total: matchingOriginalItem?.token_metrics?.total_tokens ?? 0,
        input: matchingOriginalItem?.token_metrics?.input_tokens ?? 0,
        output: matchingOriginalItem?.token_metrics?.output_tokens ?? 0
      }
    })
  }, [filledData, chartData])
  const total = useMemo(
    () => formattedChartData?.reduce((sum, item) => sum + item.total, 0),
    [formattedChartData]
  )
  const formattedTotal = useMemo(() => {
    return formatLargeNumber(total)
  }, [total])
  const xTickFormatter = useCallback((tick: number | string): string => {
    if (typeof tick === 'number') {
      return tick % 7 === 0 ? (tick + 1).toString() : tick.toString()
    }
    const parts = tick.split(' ')
    return parts[0] || ''
  }, [])
  const handleExport = useCallback(
    (type: 'csv' | 'json') => {
      const exportPreparationResult = prepareTokenChartExportData(
        data,
        filledData
      )
      if (!exportPreparationResult) return
      const { jsonData, csvData, fileName } = exportPreparationResult
      exportChartData(type, fileName, type === 'json' ? jsonData : csvData)
    },
    [data, filledData]
  )
  const { containerRef, yAxisWidth } = useYAxisWidth(formattedChartData)
  const { resolvedTheme } = useTheme()
  const imageSrc =
    resolvedTheme === 'dark'
      ? '/images/chartbg_darkmode.svg'
      : '/images/chartbg_lightmode.svg'
  const handleMouseEnter = (data: BarChartData, index: number) => {
    setActiveIndex(index)
    setIsHovered(true)
  }
  const handleMouseLeave = () => {
    setActiveIndex(null)
    setIsHovered(false)
  }
  const sortTokenChartPayload = (payload: TooltipPayloadEntry[]) => {
    const firstEntry = payload[0]
    const entryPayload = firstEntry?.payload as
      | { input?: number; output?: number }
      | undefined
    const hasZeroTokens =
      entryPayload && entryPayload?.input === 0 && entryPayload?.output === 0
    if (hasZeroTokens) {
      return payload.filter((entry) => entry?.dataKey === 'total')
    }
    return payload.sort((a, b) => {
      if (a?.dataKey === 'total') return -1
      if (b?.dataKey === 'total') return 1
      if (a?.dataKey === 'input') return -1
      if (b?.dataKey === 'input') return 1
      return 0
    })
  }
  const getTokenIndicatorColor = (entry: TooltipPayloadEntry) => {
    const payload = entry?.payload as
      | { input?: number; output?: number }
      | undefined
    const hasZeroTokens =
      payload && payload?.input === 0 && payload?.output === 0
    if (hasZeroTokens) {
      if (entry?.dataKey === 'total') return 'rgb(var(--color-brand-brand))'
      if (entry?.dataKey === 'input' || entry?.dataKey === 'output')
        return 'transparent'
    }
    if (entry?.dataKey === 'total') return 'rgb(var(--color-brand-brand), 0.2)'
    if (entry?.dataKey === 'input') return 'rgb(var(--color-brand-brand), 0.5)'
    return 'rgb(var(--color-brand-brand))'
  }

  if (formattedTotal === '0') {
    return <NoDataChart title="token_metrics" />
  }
  return (
    <div className="relative flex h-full flex-shrink-0 flex-col space-y-4">
      <ChartsHeader
        title="Total tokens"
        total={formattedTotal}
        onExport={handleExport}
      />
      <div className="absolute inset-0 z-0">
        <Image
          src={imageSrc}
          alt="chart-bg"
          className="h-full w-full object-cover"
          width={0}
          height={0}
        />
      </div>
      <ResponsiveContainer
        width="100%"
        height="100%"
        maxHeight={252}
        className="relative z-10"
        ref={containerRef}
      >
        <BarChart
          data={formattedChartData}
          margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
          onMouseLeave={handleMouseLeave}
        >
          <XAxis
            dataKey="name"
            interval={6}
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            padding={{ left: 10 }}
            tickMargin={10}
            tickFormatter={xTickFormatter}
            className="text-xs font-medium"
            stroke="rgb(var(--color-muted),0.5)"
            xAxisId={0}
          />
          {/* since this is overlaid chart, we need to hide the x axis for the other bars */}
          <XAxis
            dataKey="name"
            interval={6}
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            padding={{ left: 10 }}
            tickMargin={10}
            tickFormatter={xTickFormatter}
            className="text-xs font-medium"
            xAxisId={1}
            hide
          />
          <XAxis
            dataKey="name"
            interval={6}
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            padding={{ left: 10 }}
            tickMargin={10}
            tickFormatter={xTickFormatter}
            className="text-xs font-medium"
            xAxisId={2}
            hide
          />
          <YAxis
            domain={['auto', (dataMax: number) => dataMax + 1]}
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            width={yAxisWidth}
            stroke="rgb(var(--color-muted),0.5)"
            className="text-xs font-medium"
            tickFormatter={yTickFormatter}
            orientation="left"
          />
          <Tooltip
            content={
              <ChartTooltipContent
                sortPayloadEntries={sortTokenChartPayload}
                getIndicatorColor={getTokenIndicatorColor}
              />
            }
            contentStyle={{
              backgroundColor: 'transparent',
              borderColor: 'transparent',
              padding: 0
            }}
            separator=""
            cursor={false}
          />
          {chartCols?.map(
            ({ dataKey, name, fillNormal, fillHovered }, index) => (
              <Bar
                key={dataKey}
                dataKey={dataKey}
                name={name}
                onMouseEnter={handleMouseEnter}
                animationDuration={300}
                minPointSize={1}
                xAxisId={index}
              >
                {formattedChartData?.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      dataKey === 'total' &&
                      entry.input === 0 &&
                      entry.output === 0
                        ? isHovered
                          ? 'rgb(var(--color-brand-brand))'
                          : 'rgb(var(--color-primary))'
                        : !isHovered
                          ? fillNormal
                          : fillHovered
                    }
                    opacity={!isHovered ? 1 : index === activeIndex ? 1 : 0.2}
                  />
                ))}
              </Bar>
            )
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
export default memo(TokenChart)
