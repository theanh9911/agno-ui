import { CACHE_KEYS } from '@/constants'
import { AUTHENTICATION_ROUTES } from '@/routes'
import { logError } from '@/utils/error'
import { useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { UsersService } from '@/api/generated'
import { usePathname } from '@/utils/navigation'
import { getUserDataFromLocalStorage } from '@/utils/user'

export const useUser = ({ enabled = true }: { enabled?: boolean } = {}) => {
  const pathname = usePathname()
  const queryClient = useQueryClient()
  const isAuthFormPage = Object.values(AUTHENTICATION_ROUTES).includes(pathname)
  const cachedData = queryClient.getQueryData(CACHE_KEYS.AUTH_CACHE_KEYS.USER)

  // Fallback: Check localStorage directly if React Query cache hasn't hydrated yet
  const localStorageFallback = useMemo(() => {
    return cachedData ? null : getUserDataFromLocalStorage()
  }, [cachedData])

  const effectiveCachedData = cachedData || localStorageFallback

  const query = useQuery({
    queryKey: CACHE_KEYS.AUTH_CACHE_KEYS.USER,
    queryFn: async () => {
      try {
        return await UsersService.usersGetCurrent()
      } catch (error) {
        logError(error as Error)
        throw error
      }
    },
    refetchOnWindowFocus: false,
    enabled: isAuthFormPage ? !!effectiveCachedData : enabled,
    retry: false,
    gcTime: 1000 * 60 * 60 * 24,
    staleTime: Infinity,
    meta: {
      persist: true
    }
  })

  return {
    ...query,
    cachedData: effectiveCachedData
  }
}
