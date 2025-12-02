import { useCallback } from 'react'
import { useInvalidateQuery } from '@/hooks/useInvalidateQuery'
import { useInvalidateOSStatus } from '@/hooks/os/useInvalidateOSStatus'
import { CACHE_KEY_PREFIX, CACHE_KEYS } from '@/constants'
import { useOSStore } from '@/stores/OSStore'
import { useSearchParams } from '@/utils/navigation'
import { useDatabase } from '@/providers/DatabaseProvider/DatabaseProvider'
import { useParams } from 'react-router-dom'

export const useTracesRefresh = () => {
  const { invalidateQuery } = useInvalidateQuery()
  const { invalidateOSStatus } = useInvalidateOSStatus()
  const { currentOS } = useOSStore()
  const { selectedDatabase } = useDatabase()
  const params = useParams<{ '*'?: string }>()
  const searchParams = useSearchParams()
  const id = params?.['*']
  const groupBy = searchParams?.get('group_by') || 'runs'
  const isSessionView = groupBy === 'sessions'

  const refresh = useCallback(async () => {
    const dbId = selectedDatabase?.traces?.db?.db_id ?? ''
    const table = selectedDatabase?.traces?.table || ''

    if (id) {
      // If we have a trace ID (detail page), invalidate trace details
      await invalidateQuery({
        queryKey: CACHE_KEYS.TRACES_DETAIL({
          OSId: currentOS?.id ?? null,
          dbId,
          table,
          traceId: id
        })
      })

      // If in session view, also invalidate the session's traces list
      if (isSessionView) {
        await invalidateQuery({
          queryKey: [CACHE_KEY_PREFIX.TRACES_LIST, currentOS?.id ?? null, dbId],
          exact: false
        })
      }
    } else {
      // If no trace ID (list page), invalidate appropriate list
      if (isSessionView) {
        // Invalidate sessions group by list
        await invalidateQuery({
          queryKey: [
            CACHE_KEY_PREFIX.TRACES_GROUP_BY_SESSION,
            currentOS?.id ?? null,
            dbId
          ],
          exact: false
        })
      } else {
        // Invalidate runs/traces list
        await invalidateQuery({
          queryKey: [CACHE_KEY_PREFIX.TRACES_LIST, currentOS?.id ?? null, dbId],
          exact: false
        })
      }
    }

    await invalidateOSStatus()
  }, [
    invalidateQuery,
    invalidateOSStatus,
    currentOS?.id,
    selectedDatabase,
    id,
    isSessionView
  ])

  return refresh
}
