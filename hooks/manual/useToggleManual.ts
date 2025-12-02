import { useMutation, useQueryClient } from '@tanstack/react-query'

import { APIRoutes } from '@/api/routes'
import { request } from '@/utils/request'
import { CACHE_KEYS } from '@/constants'
import { useOSStore } from '@/stores/OSStore'
import { useManualStore } from '@/stores/ManualStore'
import { ToggleManualModeResponse } from '@/types/manual'

interface ToggleManualInput {
  sessionId: string
  isManual: boolean
}

export const useToggleManual = () => {
  const currentOS = useOSStore((state) => state.currentOS)
  const setManualStatus = useManualStore((state) => state.setManualStatus)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ sessionId, isManual }: ToggleManualInput) => {
      if (!currentOS?.endpoint_url) {
        throw new Error('AgentOS endpoint not set')
      }
      if (!sessionId) {
        throw new Error('sessionId is required to toggle manual mode')
      }

      const { body } = await request<ToggleManualModeResponse>(
        APIRoutes.ToggleManualMode(currentOS.endpoint_url),
        'POST',
        {
          body: {
            user_id: sessionId,
            is_manual: isManual
          }
        }
      )

      setManualStatus(sessionId, isManual)
      return body
    },
    onSuccess: (_data, variables) => {
      const osId = currentOS?.id || null
      queryClient.invalidateQueries({
        queryKey: CACHE_KEYS.MANUAL_STATUS(osId, variables.sessionId)
      })
      queryClient.invalidateQueries({
        queryKey: CACHE_KEYS.MANUAL_SESSIONS(osId, undefined, undefined)
      })
    }
  })
}
