import { Metrics } from '@/types/Agent'
import { formatSeconds } from '@/utils/format'

export const getFormattedTime = (time?: number) => {
  return typeof time === 'number' ? formatSeconds(time) : undefined
}

export const removeFirstParenthesis = (str: string) =>
  str.replace(/^\([^)]*\)\s*/, '')

export const capitalizeFirst = (str: string | string[] = '') => {
  const newStr = Array.isArray(str) ? str.join(' | ') : str
  return newStr?.charAt(0)?.toUpperCase() + newStr?.slice(1)?.toLowerCase()
}

export const extractUserInput = (input: unknown): string => {
  if (typeof input === 'string') {
    return input || '-'
  }

  if (Array.isArray(input)) {
    return input?.find((msg) => msg?.role === 'user')?.content ?? '-'
  }

  return '-'
}

export const filterMetrics = (metrics: Metrics) => {
  if (!metrics) return null

  return {
    input_tokens: metrics.input_tokens,
    output_tokens: metrics.output_tokens,
    total_tokens: metrics.total_tokens,
    ...(typeof metrics?.reasoning_tokens === 'number' &&
      metrics.reasoning_tokens > 0 && {
        reasoning_tokens: metrics.reasoning_tokens
      })
  }
}

export const formatKey = (key: string) => {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
}
