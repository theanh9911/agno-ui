import { PlaygroundAgentExtraData, PlaygroundMessage } from '@/types/playground'
import dayjs, { type Dayjs } from 'dayjs'
import type {
  AgentExtraData,
  Metrics,
  RunResponseContent,
  ToolCall
} from '@/types/Agent'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export type DateFormatType =
  | 'natural'
  | 'date-first-natural'
  | 'date-short-year'
  | 'natural-with-time'
  | 'short'
  | 'day'
  | 'chart'
  | 'time'
  | 'natural-with-time-wo-meridiem'
  | 'date-with-time'
  | 'time-for-chat'
  | 'date-with-24h-time'

export type DateInput = string | Date | Dayjs | number

const FORMAT_MAP: Record<DateFormatType, string> = {
  natural: 'MMM D, YYYY',
  'natural-with-time': 'MMM D, YYYY, h:mma',
  'date-with-time': 'MMM D, h:mm',
  'natural-with-time-wo-meridiem': 'MMM D, YYYY, h:mm',
  short: 'M/D',
  day: 'D',
  chart: 'D MMM YYYY',
  time: 'h:mma',
  'time-for-chat': 'h:mm:ss',
  'date-first-natural': 'D MMM YYYY',
  'date-short-year': "D MMM 'YY",
  'date-with-24h-time': 'D MMM YYYY, HH:mm'
} as const

export const formatDate = (
  date: DateInput,
  type: DateFormatType = 'natural'
): string => {
  const format = FORMAT_MAP[type]

  if (typeof date === 'number') {
    return dayjs.unix(date).utc().format(format)
  }
  if (type === 'chart') {
    return dayjs(date).format(format)
  }
  return dayjs(date).utc().format(format)
}

export const formatSeconds = (seconds: number, showUnit = true) => {
  return showUnit ? `${seconds.toFixed(2)} SEC` : seconds.toFixed(2)
}

export const formatLargeNumber = (num: number): string => {
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(1).replace(/\.0$/, '')}B`
  }
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1).replace(/\.0$/, '')}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}K`
  }
  return num.toString()
}

const formatTime = (time?: number) => {
  if (!time) {
    return ''
  }

  const adjustedTime = Math.max(parseFloat(String(time)), 0.01)
  return `${adjustedTime.toFixed(2)} SEC`
}
/**
 * Extract and format reasoning time to 2 decimal places
 */
export const getFormattedReasoningTime = (
  extraData?: PlaygroundAgentExtraData | AgentExtraData,
  reasoningMessages?: PlaygroundMessage['reasoning_messages']
): string => {
  if (extraData?.reasoning_metrics?.duration) {
    return formatTime(extraData.reasoning_metrics.duration)
  }

  const messages = reasoningMessages
  if (!messages || messages.length === 0) {
    return ''
  }

  const lastMessage = messages[messages.length - 1]
  const timeValue = lastMessage?.metrics?.duration
  return formatTime(timeValue)
}

/**
 * Legacy version for backward compatibility - extracts extra_data from message
 */
export const getFormattedReasoningTimeFromMessage = (
  message: PlaygroundMessage | RunResponseContent
): string => {
  const extraData = message?.extra_data
  const reasoningMessages =
    'reasoning_messages' in message ? message.reasoning_messages : undefined

  return getFormattedReasoningTime(
    extraData as PlaygroundAgentExtraData,
    reasoningMessages
  )
}

export const formatSmallerTime = (
  timeInSeconds: number
): { value: string; unit: string; originalValue: string } => {
  const originalValue = `${parseFloat(timeInSeconds.toFixed(20)).toString()}s`

  if (timeInSeconds === 0) {
    return { value: '0.000', unit: 's', originalValue }
  }

  if (timeInSeconds >= 1) {
    // seconds
    return {
      value: parseFloat(timeInSeconds.toFixed(3)).toString(),
      unit: 's',
      originalValue
    }
  } else {
    // milliseconds
    return {
      value: parseFloat((timeInSeconds * 1e3).toFixed(7)).toString(),
      unit: 'ms',
      originalValue
    }
  }
}

export const formatTimeInSeconds = (
  timeInSeconds: number
): { value: string; unit: string } => {
  if (timeInSeconds === 0) {
    return { value: '0', unit: 's' }
  }

  if (timeInSeconds >= 1) {
    return { value: timeInSeconds.toFixed(0), unit: 's' }
  }

  return { value: timeInSeconds.toFixed(2), unit: 's' }
}

export const formatNumberToInternationalFormat = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num)
}

export const formatMetricKeys = (
  data: Metrics,
  keys: (keyof Metrics)[]
): string => {
  return keys
    .map((key) => {
      const label = key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase())

      let value = data?.[key]

      if (value === undefined || value === null) {
        return null
      }

      if (
        [
          'input_tokens',
          'output_tokens',
          'total_tokens' as keyof Metrics
        ].includes(key)
      ) {
        value = formatNumberToInternationalFormat(Number(value))
      }

      if (key === 'time' && typeof value === 'number') {
        value = `${value.toFixed(2)} seconds`
      }

      if (key === 'time_to_first_token' && typeof value === 'number') {
        value = value.toFixed(3) + ' s'
      }

      if (key === 'duration' && typeof value === 'number') {
        const smaller = formatSmallerTime(value)
        value = `${smaller.value} ${smaller.unit}`
      }

      if (!value) return null

      return `${label}: ${value}`
    })
    .filter(Boolean)
    .join('\n')
}

export const getFormattedToolCalls = (data: ToolCall): string => {
  const result: string[] = []
  if (data.id) {
    result.push(`ID: ${data.id}`)
  }
  if (data?.function?.name) {
    result.push(`Function Name: ${data.function.name}`)
  }
  if (data?.function?.arguments) {
    result.push(`Arguments: ${data.function.arguments}`)
  }
  return result.filter(Boolean).join('\n')
}

/**
 * Properly encode email addresses for URL parameters
 * Handles the + sign issue where browsers treat + as spaces in query strings
 */
export const encodeEmailForURL = (email: string): string => {
  return encodeURIComponent(email).replace(/\+/g, '%2B')
}
