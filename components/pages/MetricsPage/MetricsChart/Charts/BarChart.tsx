import { type FC, useState, memo } from 'react'
import {
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Bar,
  BarChart,
  Cell
} from 'recharts'
import type { ChartProps } from './types'
import ChartTooltipContent from './ChartTooltipContent'
import { useYAxisWidth } from '@/components/pages/MetricsPage/hooks/useYAxisWidth'
import { xTickFormatter, yTickFormatter } from '../../utils'
import { useTheme } from 'next-themes'
import Image from '@/components/ui/Image'

interface BarChartData {
  name: string
  [key: string]: string | number
}
const CustomBarChart: FC<ChartProps> = ({
  data,
  cols,
  tooltipLabelFormatter,
  className
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [isAnyHovered, setIsAnyHovered] = useState(false)
  const { containerRef, yAxisWidth } = useYAxisWidth(data)
  const { resolvedTheme } = useTheme()
  const imageSrc =
    resolvedTheme === 'dark'
      ? '/images/chartbg_darkmode.svg'
      : '/images/chartbg_lightmode.svg'
  const handleMouseEnter = (data: BarChartData, index: number) => {
    setActiveIndex(index)
    setIsAnyHovered(true)
  }
  const handleMouseLeave = () => {
    setActiveIndex(null)
    setIsAnyHovered(false)
  }
  return (
    <div className={`${className} relative h-full max-h-[275px] w-full`}>
      <div className="absolute inset-0 z-0">
        <Image
          src={imageSrc}
          alt="chart-bg"
          className="h-full w-full object-cover"
          width={0}
          height={0}
        />
      </div>
      <ResponsiveContainer width="100%" height="100%" ref={containerRef}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
          onMouseLeave={handleMouseLeave}
        >
          <XAxis
            interval={6}
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            padding={{ left: 10 }}
            tickMargin={10}
            tickFormatter={xTickFormatter}
            className="text-xs font-medium"
            stroke={'rgb(var(--color-muted),0.5)'}
          />
          <YAxis
            domain={['auto', (dataMax: number) => dataMax + 1]}
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            width={yAxisWidth}
            stroke={'rgb(var(--color-muted),0.5)'}
            className="yAxis text-xs font-medium"
            tickFormatter={yTickFormatter}
            orientation="left"
            tick={{ dx: 0 }}
            tickMargin={4}
          />
          <Tooltip
            content={
              <ChartTooltipContent labelFormatter={tooltipLabelFormatter} />
            }
            contentStyle={{
              backgroundColor: 'transparent',
              borderColor: 'transparent',
              padding: 0
            }}
            separator=""
            cursor={false}
          />
          {cols.map((col) => (
            <Bar
              key={col}
              dataKey={col}
              onMouseEnter={handleMouseEnter}
              animationDuration={300}
              minPointSize={1}
            >
              {data?.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    !isAnyHovered
                      ? 'rgb(var(--color-primary))'
                      : index === activeIndex
                        ? 'rgb(var(--color-brand-brand))'
                        : 'rgb(var(--color-brand-brand),0.5)'
                  }
                />
              ))}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
export default memo(CustomBarChart)
