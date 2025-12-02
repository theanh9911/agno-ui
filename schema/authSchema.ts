import * as z from 'zod'
import {
  hasUppercase,
  hasLowercase,
  hasNumber,
  hasSpecialChar,
  calculatePasswordComplexity,
  validateEmail
} from '@/utils/user/auth'

const emailValidation = z.string().superRefine((val, ctx) => {
  const error = validateEmail(val)
  if (error) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: error
    })
  }
})

const strongPasswordValidation = z.string().superRefine((val, ctx) => {
  if (
    val.length < 8 ||
    !hasUppercase(val) ||
    !hasLowercase(val) ||
    !hasNumber(val) ||
    !hasSpecialChar(val) ||
    calculatePasswordComplexity(val) < 1
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message:
        'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.'
    })
  }
})

const simplePasswordValidation = z.string().min(1, 'Password is required')

export const signInSchema = z.object({
  email: emailValidation,
  password: simplePasswordValidation
})

export const signUpSchema = z
  .object({
    email: emailValidation,
    password: strongPasswordValidation,
    confirmPassword: z.string().min(1, 'Please confirm your password')
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords don't match",
        path: ['confirmPassword']
      })
    }
  })

export const resetPasswordSchema = z
  .object({
    newPassword: strongPasswordValidation,
    confirmPassword: z.string().min(1, 'Please confirm your password')
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords don't match",
        path: ['confirmPassword']
      })
    }
  })

export const forgotPasswordSchema = z.object({
  email: emailValidation
})

export const verifyEmailSchema = z.object({
  code: z.string().min(1, 'Please enter your verification code')
})

export const schemaMap = {
  signin: signInSchema,
  signup: signUpSchema,
  'reset-password': resetPasswordSchema,
  'forgot-password': forgotPasswordSchema,
  'verify-email': verifyEmailSchema
} as const

export type SignInFormData = z.infer<typeof signInSchema>
export type SignUpFormData = z.infer<typeof signUpSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
export type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>
export type AuthFormData =
  | SignInFormData
  | SignUpFormData
  | ResetPasswordFormData
  | ForgotPasswordFormData
  | VerifyEmailFormData
