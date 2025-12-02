import { APIError } from '@/api/errors/APIError'
import { ALL_FIELDS_KEY, FormError } from '@/api/errors/FormError'

import type { ErrorResponseBody, RequestMethod, RequestOptions } from './types'

import { getRequest } from './utils'

export const request = async <Response extends object | number | string>(
  route: string,
  method: RequestMethod,
  options?: RequestOptions
) => {
  const response = await getRequest(route, method, options)

  const responseBody =
    response.ok && response.status !== 204 ? await response.json() : null

  if (!response.ok) {
    const errorBody = !responseBody ? await response.json() : responseBody

    const context = {
      request: {
        route,
        method,
        options
      },
      response,
      responseBody
    }

    // New Relic page action for failed request context
    try {
      window.newrelic?.addPageAction?.('api_error', {
        route,
        method,
        status: response.status
      })
    } catch {
      // eslint-disable-next-line no-console
      console.error('Failed to add page action for failed request context')
    }
    if (response.status === 400) {
      // && route !== APIRoutes.GetTeamMemberInvite
      // TODO: update this once the API form validation has been updated globally on the back-end:
      throw new FormError(response.statusText, response.status, {
        [ALL_FIELDS_KEY]: [
          (responseBody as unknown as ErrorResponseBody)?.detail
        ]
      })
    } else {
      throw new APIError(
        (errorBody as ErrorResponseBody)?.detail || response.statusText,
        response.status,
        context
      )
    }
  }

  return {
    body: responseBody as Response,
    headers: response.headers,
    status: response.status
  }
}
