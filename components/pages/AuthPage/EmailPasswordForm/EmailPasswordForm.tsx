import { useCallback, useEffect } from 'react'
import { useForm, FieldValues } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import Paragraph from '@/components/ui/typography/Paragraph'
import { Alert, AlertDescription } from '@/components/ui/alert'

import {
  useEmailPasswordSignIn,
  useEmailPasswordSignUp
} from '@/api/hooks/mutations'
import { useAuthStore } from '@/stores/LoginStore'
import Link from '@/components/ui/Link'
import { AuthPageProps } from '@/constants'
import { ROUTES } from '@/routes'
import EmailPasswordFields from '@/components/common/EmailPasswordFields'
import { Form } from '@/components/ui/form'
import { schemaMap } from '@/schema'
import z from 'zod'
import { useSearchParams } from '@/utils/navigation'

const EmailPasswordForm = ({ type = 'signin' }: AuthPageProps) => {
  const searchParams = useSearchParams()

  const prefilledEmail = searchParams.get('email') as string | undefined

  // Provide proper default values based on form type
  const getDefaultValues = (): FieldValues => {
    const baseValues: FieldValues = {
      email: prefilledEmail || '',
      password: ''
    }

    switch (type) {
      case 'signup':
        return { ...baseValues, confirmPassword: '' }
      case 'signin':
        return baseValues
      default:
        return baseValues
    }
  }

  const form = useForm<z.infer<(typeof schemaMap)[typeof type]>>({
    resolver: zodResolver(schemaMap[type]),
    defaultValues: getDefaultValues(),
    mode: 'onChange'
  })

  const { signingIn, setSigningIn } = useAuthStore()
  const emailPasswordSignUpMutation = useEmailPasswordSignUp()
  const { mutateAsync: emailPasswordSignUp } = emailPasswordSignUpMutation
  const emailPasswordSignInMutation = useEmailPasswordSignIn()
  const { mutateAsync: emailPasswordSignIn } = emailPasswordSignInMutation

  useEffect(() => {
    // Clear errors when switching form types
    form.clearErrors()
  }, [type])

  const signUpWithEmailPassword = useCallback(
    async (email: string, password: string) => {
      setSigningIn('email')

      try {
        if (type === 'signup') {
          await emailPasswordSignUp({
            email,
            password
          })
        } else {
          await emailPasswordSignIn({
            email,
            password
          })
        }
      } finally {
        setSigningIn(false)
      }
    },
    [emailPasswordSignUp, emailPasswordSignIn, setSigningIn, type]
  )

  const onSubmit = useCallback(
    async (data: FieldValues) => {
      if (signingIn) return
      await signUpWithEmailPassword(data.email, data.password)
    },
    [signUpWithEmailPassword, signingIn]
  )

  const handleErrorClear = useCallback(() => {
    if (type === 'signin') {
      emailPasswordSignInMutation.reset()
    } else {
      emailPasswordSignUpMutation.reset()
    }
  }, [emailPasswordSignInMutation, emailPasswordSignUpMutation, type])

  // Get server error message
  const serverError =
    type === 'signin'
      ? emailPasswordSignInMutation.error?.message
      : emailPasswordSignUpMutation.error?.message

  return (
    <div className="flex flex-col gap-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          {/* Show server error alert */}
          {serverError && (
            <Alert variant="destructive">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <EmailPasswordFields
            type={type}
            isLoading={!!signingIn}
            onErrorClear={handleErrorClear}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={!!signingIn}
            isLoading={signingIn === 'email'}
          >
            {type === 'signin' ? 'SIGN IN' : 'SIGN UP'}
          </Button>
        </form>
      </Form>

      {type === 'signin' ? (
        <Paragraph size="body" className="text-left text-muted/80">
          Don't have an account?{' '}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </Paragraph>
      ) : (
        <Paragraph size="body" className="text-left text-muted/80">
          Already have an account?{' '}
          <Link href={ROUTES.SignIn} className="underline">
            Sign in
          </Link>
        </Paragraph>
      )}
    </div>
  )
}

export default EmailPasswordForm
