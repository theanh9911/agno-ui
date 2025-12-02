import { AuthenticationService } from '@/api/generated'
import { ROUTES } from '@/routes'
import { extractAPIErrorMessage, logError } from '@/utils/error'
import { useRouter } from '@/utils/navigation'
import { useMutation } from '@tanstack/react-query'
import { toast } from '@/components/ui/toast'

export const useResetPassword = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: async (params: { new_password: string; token: string }) => {
      try {
        return await AuthenticationService.authResetPassword({
          requestBody: {
            new_password: params.new_password,
            token: params.token
          }
        })
      } catch (error) {
        const errorMessage = extractAPIErrorMessage(
          error,
          'Something went wrong whilst resetting your password'
        )
        logError(error as Error)
        throw new Error(errorMessage)
      }
    },
    onSuccess: () => {
      toast.success({
        description: 'Password updated successfully!'
      })
      router.push(ROUTES.SignIn)
    }
  })
}
