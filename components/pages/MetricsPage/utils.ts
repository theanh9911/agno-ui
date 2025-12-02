import { DateRange } from '@/types/globals'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import { formatLargeNumber } from '@/utils/format'
import { Metrics, ModelsRunsMetrics } from '@/types/metrics'

dayjs.extend(utc)

type FilledMetricsDataPoint = {
  date: dayjs.Dayjs
  value: number
  label: string
}

type FilledTokenDataPoint = {
  date: dayjs.Dayjs
  value: number
  label: string
}

type ExportDataOutput = {
  jsonData: unknown
  csvData: Record<string, unknown>[]
  fileName: string
}

// ******************************************Chart utils******************************************

export const xTickFormatter = (tick: number): string =>
  tick % 7 === 0 ? (tick + 1).toString() : tick.toString()

export const yTickFormatter = (value: number): string =>
  formatLargeNumber(value)

export const fillMissingDates = (
  data: Metrics[] | undefined,
  label: string,
  start: string,
  end: string
): FilledMetricsDataPoint[] => {
  let dayInMonth = dayjs(start).utc().hour(0).minute(0).second(0).millisecond(0)
  const endDate = dayjs(end)
    .utc()
    .hour(23)
    .minute(59)
    .second(59)
    .millisecond(999)
  const filledData = []

  while (dayInMonth.isBefore(endDate) || dayInMonth.isSame(endDate)) {
    const dayInMonthRef = dayInMonth.utc()
    const existingDay = data?.find((d) => {
      const dateField = d.date
      if (!dateField) return false

      return (
        dayjs(dateField).utc().format('YYYY-MM-DD') ===
        dayInMonthRef.format('YYYY-MM-DD')
      )
    })

    if (existingDay) {
      const value = Number(existingDay[label as keyof Metrics]) || 0

      filledData.push({
        date: dayInMonthRef,
        label,
        value
      })
    } else {
      filledData.push({ date: dayInMonth.utc(), label, value: 0 })
    }

    dayInMonth = dayInMonth.add(1, 'day').utc()
  }

  return filledData
}

// ******************************************Model Metrics utils******************************************
export const extractModelMetrics = (data: Metrics[]): ModelsRunsMetrics[] => {
  const modelMetricsMap = new Map<string, ModelsRunsMetrics>()

  data.forEach((item) => {
    if (item?.model_metrics && Array.isArray(item.model_metrics)) {
      item.model_metrics.forEach((metric) => {
        if (metric?.model_id && metric?.count > 0) {
          const key = `${metric.model_provider || 'unknown'}_${metric.model_id}`

          if (modelMetricsMap.has(key)) {
            const existing = modelMetricsMap.get(key)!
            existing.count += metric.count
          } else {
            modelMetricsMap.set(key, {
              model_id: metric.model_id,
              model_provider: metric.model_provider,
              count: metric.count
            })
          }
        }
      })
    }
  })

  return Array.from(modelMetricsMap.values())
}

// ******************************************Export utils******************************************
export const prepareModelsRunsExportData = (
  data: ModelsRunsMetrics[] | undefined
): ExportDataOutput | null => {
  if (!data?.length) return null

  const totalRuns = data.reduce((sum, model) => sum + model.count, 0)
  const fileName = 'model_runs_data'
  const jsonData = {
    totalRuns,
    models: data.map((model) => ({
      name: model.model_id,
      provider: model.model_provider,
      runs: model.count,
      percentage: totalRuns > 0 ? (model.count / totalRuns) * 100 : 0
    }))
  }

  const csvData = data.map((model) => ({
    Model: model.model_id,
    Provider: model.model_provider,
    Runs: model.count,
    Percentage:
      totalRuns > 0
        ? `${((model.count / totalRuns) * 100).toFixed(2)}%`
        : '0.00%'
  }))

  return { jsonData, csvData, fileName }
}

export const prepareTokenChartExportData = (
  metricsData: Metrics[] | undefined,
  filledData: FilledTokenDataPoint[]
): ExportDataOutput | null => {
  if (!metricsData?.length || !filledData.length) return null

  const totalTokens = metricsData.reduce(
    (sum, item) => sum + (item.token_metrics?.total_tokens ?? 0),
    0
  )

  const fileName = 'token_usage_data'
  const jsonData = {
    totalTokens,
    tokenUsage: filledData.map((filledItem: FilledTokenDataPoint) => {
      const originalItem = metricsData.find(
        (orig: Metrics) =>
          dayjs(orig.date).utc().format('YYYY-MM-DD') ===
          filledItem.date.format('YYYY-MM-DD')
      )
      return {
        date: filledItem.date.format('YYYY-MM-DD'),
        inputTokens: originalItem?.token_metrics?.input_tokens ?? 0,
        outputTokens: originalItem?.token_metrics?.output_tokens ?? 0,
        totalTokens: originalItem?.token_metrics?.total_tokens ?? 0
      }
    })
  }

  const csvData = filledData.map((filledItem: FilledTokenDataPoint) => {
    const originalItem = metricsData.find(
      (orig: Metrics) =>
        dayjs(orig.date).utc().format('YYYY-MM-DD') ===
        filledItem.date.format('YYYY-MM-DD')
    )
    return {
      Date: filledItem.date.format('YYYY-MM-DD'),
      'Input Tokens': originalItem?.token_metrics?.input_tokens ?? 0,
      'Output Tokens': originalItem?.token_metrics?.output_tokens ?? 0,
      'Total Tokens': originalItem?.token_metrics?.total_tokens ?? 0
    }
  })

  return { jsonData, csvData, fileName }
}

