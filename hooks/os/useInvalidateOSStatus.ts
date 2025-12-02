import { useInvalidateQuery } from '@/hooks/useInvalidateQuery'
import { CACHE_KEYS } from '@/constants'
import { useOSStore } from '@/stores/OSStore'
import { logError } from '@/utils/error'

export const useInvalidateOSStatus = () => {
  const { invalidateQuery } = useInvalidateQuery()
  const currentOS = useOSStore((state) => state.currentOS)
  const OSId = currentOS?.id ?? null

  const invalidateOSStatus = async () => {
    if (!OSId) return

    try {
      const queryKey = CACHE_KEYS.OS_CONFIG_STATUS(OSId)

      await invalidateQuery({
        queryKey
      })
    } catch (error) {
      if (error) {
        logError(error as Error)
      }
    }
  }

  return {
    invalidateOSStatus
  }
}
