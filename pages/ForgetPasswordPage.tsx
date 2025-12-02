import { useCallback } from 'react'
import { useForm, FieldValues } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import Paragraph from '@/components/ui/typography/Paragraph'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ROUTES } from '@/routes'
import AuthLayout from '@/components/layouts/AuthLayout/AuthLayout'
import EmailPasswordFields from '@/components/common/EmailPasswordFields'
import { forgotPasswordSchema } from '@/schema'
import { useForgotPassword } from '@/api/hooks/mutations'
import { Form } from '@/components/ui/form'
import z from 'zod'

const ForgotPasswordPage = () => {
  const forgotPasswordMutation = useForgotPassword()
  const { mutateAsync: forgotPassword, isPending: isLoading } =
    forgotPasswordMutation

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    },
    mode: 'onChange'
  })

  const handleErrorClear = useCallback(() => {
    if (forgotPasswordMutation.error) {
      forgotPasswordMutation.reset()
    }
  }, [forgotPasswordMutation])

  const onSubmit = useCallback(
    async (data: FieldValues) => {
      if (isLoading) return
      await forgotPassword({ email: data.email })
    },
    [isLoading, forgotPassword, form]
  )

  // Get server error message
  const serverError = forgotPasswordMutation.error?.message

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
            type="forgot-password"
            isLoading={isLoading}
            onErrorClear={handleErrorClear}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            isLoading={isLoading}
          >
            SEND PASSWORD RESET LINK
          </Button>
        </form>
      </Form>

      <Paragraph size="body" className="text-left text-muted/80">
        Already have an account?{' '}
        <Link to={ROUTES.SignIn} className="underline">
          Sign in
        </Link>
      </Paragraph>
    </AuthLayout>
  )
}

export default ForgotPasswordPage
