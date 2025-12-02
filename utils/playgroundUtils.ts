import { type ReactNode } from 'react'
import { type QueryClient } from '@tanstack/react-query'
import { type Metrics } from '@/types/Agent'
import { type SessionEntry } from '@/types/playground'
import { type TeamSessions } from '@/types/PlaygroundTeams'
import { formatDate } from './format'
import { MAX_FILES, MAX_FILE_SIZE } from '@/constants'
import { toast } from '@/components/ui/toast'
import { type FileData } from '@/stores/playground'

export type Code = string | object | ReactNode | Metrics

export const parseUrl = (urlString: string): string => {
  let modifiedString = urlString.replace(/:$/, '')
  try {
    if (!/^[a-zA-Z]+:\/\//.test(modifiedString)) {
      modifiedString = `http://${modifiedString}`
    }

    const url = new URL(modifiedString)
    let hostname = url.hostname === '0.0.0.0' ? 'localhost' : url.hostname

    const [hostnameWithoutPath] = hostname.split('/')
    const [hostnameWithoutQuery] = hostnameWithoutPath.split('?')
    hostname = hostnameWithoutQuery
    if (url.port) {
      return `${hostname}:${url.port}${url.pathname}`
    }
    return `${hostname}${url.pathname}`
  } catch {
    return urlString.replace(/:$/, '')
  }
}

export const separateHostnameAndPort = (
  combinedString: string
): { hostname: string; port: string } => {
  const [hostname, port] = combinedString.split(':')
  return { hostname, port: port ?? '' }
}

export const isLocalHost = (hostname: string) => {
  if (
    hostname.startsWith('localhost') ||
    /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(hostname)
  ) {
    return true
  }
  return false
}

export const joinHostnameAndPort = (hostname: string, port: string): string =>
  `${hostname}:${port}`

export const constructEndpointUrl = (
  value: string | null | undefined
): string => {
  if (!value) return ''

  let result: string

  if (value.startsWith('http://') || value.startsWith('https://')) {
    result = decodeURIComponent(value)
  } else if (
    value.startsWith('localhost') ||
    /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(value)
  ) {
    result = `http://${decodeURIComponent(value)}`
  } else {
    // For all other cases, default to HTTPS
    result = `https://${decodeURIComponent(value)}`
  }

  // Remove trailing slash if present
  return result.replace(/\/$/, '')
}

// workflows message labels

/**
 * Formats date-like strings into a human friendly representation.
 */
const formatLabelDate = (value: string) => {
  if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
    return formatDate(value, 'natural')
  }
  return value
}

/**
 * Normalizes a primitive or array-like value (as string) into displayable text.
 * Example: "[\"A\",\"B\"]" -> "A to B"; dates are humanized.
 */
const formatLabelValue = (value: string) => {
  const cleanValue = value.trim().replace(/^["']|["']$/g, '')
  // Delegate array-like strings to a single array parser to avoid duplication
  const parsedArray = parseArrayString(cleanValue)
  if (parsedArray)
    return parsedArray.map((v) => formatLabelDate(v)).join(' to ')
  return formatLabelDate(cleanValue)
}

export type ParsedLabelValue = string | string[]

export type ParsedLabel = { key: string; value: ParsedLabelValue }

/**
 * Try to parse a string as a JSON object. Returns null if parsing fails or the
 * parsed value is not a plain object.
 */
const parseJsonObject = (input: string): Record<string, unknown> | null => {
  try {
    const parsed = JSON.parse(input)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed
    }
    return null
  } catch {
    return null
  }
}

/**
 * Returns true if a parsed label value should be considered "empty" and be
 * omitted from the rendered chips.
 */
const isEmptyParsedValue = (value: ParsedLabelValue): boolean => {
  if (Array.isArray(value)) return value.length === 0
  return value.trim() === ''
}

/**
 * Normalize a [key, rawValue] pair into a ParsedLabel, converting arrays and
 * primitives to their display-ready counterparts.
 */
const normalizeJsonEntry = (key: string, rawValue: unknown): ParsedLabel => {
  if (Array.isArray(rawValue)) {
    const tags = (rawValue as unknown[])
      .map((v) => String(v))
      .map((v) => v.trim())
      .filter((v) => v.length > 0)
    return { key, value: tags }
  }
  return { key, value: formatLabelValue(String(rawValue)) }
}

/**
 * Parse using a real JSON object string as the source.
 */
const parseLabelFromJson = (label: string): ParsedLabel[] => {
  const obj = parseJsonObject(label)
  if (!obj) return []
  return Object.entries(obj)
    .map(([key, rawValue]) => normalizeJsonEntry(key, rawValue))
    .filter((item) => !isEmptyParsedValue(item.value))
}

/**
 * Split a loose object-like string on commas at top level only.
 * Example input: 'a: 1, b: [1,2], c: "x,y"'
 */
const splitTopLevelComma = (input: string): string[] => {
  const parts: string[] = []
  let depth = 0
  let inSingle = false
  let inDouble = false
  let current = ''
  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i]
    const prev = i > 0 ? input[i - 1] : ''

    if (ch === '"' && prev !== '\\' && !inSingle) inDouble = !inDouble
    else if (ch === "'" && prev !== '\\' && !inDouble) inSingle = !inSingle

    if (!inSingle && !inDouble) {
      if (ch === '[' || ch === '{') depth += 1
      else if (ch === ']' || ch === '}') depth -= 1
      else if (ch === ',' && depth === 0) {
        parts.push(current)
        current = ''
        continue
      }
    }

    current += ch
  }
  if (current) parts.push(current)
  return parts
}

