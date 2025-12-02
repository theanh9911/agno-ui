import type { RequestHeaders, RequestMethod, RequestOptions } from './types'

import { omitDeepBy } from '../misc'
import { SDKConfig } from './sdk-config'

const getRequestBody = (
  method: RequestMethod,
  body: RequestOptions['body'],
  formData: RequestOptions['formData'],
  format: RequestOptions['format']
): string | FormData | undefined => {
  if (['GET', 'HEAD'].includes(method)) return undefined

  if (formData) return formData

  let requestBody = body ?? {}
  requestBody = format ? format(requestBody) : requestBody
  requestBody = omitDeepBy(requestBody, (value) => value == null)

  return JSON.stringify(requestBody)
}

export const getHeaders = async (
  requestHeaders: RequestHeaders = {},
  hasFormData: boolean = false,
  skipAuth: boolean = false
): Promise<RequestHeaders> => {
  const headers: RequestHeaders = {}

  if (!hasFormData) {
    headers['Content-Type'] = 'application/json'
  }

  // Add custom headers from SDKConfig if available
  if (SDKConfig.CUSTOM_HEADERS && SDKConfig.CUSTOM_HEADERS.length > 0) {
    SDKConfig.CUSTOM_HEADERS.forEach((header) => {
      if (header.key && header.value) {
        headers[header.key] = header.value
      }
    })
  }

  // Add Authorization header if security key exists and auth is not skipped
  if (SDKConfig.SECURITY_KEY && !skipAuth) {
    headers['Authorization'] = `Bearer ${SDKConfig.SECURITY_KEY}`
  }

  // Spread request headers (these will override any conflicting custom headers)
  Object.assign(headers, requestHeaders)

  return headers
}

export const getRequest = async (
  route: string,
  method: RequestMethod,
  options?: RequestOptions
) => {
  let formattedRoute = route
  if (options?.queryParam) {
    const newUrl = new URL(route)
    Object.entries(options.queryParam).forEach(([key, value]) => {
      newUrl.searchParams.append(key, value.toString())
    })
    formattedRoute = newUrl.toString()
  }
  const requestBody = getRequestBody(
    method,
    options?.body,
    options?.formData,
    options?.format
  )
  const hasFormData = Boolean(options?.formData)

  const requestHeaders = await getHeaders(
    options?.headers || {},
    hasFormData,
    options?.skipAuth
  )

  const params = {
    method,
    headers: requestHeaders,
    body: requestBody,
    cache: options?.cache,
    credentials: 'include' as RequestCredentials
  }

  return fetch(formattedRoute, params)
}
