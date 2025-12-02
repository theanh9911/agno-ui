import { useCallback, useEffect, useState } from 'react'
import { useForm, FieldValues } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import AuthLayout from '@/components/layouts/AuthLayout/AuthLayout'
import EmailPasswordFields from '@/components/common/EmailPasswordFields'
import { resetPasswordSchema } from '@/schema'
import { useResetPassword } from '@/api/hooks/mutations'
import { useRouter, useSearchParams } from '@/utils/navigation'
import { ROUTES } from '@/routes'
import { Form } from '@/components/ui/form'
import z from 'zod'

const ResetPasswordPage = () => {
  const [token, setToken] = useState<string | null>(null)
  const resetPasswordMutation = useResetPassword()
  const { mutateAsync: resetPassword, isPending: isLoading } =
    resetPasswordMutation

  const router = useRouter()
  const searchParams = useSearchParams()

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: ''
    },
    mode: 'onChange'
  })

  useEffect(() => {
    const tokenParam = searchParams.get('token')
    if (tokenParam) {
      setToken(tokenParam)
    } else {
      router.push(ROUTES.ForgotPassword)
    }
  }, [searchParams, router])

  const handleErrorClear = useCallback(() => {
    if (resetPasswordMutation.error) {
      resetPasswordMutation.reset()
    }
  }, [resetPasswordMutation])

  const onSubmit = useCallback(
    async (data: FieldValues) => {
      if (isLoading || !token) return
      await resetPassword({
        new_password: data.newPassword,
        token: token
      })
    },
    [isLoading, token, resetPassword, form]
  )

  // Get server error message
  const serverError = resetPasswordMutation.error?.message

  return (
    <AuthLayout>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Show server error alert */}
          {serverError && (
            <Alert variant="destructive">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <EmailPasswordFields
            type="reset-password"
            isLoading={isLoading}
            onErrorClear={handleErrorClear}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !token}
            isLoading={isLoading}
          >
            RESET PASSWORD
          </Button>
        </form>
      </Form>
    </AuthLayout>
  )
}

export default ResetPasswordPage
