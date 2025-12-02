import React, { useCallback, useMemo, useState, memo } from 'react'
import ChartsHeader from '../ChartsHeader/ChartsHeader'

import {
  exportChartData,
  prepareModelsRunsExportData,
  extractModelMetrics
} from '../../utils'

import ModelList from './ModelList'
import RadialChartDisplay from './RadialChartDisplay'
import NoDataChart from '../../BlankStates/NoDataChart'
import { useTheme } from 'next-themes'
import Image from '@/components/ui/Image'
import { Metrics } from '@/types/metrics'

interface ModelsRunChartProps {
  data: Metrics[]
}

interface ProcessedChartEntry {
  name: string
  model_provider: string
  opacity?: string
  value: number
}

export const ModelsRunChart: React.FC<ModelsRunChartProps> = ({ data }) => {
  const [hoveredModelName, setHoveredModelName] = useState<string | null>(null)

  const processedChartData: ProcessedChartEntry[] = useMemo(() => {
    if (!data?.length) return []

    // Extract model metrics using utility function
    const allModelMetrics = extractModelMetrics(data)

    if (!allModelMetrics.length) return []

    const totalRuns = allModelMetrics.reduce(
      (sum, metric) => sum + metric.count,
      0
    )
    const allModelEntries = allModelMetrics.map((metric) => {
      const percentage =
        totalRuns > 0 ? Math.round((metric.count / totalRuns) * 10000) / 100 : 0
      return {
        name: metric.model_id,
        model_provider: metric.model_provider,
        value: percentage
      }
    })
    allModelEntries.sort((a, b) => b.value - a.value)

    let finalEntries
    if (allModelEntries?.length > 5) {
      const top5Entries = allModelEntries?.slice(0, 5)
      const otherEntries = allModelEntries?.slice(5)
      const othersPercentage = otherEntries?.reduce(
        (sum, entry) => sum + entry.value,
        0
      )
      const othersData = {
        name: 'Others',
        model_provider: 'Others',
        value: othersPercentage
      }
      finalEntries = [...top5Entries, othersData]
    } else {
      finalEntries = allModelEntries
    }
    return finalEntries?.map((entry, index) => ({
      ...entry,
      opacity: String(Math.max(10, 100 - index * 15))
    }))
  }, [data])

  const formattedTotal = useMemo(() => {
    const allModelMetrics = extractModelMetrics(data)
    const totalRuns = allModelMetrics.reduce(
      (sum, metric) => sum + metric.count,
      0
    )
    return totalRuns.toLocaleString()
  }, [data])

  const { resolvedTheme } = useTheme()
  const imageSrc =
    resolvedTheme === 'dark'
      ? '/images/chartbg_darkmode.svg'
      : '/images/chartbg_lightmode.svg'

  const handleExport = useCallback(
    (type: 'csv' | 'json') => {
      // Extract model metrics using utility function
      const allModelMetrics = extractModelMetrics(data)

      const exportPreparationResult =
        prepareModelsRunsExportData(allModelMetrics)
      if (!exportPreparationResult) return
      const { jsonData, csvData, fileName } = exportPreparationResult
      exportChartData(type, fileName, type === 'json' ? jsonData : csvData)
    },
    [data]
  )

  if (formattedTotal === '0') {
    return <NoDataChart title="model_metrics" />
  }
  return (
    <div className="relative flex h-full flex-shrink-0 flex-col space-y-4">
      <ChartsHeader
        title="Model runs"
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
      <div className="flex h-[300px] w-full flex-col items-center">
        <div
          className="mx-auto mt-[-50px] flex aspect-square h-full w-full flex-col items-center justify-center"
          onMouseLeave={() => setHoveredModelName(null)}
        >
          <RadialChartDisplay
            chartData={processedChartData}
            hoveredModelName={hoveredModelName}
            formattedTotal={formattedTotal}
            setHoveredModelName={setHoveredModelName}
          />
          <ModelList
            chartData={processedChartData}
            hoveredModelName={hoveredModelName}
            setHoveredModelName={setHoveredModelName}
          />
        </div>
      </div>
    </div>
  )
}

export default memo(ModelsRunChart)
