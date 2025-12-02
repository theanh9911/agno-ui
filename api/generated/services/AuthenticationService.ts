/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_auth_create_anon } from '../models/Body_auth_create_anon'
import type { EmailVerificationRequest } from '../models/EmailVerificationRequest'
import type { EmailVerificationResendRequest } from '../models/EmailVerificationResendRequest'
import type { MessageResponse } from '../models/MessageResponse'
import type { PasswordResetConfirm } from '../models/PasswordResetConfirm'
import type { PasswordResetRequest } from '../models/PasswordResetRequest'
import type { SocialAuthResponse } from '../models/SocialAuthResponse'
import type { UserLoginRequest } from '../models/UserLoginRequest'
import type { UserRegisterRequest } from '../models/UserRegisterRequest'
import type { UserResponse } from '../models/UserResponse'
import type { CancelablePromise } from '../core/CancelablePromise'
import { OpenAPI } from '../core/OpenAPI'
import { request as __request } from '../core/request'
export class AuthenticationService {
  /**
   * Register User
   * Register a new user through WorkOS AuthKit
   * @returns UserResponse Successful Response
   * @throws ApiError
   */
  public static authRegister({
    requestBody
  }: {
    requestBody: UserRegisterRequest
  }): CancelablePromise<UserResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/auth/register',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        409: `Email already exists`,
        422: `Invalid input data`,
        429: `Too many registration attempts`,
        500: `Internal server error`
      }
    })
  }
  /**
   * Login User
   * Authenticate user through WorkOS AuthKit
   * @returns UserResponse Successful Response
   * @throws ApiError
   */
  public static authLogin({
    requestBody
  }: {
    requestBody: UserLoginRequest
  }): CancelablePromise<UserResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/auth/login',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        401: `Invalid credentials`,
        422: `Invalid input data`,
        429: `Too many login attempts`,
        500: `Internal server error`
      }
    })
  }
  /**
   * Logout User
   * Logout current user
   * @returns MessageResponse Successful Response
   * @throws ApiError
   */
  public static authLogout(): CancelablePromise<MessageResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/auth/logout',
      errors: {
        401: `Not authenticated`,
        500: `Internal server error`
      }
    })
  }
  /**
   * Authenticate User
   * @returns MessageResponse Successful Response
   * @throws ApiError
   */
  public static authAuthenticate(): CancelablePromise<MessageResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/auth/authenticate'
    })
  }
  /**
   * Refresh Auth
   * @returns MessageResponse Successful Response
   * @throws ApiError
   */
  public static authRefresh(): CancelablePromise<MessageResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/auth/authrefresh'
    })
  }
  /**
   * Cli Auth
   * Authenticate user from CLI token
   * @returns UserResponse Successful Response
   * @throws ApiError
   */
  public static authCli(): CancelablePromise<UserResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/auth/cliauth'
    })
  }
  /**
   * Create Anon User
   * Create an anonymous user when the CLI is first initialized
   * @returns UserResponse Successful Response
   * @throws ApiError
   */
  public static authCreateAnon({
    requestBody
  }: {
    requestBody: Body_auth_create_anon
  }): CancelablePromise<UserResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/auth/create/anon',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`
      }
    })
  }
  /**
   * Forgot Password
   * Request password reset through WorkOS
   * @returns MessageResponse Successful Response
   * @throws ApiError
   */
  public static authForgotPassword({
    requestBody
  }: {
    requestBody: PasswordResetRequest
  }): CancelablePromise<MessageResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/auth/forgot-password',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`
      }
    })
  }
  /**
   * Reset Password
   * Reset password through WorkOS
   * @returns MessageResponse Successful Response
   * @throws ApiError
   */
  public static authResetPassword({
    requestBody
  }: {
    requestBody: PasswordResetConfirm
  }): CancelablePromise<MessageResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/auth/reset-password',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`
      }
    })
  }
  /**
   * Verify Email
   * Verify email through WorkOS and complete authentication
   * @returns UserResponse Successful Response
   * @throws ApiError
   */
  public static authVerifyEmail({
    requestBody
  }: {
    requestBody: EmailVerificationRequest
  }): CancelablePromise<UserResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/auth/verify-email',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`
      }
    })
  }
  /**
   * Resend Email Verification
   * Resend email verification through WorkOS
   * @returns MessageResponse Successful Response
   * @throws ApiError
   */
  public static authResendVerification({
    requestBody
  }: {
    requestBody: EmailVerificationResendRequest
  }): CancelablePromise<MessageResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/auth/resend-verification',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Invalid email address`,
        429: `Too many resend attempts`,
        500: `Internal server error`
      }
    })
  }
  /**
   * Social Authorize
   * Get social provider authorization URL
   * @returns SocialAuthResponse Successful Response
   * @throws ApiError
   */
  public static authSocialAuthorize({
    provider,
    redirectUri,
    state,
    userEmail
  }: {
    provider: string
    redirectUri: string
    state?: string | null
    userEmail?: string | null
  }): CancelablePromise<SocialAuthResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/auth/social/{provider}/authorize',
      path: {
        provider: provider
      },
      query: {
        redirect_uri: redirectUri,
        state: state,
        user_email: userEmail
      },
      errors: {
        422: `Validation Error`
      }
    })
  }
  /**
   * Social Callback
   * Handle social authentication callback and redirect to frontend
   * @returns any Successful Response
   * @throws ApiError
   */
  public static authSocialCallback({
    code,
    state
  }: {
    code: string
    state?: string | null
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/auth/social/callback',
      query: {
        code: code,
        state: state
      },
      errors: {
        302: `Redirect to frontend with authentication result`,
        422: `Validation Error`
      }
    })
  }
}