export const prepareMetricsChartExportData = (
  filledData: FilledMetricsDataPoint[],
  label: string
): ExportDataOutput | null => {
  if (!filledData.length) return null

  const fileName = `${label?.toLowerCase()}_chart_data`
  const jsonData = filledData?.map((item: FilledMetricsDataPoint) => ({
    date: item.date.format('YYYY-MM-DD'),
    label: item.label,
    value: item.value
  }))

  const csvData = filledData.map((item: FilledMetricsDataPoint) => ({
    Date: item.date.format('YYYY-MM-DD'),
    Label: item.label,
    Value: item.value
  }))
  return { jsonData, csvData, fileName }
}

export const downloadJsonFile = (data: unknown, fileName: string) => {
  const jsonString = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${fileName.toLowerCase()}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url) // Clean up
}

type AllChartsDataItem = {
  label: string
  data: Array<{
    date: Date
    label: string
    value: number
  }>
}

export const exportAllChartsData = (
  type: 'csv' | 'json',
  allChartsData: AllChartsDataItem[],
  tokensData: Metrics[],
  modelsRunsData?: ModelsRunsMetrics[]
): void => {
  if (type === 'json') {
    const combinedData = {
      metrics_charts: {} as Record<string, unknown[]>,
      tokens_usage: [] as unknown[],
      models_runs: [] as unknown[]
    }

    // Add metrics charts data
    allChartsData.forEach(({ label, data }) => {
      combinedData.metrics_charts[label] = data.map((item) => ({
        date: item.date.toISOString().split('T')[0],
        label: item.label,
        value: item.value
      }))
    })

    // Add tokens data
    if (tokensData?.length) {
      combinedData.tokens_usage = tokensData.map((item) => {
        const date = item.date instanceof Date ? item.date : new Date(item.date)
        return {
          date: date.toISOString().split('T')[0],
          input_tokens: item.token_metrics?.input_tokens ?? 0,
          output_tokens: item.token_metrics?.output_tokens ?? 0,
          total_tokens: item.token_metrics?.total_tokens ?? 0
        }
      })
    }

    // Add models runs data
    if (modelsRunsData?.length) {
      const totalRuns = modelsRunsData.reduce(
        (sum, model) => sum + model.count,
        0
      )
      combinedData.models_runs = modelsRunsData.map((item) => ({
        model_id: item.model_id,
        provider: item.model_provider,
        runs: item.count,
        percentage: totalRuns > 0 ? (item.count / totalRuns) * 100 : 0
      }))
    }

    downloadJsonFile(combinedData, 'complete_metrics_data')
  } else if (type === 'csv') {
    const allCsvData: Array<Record<string, string | number>> = []

    // Add section header for metrics charts
    if (allChartsData.length > 0) {
      allCsvData.push({
        Section: '=== METRICS CHARTS ===',
        Chart: '',
        Date: '',
        Value: '',
        Label: '',
        'Additional Info': ''
      })

      allChartsData.forEach(({ label: chartLabel, data }) => {
        data.forEach((item) => {
          allCsvData.push({
            Section: 'Metrics',
            Chart: chartLabel,
            Date: item.date.toISOString().split('T')[0],
            Value: item.value,
            Label: item.label,
            'Additional Info': ''
          })
        })
      })

      // Add empty row for separation
      allCsvData.push({
        Section: '',
        Chart: '',
        Date: '',
        Value: '',
        Label: '',
        'Additional Info': ''
      })
    }

    // Add section header for tokens data
    if (tokensData?.length) {
      allCsvData.push({
        Section: '=== TOKENS USAGE ===',
        Chart: '',
        Date: '',
        Value: '',
        Label: '',
        'Additional Info': ''
      })

      tokensData.forEach((item) => {
        const date = item.date instanceof Date ? item.date : new Date(item.date)
        allCsvData.push({
          Section: 'Tokens',
          Chart: 'Token Usage',
          Date: date.toISOString().split('T')[0],
          Value: item.token_metrics?.total_tokens ?? 0,
          Label: 'Total Tokens',
          'Additional Info': `Input: ${item.token_metrics?.input_tokens ?? 0}, Output: ${item.token_metrics?.output_tokens ?? 0}`
        })
      })

      // Add empty row for separation
      allCsvData.push({
        Section: '',
        Chart: '',
        Date: '',
        Value: '',
        Label: '',
        'Additional Info': ''
      })
    }

    // Add section header for models runs data
    if (modelsRunsData?.length) {
      allCsvData.push({
        Section: '=== MODELS RUNS ===',
        Chart: '',
        Date: '',
        Value: '',
        Label: '',
        'Additional Info': ''
      })

      const totalRuns = modelsRunsData.reduce(
        (sum, model) => sum + model.count,
        0
      )
      modelsRunsData.forEach((item) => {
        allCsvData.push({
          Section: 'Models',
          Chart: 'Model Runs',
          Date: '',
          Value: item.count,
          Label: item.model_id,
          'Additional Info': `Provider: ${item.model_provider}, Percentage: ${
            totalRuns > 0
              ? `${((item.count / totalRuns) * 100).toFixed(2)}%`
              : '0.00%'
          }`
        })
      })
    }

    if (allCsvData.length > 0) {
      downloadCsvFile(allCsvData, 'complete_metrics_data')
    }
  }
}

