import { type FC, useState, memo } from 'react'
import {
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Line,
  LineChart,
  DotProps
} from 'recharts'
import type { ChartProps } from './types'
import ChartTooltipContent from './ChartTooltipContent'
import { useYAxisWidth } from '@/components/pages/MetricsPage/hooks/useYAxisWidth'
import { xTickFormatter, yTickFormatter } from '../../utils'
import { useTheme } from 'next-themes'
import Image from '@/components/ui/Image'
import { useOSStore } from '@/stores/OSStore'
import { useFetchOSStatus } from '@/hooks/os/useFetchOSStatus'

const CustomizedDot: FC<DotProps> = (props) => {
  const { cx, cy } = props
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      x={cx ? cx - 6 : 0}
      y={cy ? cy - 7 : 0}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="0.84314"
        y="6.7843"
        width="8"
        height="8"
        rx="2"
        transform="rotate(-45 0.84314 6.7843)"
        fill="rgb(var(--color-brand-brand))"
      />
      <rect
        x="0.136033"
        y="6.7843"
        width="9"
        height="9"
        rx="2.5"
        transform="rotate(-45 0.136033 6.7843)"
        stroke="rgb(var(--color-brand-brand))"
        strokeOpacity="0.5"
      />
    </svg>
  )
}

const CustomCursor = (props: { points?: Array<{ x: number; y: number }> }) => {
  const { points } = props
  if (!points || points.length === 0) return null
  return (
    <svg
      x={points[0]?.x - 1.5}
      y={0}
      width="3"
      height="232"
      viewBox="0 0 3 232"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="cursorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop
            offset="0%"
            stopColor="rgb(var(--color-primary))"
            stopOpacity="0"
          />
          <stop
            offset="10%"
            stopColor="rgb(var(--color-primary))"
            stopOpacity="0.2"
          />
          <stop
            offset="50%"
            stopColor="rgb(var(--color-primary))"
            stopOpacity="1"
          />
          <stop
            offset="90%"
            stopColor="rgb(var(--color-primary))"
            stopOpacity="0.2"
          />
          <stop
            offset="100%"
            stopColor="rgb(var(--color-primary))"
            stopOpacity="0"
          />
        </linearGradient>
      </defs>
      <rect x="0.5" width="2" height="232" fill="url(#cursorGradient)" />
    </svg>
  )
}

const Chart: FC<ChartProps> = ({
  data,
  cols,
  tooltipLabelFormatter,
  className
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const { resolvedTheme } = useTheme()
  const imageSrc =
    resolvedTheme === 'dark'
      ? '/images/chartbg_darkmode.svg'
      : '/images/chartbg_lightmode.svg'
  const { currentOS } = useOSStore()
  const { data: isOsAvailable } = useFetchOSStatus()
  // Use the hook
  const { containerRef, yAxisWidth } = useYAxisWidth(data)
  // Custom X-axis tick formatter for timestamps
  const shouldDisableAnimation = currentOS === null || isOsAvailable === false

  const renderCustomIndicator = () => (
    <div className="flex h-3 w-7 items-center justify-center rounded-sm bg-secondary/50 py-1">
      <div
        className="h-1 w-4 rounded-sm"
        style={{
          backgroundColor: 'rgb(var(--color-brand-brand))'
        }}
      />
    </div>
  )

  const formatCustomEntryName = (name: string) => {
    if (name === 'team_runs_count') return 'Team Runs'
    if (name === 'team_sessions_count') return 'Team Sessions'
    if (name === 'agent_runs_count') return 'Agent Runs'
    if (name === 'agent_sessions_count') return 'Agent Sessions'
    if (name === 'workflow_runs_count') return 'Workflow Runs'
    if (name === 'workflow_sessions_count') return 'Workflow Sessions'
    return name
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
        <LineChart
          data={data}
          margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseMove={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
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
            domain={['auto', (dataMax: number) => Math.max(dataMax + 1, 5)]}
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
              <ChartTooltipContent
                labelFormatter={tooltipLabelFormatter}
                renderIndicator={renderCustomIndicator}
                formatEntryName={formatCustomEntryName}
              />
            }
            contentStyle={{
              backgroundColor: 'transparent',
              borderColor: 'transparent',
              padding: 0
            }}
            separator=""
            cursor={<CustomCursor />}
          />
          {cols?.map((col) => (
            <Line
              key={col}
              type="linear"
              dataKey={col}
              dot={false}
              onMouseEnter={() => setIsHovered(true)}
              stroke={
                isHovered
                  ? 'rgb(var(--color-brand-brand))'
                  : 'rgb(var(--color-primary))'
              }
              strokeWidth={1.5}
              activeDot={(props: DotProps) => <CustomizedDot {...props} />}
              animationDuration={shouldDisableAnimation ? 0 : 300}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default memo(Chart)