/**
 * Attempt to parse a JSON array string into string[]; returns null if it fails.
 */
const parseArrayString = (value: string): string[] | null => {
  if (!(value.startsWith('[') && value.endsWith(']'))) return null
  try {
    const arr = JSON.parse(value) as unknown[]
    return arr.map((v) => String(v).trim()).filter((v) => v.length)
  } catch {
    // Attempt to coerce single-quoted arrays into valid JSON, e.g. ['A','B'] -> ["A","B"]
    try {
      const normalized = value.replace(/'([^']*)'/g, '"$1"')
      const arr = JSON.parse(normalized) as unknown[]
      return arr.map((v) => String(v).trim()).filter((v) => v.length)
    } catch {
      // As a last resort, split by commas at top-level and strip quotes/spaces
      try {
        const inner = value.slice(1, -1)
        return splitTopLevelComma(inner)
          .map((s) => s.trim())
          .map((s) => s.replace(/^['"]|['"]$/g, ''))
          .filter((s) => s.length > 0)
      } catch {
        return null
      }
    }
  }
}

/**
 * Finds the index of the first top-level colon (:) not inside quotes or nested
 * arrays/objects. Returns -1 if none is found.
 */
const findTopLevelColonIndex = (input: string): number => {
  let depth = 0
  let inSingle = false
  let inDouble = false
  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i]
    const prev = i > 0 ? input[i - 1] : ''
    if (ch === '"' && prev !== '\\' && !inSingle) inDouble = !inDouble
    else if (ch === "'" && prev !== '\\' && !inDouble) inSingle = !inSingle

    if (inSingle || inDouble) continue

    if (ch === '[' || ch === '{') depth += 1
    else if (ch === ']' || ch === '}') depth -= 1
    else if (ch === ':' && depth === 0) return i
  }
  return -1
}

/**
 * Extracts a key and raw value from a loose key:value token, trimming and
 * stripping surrounding quotes from the key. Returns null for invalid tokens.
 */
