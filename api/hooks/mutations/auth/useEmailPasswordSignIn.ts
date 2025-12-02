import { AuthenticationService } from '@/api/generated'
import { useMutation } from '@tanstack/react-query'
import useAuth from '@/hooks/useAuth'
import { extractAPIErrorMessage, logError } from '@/utils/error'
import { usePostHogIdentify } from '@/hooks/usePostHogIdentify'

export const useEmailPasswordSignIn = () => {
  const { redirectToApp } = useAuth()
  const { identifyUserWithMethod } = usePostHogIdentify()

  return useMutation({
    mutationFn: async (params: { email: string; password: string }) => {
      try {
        return await AuthenticationService.authLogin({
          requestBody: {
            email: params.email,
            password: params.password
          }
        })
      } catch (error) {
        const errorMessage = extractAPIErrorMessage(
          error,
          'Something went wrong whilst signing in'
        )
        logError(error as Error)
        throw new Error(errorMessage)
      }
    },
    onSuccess: (userData) => {
      identifyUserWithMethod(userData, 'email_password')
      redirectToApp()
    }
  })
}
