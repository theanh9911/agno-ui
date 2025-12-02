import { useMemo } from 'react'
import { useFormContext, FieldPath, FieldValues } from 'react-hook-form'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Paragraph from '@/components/ui/typography/Paragraph'
import Link from '@/components/ui/Link'
import PasswordInput from './PasswordInput'

type AuthFormType = 'signin' | 'signup' | 'reset-password' | 'forgot-password'

interface EmailPasswordFieldsProps {
  type: AuthFormType
  isLoading?: boolean
  onErrorClear?: () => void
}

const EmailPasswordFields = ({
  type,
  isLoading = false,
  onErrorClear
}: EmailPasswordFieldsProps) => {
  const form = useFormContext<FieldValues>()

  const { passwordFieldName, needsConfirmPassword, needsEmail, needsPassword } =
    useMemo(
      () => ({
        passwordFieldName:
          type === 'reset-password' ? 'newPassword' : 'password',
        needsConfirmPassword: type === 'signup' || type === 'reset-password',
        needsEmail: type !== 'reset-password',
        needsPassword: type !== 'forgot-password' && type !== 'reset-password'
      }),
      [type]
    )

  const isEmailError = !!form.formState.errors.email
  const isPasswordError = !!form.formState.errors[passwordFieldName]
  const isConfirmPasswordError = !!form.formState.errors.confirmPassword

  return (
    <div className="flex flex-col gap-6">
      {/* Email Field - only show if needed */}
      {needsEmail && (
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <div className="flex flex-col gap-2">
              <FormItem className="text-left">
                <FormLabel
                  className={`${!isEmailError ? 'text-primary' : 'text-destructive'}`}
                >
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="name@company.com"
                    error={isEmailError}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      if (onErrorClear) {
                        onErrorClear()
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
              {/* Forgot Password Helper Text */}
              {type === 'forgot-password' && (
                <Paragraph size="body" className="text-left text-muted/80">
                  We'll send a password reset link if the email is known to us.
                </Paragraph>
              )}
            </div>
          )}
        />
      )}

      {/* Password Field */}
      {needsPassword && (
        <FormField
          control={form.control}
          name={passwordFieldName as FieldPath<FieldValues>}
          render={({ field }) => (
            <div className="flex flex-col gap-2">
              <PasswordInput
                label={
                  type === 'reset-password' ? 'Enter new password' : 'Password'
                }
                field={field}
                isLoading={isLoading}
                onErrorClear={onErrorClear}
                placeholder="Your password"
                error={isPasswordError}
              />
              {type === 'signin' && (
                <Paragraph size="body" className="text-left text-muted/80">
                  <Link href="/forget-password" className="underline">
                    Forgot password?
                  </Link>
                </Paragraph>
              )}
            </div>
          )}
        />
      )}

      {/* Reset Password Fields */}

      {type === 'reset-password' && (
        <FormField
          control={form.control}
          name={passwordFieldName as FieldPath<FieldValues>}
          render={({ field }) => (
            <>
              <PasswordInput
                label="Enter new password"
                field={field}
                isLoading={isLoading}
                onErrorClear={onErrorClear}
                placeholder="Your new password"
                error={isPasswordError}
              />
            </>
          )}
        />
      )}

      {/* Confirm Password Field */}
      {needsConfirmPassword && (
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <div className="flex flex-col gap-2">
              <PasswordInput
                label={
                  type === 'reset-password'
                    ? 'Confirm your new password'
                    : 'Confirm Password'
                }
                field={field}
                isLoading={isLoading}
                onErrorClear={onErrorClear}
                placeholder="Your password"
                error={isConfirmPasswordError}
              />
              <Paragraph size="body" className="text-left text-muted/80">
                Use a minimum of 8 characters, with uppercase and lowercase
                characters, a number and a symbol.
              </Paragraph>
            </div>
          )}
        />
      )}
    </div>
  )
}

export default EmailPasswordFields
