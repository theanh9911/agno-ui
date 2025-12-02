import { useQuery } from '@tanstack/react-query'

import { APIRoutes } from '@/api/routes'
import { request } from '@/utils/request'
import { CACHE_KEYS } from '@/constants'
import { useOSStore } from '@/stores/OSStore'
import { useManualStore } from '@/stores/ManualStore'
import { ManualStatusResponse } from '@/types/manual'

export const useManualStatus = (sessionId?: string) => {
  const currentOS = useOSStore((state) => state.currentOS)
  const setManualStatus = useManualStore((state) => state.setManualStatus)

  return useQuery({
    queryKey: CACHE_KEYS.MANUAL_STATUS(currentOS?.id || null, sessionId || ''),
    queryFn: async () => {
      if (!currentOS?.endpoint_url) {
        throw new Error('AgentOS endpoint not set')
      }
      if (!sessionId) {
        throw new Error('sessionId is required to fetch manual status')
      }

      const { body } = await request<ManualStatusResponse>(
        APIRoutes.GetManualStatus(currentOS.endpoint_url, sessionId),
        'GET'
      )

      if (body?.user_id) {
        setManualStatus(body.user_id, Boolean(body.is_manual))
      }

      return body
    },
    enabled: Boolean(currentOS?.endpoint_url && sessionId),
    staleTime: 1000 * 10 // giữ mới trong thời gian ngắn
  })
}