export const downloadCsvFile = (
  data: Record<string, unknown>[],
  fileName: string
) => {
  if (!data || data.length === 0) {
    return
  }

  const convertToCSV = (objArray: Record<string, unknown>[]) => {
    let str = ''

    if (!objArray || objArray.length === 0) return ''

    const header = Object.keys(objArray[0])
    str += header.join(',') + '\r\n'

    for (let i = 0; i < objArray.length; i++) {
      let line = ''
      for (const key of header) {
        if (line !== '') line += ','
        let value = objArray[i][key]

        if (value instanceof Date) {
          value = value.toISOString().split('T')[0]
        }

        if (typeof value === 'string') {
          if (
            value.includes(',') ||
            value.includes('\n') ||
            value.includes('\r') ||
            value.includes('"')
          ) {
            value = `"${value.replace(/"/g, '""')}"`
          }
        }
        line += value
      }
      str += line + '\r\n'
    }
    return str
  }

  const csvString = convertToCSV(data)
  if (!csvString) {
    return
  }
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
  const csvURL = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = csvURL
  link.download = `${fileName.toLowerCase()}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(csvURL) // Clean up
}

export const exportChartData = (
  type: 'csv' | 'json',
  fileName: string,
  data: unknown
): void => {
  if (type === 'json') {
    downloadJsonFile(data, fileName)
  } else if (type === 'csv') {
    if (
      !Array.isArray(data) ||
      !data.every(
        (item) =>
          typeof item === 'object' && item !== null && !Array.isArray(item)
      )
    ) {
      return
    }
    downloadCsvFile(data as Record<string, unknown>[], fileName)
  }
}

// ******************************************Date filter utils******************************************

export const getDateRangeFromParams = (
  monthParam: string | null,
  yearParam: string | null
): DateRange => {
  const currentDate = dayjs().utc()

  const month = monthParam ? Number(monthParam) : currentDate.month() + 1
  const year = yearParam ? Number(yearParam) : currentDate.year()

  // Start one day before the month begins
  const start = dayjs()
    .utc()
    .year(year)
    .month(month - 1)
    .startOf('month')

  const end = start.endOf('month')
  return { start, end }
}

// ******************************************MonthPicker utils******************************************

export const isDateInFuture = (
  date: Date,
  currentDate: Date = new Date()
): boolean => {
  return dayjs(date).isAfter(currentDate)
}

export const validateAndAdjustDate = (
  month: string | null,
  year: string | null,
  currentDate: Date = new Date()
): { date: Date; wasAdjusted: boolean } => {
  let date = new Date()
  let wasAdjusted = false

  if (month && year) {
    date = new Date(Number(year), Number(month) - 1)
    const isInFuture = isDateInFuture(date, currentDate)

    if (isInFuture) {
      date = currentDate
      wasAdjusted = true
    }
  }

  return { date, wasAdjusted }
}

export const formatMonthLabel = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'short' })
}

export const formatYearLabel = (date: Date): string => {
  return date.getFullYear().toString()
}

export const isCurrentMonth = (
  date: Date,
  currentDate: Date = new Date()
): boolean => {
  return (
    date.getMonth() === currentDate.getMonth() &&
    date.getFullYear() === currentDate.getFullYear()
  )
}

// ******************************************Math utils******************************************

export const constrainWidth = (
  width: number,
  margin: number = 10,
  maxWidth: number = 60
): number => {
  const calculatedWidth = Math.ceil(width + margin)
  return Math.min(calculatedWidth, maxWidth)
}
