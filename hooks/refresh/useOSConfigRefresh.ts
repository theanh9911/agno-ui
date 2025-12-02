import { useCallback } from 'react'
import { useInvalidateQuery } from '@/hooks/useInvalidateQuery'
import { useInvalidateOSStatus } from '@/hooks/os/useInvalidateOSStatus'
import { CACHE_KEYS } from '@/constants'
import { useOSStore } from '@/stores/OSStore'
import { useSearchParams } from '@/utils/navigation'

export const useOSConfigRefresh = () => {
  const { invalidateQuery } = useInvalidateQuery()
  const { invalidateOSStatus } = useInvalidateOSStatus()
  const { currentOS } = useOSStore()
  const searchParams = useSearchParams()

  const refresh = useCallback(async () => {
    const typeParam = searchParams?.get('type')
    const idParam = searchParams?.get('id')

    await Promise.all([
      typeParam && idParam
        ? invalidateQuery({
            queryKey: CACHE_KEYS.OS_COMPONENTS_DETAILS(
              idParam,
              typeParam,
              currentOS?.id ?? null
            )
          })
        : invalidateQuery({
            queryKey: CACHE_KEYS.OS_CONFIG(currentOS?.id || null)
          }),
      invalidateOSStatus()
    ])
  }, [invalidateQuery, searchParams, currentOS?.id, invalidateOSStatus])

  return refresh
}
