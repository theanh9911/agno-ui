import { AuthenticationService } from '@/api/generated'
import { extractAPIErrorMessage, logError } from '@/utils/error'
import { useMutation } from '@tanstack/react-query'
import { toast } from '@/components/ui/toast'

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (params: { email: string }) => {
      try {
        return await AuthenticationService.authForgotPassword({
          requestBody: { email: params.email }
        })
      } catch (error) {
        const errorMessage = extractAPIErrorMessage(
          error,
          'Something went wrong whilst requesting password reset'
        )
        logError(error as Error)
        throw new Error(errorMessage)
      }
    },
    onSuccess: () => {
      toast.success({
        description: 'Password reset link sent to your email!'
      })
    }
  })
}
