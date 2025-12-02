import * as z from 'zod'
import { ENVIRONMENT } from '@/constants'

export const normalizeEndpointUrl = (url: string): string => {
  const trimmed = url.trim().replace(/\/$/, '')
  try {
    const parsed = new URL(trimmed)
    parsed.host = parsed.host.toLowerCase()
    let normalized = parsed.origin + parsed.pathname
    normalized = normalized.replace(/\/+$/, '')
    if (parsed.search) normalized += parsed.search
    if (parsed.hash) normalized += parsed.hash
    return normalized
  } catch {
    return trimmed
  }
}

export const endpointUrlValidation = z
  .string()
  .trim()
  .min(1, 'URL is required')
  .transform((url) => normalizeEndpointUrl(url))

const nameValidation = z.string().trim().min(1, 'Name is required')

const tagsValidation = z
  .array(z.string().trim().min(1))
  .optional()
  .default([])
  .transform((tags) => tags?.filter((tag) => tag.length > 0) || [])

export const osConnectionSchema = z
  .object({
    endpoint_url: endpointUrlValidation,
    name: nameValidation,
    tags: tagsValidation,
    environment: z.enum([ENVIRONMENT.LOCAL, ENVIRONMENT.LIVE])
  })
  .superRefine((data, ctx) => {
    const { environment, endpoint_url } = data
    const hasHttp = endpoint_url.startsWith('http://')
    const hasHttps = endpoint_url.startsWith('https://')
    //local live both can have http
    if (!hasHttp && !hasHttps) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'URL must start with http:// or https://',
        path: ['endpoint_url']
      })
      return
    }

    // Pre-validate explicit port number (if present) so we can show a precise error
    // even if URL parsing fails for out-of-range ports.
    const ipv6PortMatch = endpoint_url.match(/\]:([0-9]+)(?:\/|$)/)
    const genericPortMatch = endpoint_url
      .replace(/^https?:\/\//i, '')
      .match(/^[^/]*?:([0-9]+)(?:\/|$)/)
    const portStr =
      (ipv6PortMatch && ipv6PortMatch[1]) ||
      (genericPortMatch && genericPortMatch[1])
    if (portStr) {
      const portNum = parseInt(portStr, 10)
      if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Port number must be between 1 and 65535',
          path: ['endpoint_url']
        })
        return
      }
    }

    try {
      const parsed = new URL(endpoint_url)
      // Verify port number if present (1-65535)
      if (parsed.port) {
        const portNum = parseInt(parsed.port, 10)
        if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Port number must be between 1 and 65535',
            path: ['endpoint_url']
          })
          return
        }
      }

      const hostname = parsed.hostname
      const isLocalhost = hostname === 'localhost'
      const isIPv4 = /^(?:\d{1,3}\.){3}\d{1,3}$/.test(hostname)
      const isIPv6 = /:/.test(hostname)

      if (environment === 'local') {
        if (!isLocalhost && !isIPv4 && !isIPv6) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Local environment must use localhost or an IP address',
            path: ['endpoint_url']
          })
        }
      } else {
        // Live environment validation
        if (isLocalhost || isIPv4 || isIPv6) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Live environment cannot use localhost or an IP address',
            path: ['endpoint_url']
          })
        }
      }
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please enter a valid URL',
        path: ['endpoint_url']
      })
    }
  })
