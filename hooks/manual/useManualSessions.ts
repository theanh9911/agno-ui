import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import { APIRoutes } from '@/api/routes'
import { request } from '@/utils/request'
import { CACHE_KEYS } from '@/constants'
import { useOSStore } from '@/stores/OSStore'
import { useManualStore } from '@/stores/ManualStore'
import { ManualSessionsResponse } from '@/types/manual'

interface ManualSessionsParams {
  isManual?: boolean
  platform?: string
  limit?: number
  offset?: number
}

export const useManualSessions = ({
  isManual,
  platform,
  limit = 100,
  offset = 0
}: ManualSessionsParams = {}) => {
  const currentOS = useOSStore((state) => state.currentOS)
  const bulkUpsert = useManualStore((state) => state.bulkUpsert)

  const queryKey = useMemo(
    () =>
      CACHE_KEYS.MANUAL_SESSIONS(
        currentOS?.id || null,
        isManual,
        platform,
        limit,
        offset
      ),
    [currentOS?.id, isManual, platform, limit, offset]
  )

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!currentOS?.endpoint_url) {
        throw new Error('AgentOS endpoint not set')
      }

      const url = new URL(
        APIRoutes.GetManualSessions(currentOS.endpoint_url)
      )

      if (typeof isManual === 'boolean') {
        url.searchParams.set('is_manual', String(isManual))
      }
      if (platform) {
        url.searchParams.set('platform', platform)
      }
      url.searchParams.set('limit', String(limit))
      url.searchParams.set('offset', String(offset))

      const { body } = await request<ManualSessionsResponse>(
        url.toString(),
        'GET'
      )

      const sessions = body?.data || []
      if (sessions.length > 0) {
        bulkUpsert(
          sessions.map((item) => ({
            sessionId: item.session_id,
            isManual: Boolean(item.manual_mode)
          }))
        )
      }

      return body
    },
    enabled: Boolean(currentOS?.endpoint_url),
    staleTime: 30 * 1000
  })
}
