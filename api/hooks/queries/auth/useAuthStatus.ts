import { ApiError } from '@/api/generated/core/ApiError'
import { AuthenticationService } from '@/api/generated'
import { useQuery } from '@tanstack/react-query'

export const useAuthStatus = () => {
  return useQuery({
    queryKey: ['auth-status'],
    queryFn: async () => {
      try {
        await AuthenticationService.authAuthenticate()
        return { authenticated: true }
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          return { authenticated: false }
        }
        throw error
      }
    },
    retry: false,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: true
  })
}
