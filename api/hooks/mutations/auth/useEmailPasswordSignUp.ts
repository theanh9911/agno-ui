import { AuthenticationService } from '@/api/generated'
import { useMutation } from '@tanstack/react-query'
import useAuth from '@/hooks/useAuth'
import { extractAPIErrorMessage, logError } from '@/utils/error'
import { useRouter } from '@/utils/navigation'
import { encodeEmailForURL } from '@/utils/format'
import { usePostHogIdentify } from '@/hooks/usePostHogIdentify'

export const useEmailPasswordSignUp = () => {
  const { redirectToApp } = useAuth()
  const router = useRouter()
  const { identifyUserWithMethod } = usePostHogIdentify()

  return useMutation({
    mutationFn: async (params: { email: string; password: string }) => {
      try {
        return await AuthenticationService.authRegister({
          requestBody: {
            email: params.email,
            password: params.password
          }
        })
      } catch (error) {
        const errorMessage = extractAPIErrorMessage(
          error,
          'Something went wrong whilst signing up'
        )
        logError(error as Error)
        throw new Error(errorMessage)
      }
    },
    onSuccess: (userData) => {
      // Only identify if email is verified (successful signup)
      if (userData.email_verified) {
        identifyUserWithMethod(userData, 'email_password')
      }

      if (
        !userData.email_verified &&
        userData.pending_token &&
        userData.email
      ) {
        const redirectUrl = `/verify-email?pending_token=${userData.pending_token}&email=${encodeEmailForURL(userData.email)}`
        router.push(redirectUrl)
      } else {
        redirectToApp()
      }
    }
  })
}
