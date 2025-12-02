import React from 'react'
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts'
import { useOSStore } from '@/stores/OSStore'
import { useFetchOSStatus } from '@/hooks/os/useFetchOSStatus'

interface ChartEntry {
  name: string
  value: number
  model_provider: string
  opacity?: string
}

interface RadialChartDisplayProps {
  chartData: ChartEntry[]
  hoveredModelName: string | null
  formattedTotal: string
  setHoveredModelName: (name: string | null) => void
}

// Renders the radial bar chart for model runs.
const RadialChartDisplay: React.FC<RadialChartDisplayProps> = ({
  chartData,
  hoveredModelName,
  formattedTotal,
  setHoveredModelName
}) => {
  const { currentOS } = useOSStore()
  const { data: isOsAvailable } = useFetchOSStatus()
  const shouldDisableAnimation = currentOS === null || isOsAvailable === false
  return (
    <RadialBarChart
      data={chartData}
      startAngle={-10}
      endAngle={190}
      innerRadius={90}
      outerRadius={130}
      width={250}
      height={250}
      barSize={8}
    >
      <PolarRadiusAxis
        tick={false}
        radius={16}
        tickLine={false}
        axisLine={false}
      >
        <Label
          content={({ viewBox }) => {
            if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
              return (
                <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                  <tspan
                    x={viewBox.cx}
                    y={(viewBox.cy || 0) - 30}
                    className="fill-muted text-xs"
                  >
                    MODEL RUNS
                  </tspan>
                  <tspan
                    x={viewBox.cx}
                    y={viewBox.cy || 0}
                    className="fill-primary text-sm"
                  >
                    {formattedTotal}
                  </tspan>
                </text>
              )
            }
            return null
          }}
        />
      </PolarRadiusAxis>
      {chartData?.map((entry, index) => {
        const isHovered = hoveredModelName === entry.name
        const fillColorClass = isHovered ? 'fill-brand' : 'fill-primary'
        const barOpacity = parseFloat(entry?.opacity ?? '0') / 100

        return (
          <RadialBar
            key={index}
            dataKey="value"
            data={[entry]}
            stackId="a"
            cornerRadius={10}
            className={`${fillColorClass} stroke-transparent stroke-2`}
            fillOpacity={barOpacity}
            onMouseEnter={() => setHoveredModelName(entry.name)}
            onMouseLeave={() => setHoveredModelName(null)}
            animationDuration={shouldDisableAnimation ? 0 : 300}
          />
        )
      })}
    </RadialBarChart>
  )
}

export default RadialChartDisplay
