import { request } from '@/utils/request'

import { APIRoutes } from './routes'
import { MetricsData } from '@/types/metrics'

interface MetricsFilter {
  starting_date?: string
  ending_date?: string
}

const convertFiltersToQueryParams = (
  filters?: MetricsFilter
): Record<string, string | number> | undefined => {
  if (!filters) return undefined

  const result: Record<string, string | number> = {}

  if (filters.starting_date) {
    const startDate = new Date(filters.starting_date)
    result.starting_date = startDate.toISOString().split('T')[0]
  }

  if (filters.ending_date) {
    const endDate = new Date(filters.ending_date)
    result.ending_date = endDate.toISOString().split('T')[0]
  }

  return result
}
export const getMetrics = async (
  url: string,
  db_id: string,

  filter: MetricsFilter,
  table?: string
) => {
  const response = await request<MetricsData>(
    APIRoutes.GetMetrics(url),
    'GET',
    {
      queryParam: {
        db_id,
        ...convertFiltersToQueryParams(filter),
        ...(table && { table })
      }
    }
  )
  return response
}

export const RefreshMetrics = async (
  url: string,
  db_id: string,
  table?: string
) => {
  return request<MetricsData>(APIRoutes.RefreshMetrics(url), 'POST', {
    queryParam: {
      db_id,
      ...(table && { table })
    }
  })
}
