import { useCallback, useMemo } from 'react'
import { useInvalidateQuery } from '@/hooks/useInvalidateQuery'
import { useInvalidateMemoryQuery } from '@/hooks/memory/useInvalidateMemoryQuery'
import { CACHE_KEYS, CACHE_KEY_PREFIX } from '@/constants'
import { useOSStore } from '@/stores/OSStore'
import { useFilterType } from '@/hooks/useFilterType'
import { useUser } from '@/api/hooks/queries'
import { usePlaygroundQueries } from '@/hooks/playground/usePlaygroundQueries'
import { useWorkflowsWebSocket } from '@/hooks/workflows/useWorkflowsWebSocket'
import { RefetchType } from '@/types/globals'
import { useAgentsQuery } from '../playground/useAgentsQuery'
import { toast } from '@/components/ui/toast'

export const usePlaygroundRefresh = () => {
  const { invalidateQuery } = useInvalidateQuery()
  const { invalidateAllMemories } = useInvalidateMemoryQuery()
  const { currentOS } = useOSStore()
  const { selectedId, session } = usePlaygroundQueries()
  const { type } = useFilterType({ autoSetDefault: false })
  const { data: user } = useUser()
  const selectedEndpoint = currentOS?.endpoint_url ?? null
  const OSId = currentOS?.id ?? null
  const { reconnect } = useWorkflowsWebSocket({ autoConnect: false })
  const { data: agents } = useAgentsQuery()
  const dbId =
    agents?.find((agent) => agent.id === selectedId)?.db_id ?? undefined

  const queryKeys = useMemo(
    () => [
      {
        queryKey: CACHE_KEYS.PLAYGROUND_ENDPOINTS({
          org_id: user?.user.current_organization_id ?? undefined
        })
      },
      { queryKey: CACHE_KEYS.ENDPOINT_STATUS(OSId) },
      { queryKey: CACHE_KEYS.OS_CONFIG(OSId) }
    ],
    [user?.user.current_organization_id, OSId]
  )

  const refresh = useCallback(async () => {
    try {
      await invalidateQuery(queryKeys)
      invalidateQuery({
        queryKey: [CACHE_KEY_PREFIX.APP_MEMORIES, OSId, dbId, 'all-playground'],
        refetchType: 'all',
        exact: false
      })
      if (selectedEndpoint) {
        invalidateQuery({
          queryKey: CACHE_KEYS.AGENTS(selectedEndpoint),
          refetchType: 'all'
        })
      }
      if (OSId) {
        invalidateQuery({
          queryKey: CACHE_KEYS.PLAYGROUND_WORKFLOWS(OSId),
          refetchType: 'all'
        })
      }
      if (OSId) {
        invalidateQuery({
          queryKey: CACHE_KEYS.PLAYGROUND_TEAMS(selectedEndpoint),
          refetchType: 'all' as RefetchType
        })
      }

      if (session && selectedId) {
        invalidateQuery({
          queryKey: [
            CACHE_KEY_PREFIX.PLAYGROUND_WORKFLOWS,
            selectedId,
            session
          ],
          refetchType: 'active' as RefetchType
        })
      }

      switch (type) {
        case 'agent': {
          if (session && selectedId) {
            invalidateQuery({
              queryKey: [CACHE_KEY_PREFIX.PLAYGROUND_SESSIONS],
              refetchType: 'all',
              exact: false
            })
          }

          break
        }

        case 'workflow': {
          if (selectedId) {
            invalidateQuery({
              queryKey: CACHE_KEYS.PLAYGROUND_WORKFLOW(selectedId),
              refetchType: 'all'
            })
          }

          invalidateQuery({
            queryKey: [CACHE_KEY_PREFIX.PLAYGROUND_SESSIONS],
            refetchType: 'all' as RefetchType,
            exact: false
          })
          reconnect()
          break
        }

        case 'team': {
          invalidateQuery({
            queryKey: [CACHE_KEY_PREFIX.PLAYGROUND_SESSIONS],
            refetchType: 'all' as RefetchType,
            exact: false
          })

          break
        }
      }
    } catch {
      toast.error({
        description: 'Failed to refresh. Please try again.'
      })
    } finally {
      toast.dismiss()
    }
  }, [
    invalidateQuery,
    invalidateAllMemories,
    user?.user.current_organization_id,
    OSId,
    dbId,
    queryKeys,
    selectedEndpoint,
    session,
    selectedId,
    OSId
  ])

  return refresh
}