const extractKeyAndRawValue = (
  item: string
): { key: string; rawValue: string } | null => {
  const colonIndex = findTopLevelColonIndex(item)
  if (colonIndex === -1) return null
  const keyPart = item.slice(0, colonIndex).trim()
  const key = keyPart.replace(/^["']|["']$/g, '')
  const rawValue = item.slice(colonIndex + 1).trim()
  return { key, rawValue }
}

/**
 * Parse a loose object-like string into ParsedLabel[] as a fallback when the
 * payload is not valid JSON. Handles array literals and primitives.
 */
const parseLabelFromLooseString = (label: string): ParsedLabel[] => {
  const cleaned = label.replace(/^\s*{\s*/, '').replace(/\s*}\s*$/, '')
  const parts = splitTopLevelComma(cleaned)

  const mapped = parts
    .map((item) => extractKeyAndRawValue(item))
    .filter((pair): pair is { key: string; rawValue: string } => !!pair)
    .map(({ key, rawValue }) => {
      const arr = parseArrayString(rawValue)
      return arr
        ? { key, value: arr }
        : { key, value: formatLabelValue(rawValue) }
    })

  return mapped.filter((item) => !isEmptyParsedValue(item.value))
}

export const parseLabel = (label: string): ParsedLabel[] => {
  const fromJson = parseLabelFromJson(label)
  if (fromJson.length > 0) return fromJson

  // Only parse as loose string if it looks like a structured object
  const trimmed = label.trim()
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    return parseLabelFromLooseString(label)
  }

  return []
}

export const encodeIfNeeded = (value: string) => {
  try {
    const decodedValue = decodeURIComponent(value)
    if (decodedValue === value) {
      return encodeURIComponent(value)
    }
    return value
  } catch {
    return encodeURIComponent(value)
  }
}

// file type label
export const getFileTypeLabel = (mimeType: string): string => {
  if (mimeType.startsWith('application/pdf')) return 'PDF'
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel'))
    return 'Spreadsheet'
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint'))
    return 'Presentation'
  if (mimeType.includes('document') || mimeType.includes('word'))
    return 'Document'
  if (mimeType.startsWith('text/')) return 'Text'
  if (mimeType.startsWith('video/')) return 'Video'
  if (mimeType.startsWith('audio/')) return 'Audio'
  return 'File'
}

export const formatObjectKeys = (key: string) => {
  return key
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export const formatEndpoint = (endpoint: string) => {
  return endpoint.replace(/^https?:\/\//, '')
}
export const getJsonMarkdown = (content: object = {}) => {
  let jsonBlock = ''
  try {
    jsonBlock = `\`\`\`json\n${JSON.stringify(content, null, 2)}\n\`\`\``
  } catch {
    jsonBlock = `\`\`\`\n${String(content)}\n\`\`\``
  }

  return jsonBlock
}

interface SessionsPage {
  data: (SessionEntry | TeamSessions)[]
  meta: { page: number; total_pages: number }
}

export interface UnifiedInfiniteSessionsData {
  pages: SessionsPage[]
  pageParams: (string | number)[]
}

export const updateSessionsCache = (
  queryClient: QueryClient,
  cacheKey: Array<string | null>,
  sessionId: string,
  sessionState: string
) => {
  queryClient.setQueryData(
    cacheKey,
    (oldData: UnifiedInfiniteSessionsData | undefined) => {
      if (!oldData?.pages) return oldData

      return {
        ...oldData,
        pages: oldData.pages.map((page: SessionsPage) => ({
          ...page,
          data: page.data.map((session: SessionEntry | TeamSessions) =>
            session.session_id === sessionId
              ? { ...session, session_state: sessionState }
              : session
          )
        }))
      }
    }
  )
}

// Common file processing and addition logic
export const processAndAddFiles = (
  newFiles: File[],
  currentFiles: FileData[],
  addFile: (file: FileData) => void
) => {
  if (!newFiles.length) return

  const remainingSlots = MAX_FILES - currentFiles.length

  if (remainingSlots <= 0) {
    toast.error({
      description: `You can only upload up to ${MAX_FILES} files`
    })
    return
  }

  const oversizedFiles = newFiles.filter((file) => file.size > MAX_FILE_SIZE)
  const validSizedFiles = newFiles.filter((file) => file.size <= MAX_FILE_SIZE)
  const filesToAdd = validSizedFiles.slice(0, remainingSlots)
  const filesExceedingSlots = validSizedFiles.slice(remainingSlots)

  const errorParts: string[] = []

  if (oversizedFiles.length > 0) {
    const maxSizeMB = MAX_FILE_SIZE / (1024 * 1024)
    errorParts.push(
      `${oversizedFiles.length} file${oversizedFiles.length > 1 ? 's' : ''} exceeded ${maxSizeMB}MB limit`
    )
  }

  if (filesExceedingSlots.length > 0) {
    errorParts.push(
      `${filesExceedingSlots.length} file${filesExceedingSlots.length > 1 ? 's' : ''} couldn't be added (${remainingSlots} slot${remainingSlots !== 1 ? 's' : ''} available)`
    )
  }

  if (errorParts.length > 0) {
    const successPart =
      filesToAdd.length > 0
        ? `${filesToAdd.length} file${filesToAdd.length > 1 ? 's' : ''} added. `
        : ''
    toast.error({
      description: `${successPart}${errorParts.join(', ')}`
    })
  }

  filesToAdd.forEach((file) => {
    // Create blob URLs for images, videos, and audio files
    const isMediaFile =
      file?.type?.startsWith('image/') ||
      file?.type?.startsWith('video/') ||
      file?.type?.startsWith('audio/')

    addFile({
      file,
      preview: isMediaFile ? URL.createObjectURL(file) : null
    })
  })
}
