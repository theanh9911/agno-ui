import { usePostHog } from 'posthog-js/react'
import { useCallback, useRef } from 'react'
import {
  UserResponse,
  UserProfileResponse,
  UserOrganization
} from '@/api/generated'

/**
 * Hook for managing PostHog user identification
 * Prevents duplicate identify calls and provides clean reset functionality
 */
export const usePostHogIdentify = () => {
  const posthog = usePostHog()
  const identifiedRef = useRef<string | null>(null)

  /**
   * Identify user from UserProfileResponse (used by PostHogIdentifier component)
   * This receives complete user data including organizations from useUser hook
   */
  const identifyUser = useCallback(
    (userData: UserProfileResponse, currentOrganization: UserOrganization) => {
      if (!posthog || !userData?.user?.user_id) return

      const userId = userData.user.user_id

      // Prevent duplicate identification for the same user
      if (identifiedRef.current === userId) return

      // Identify user with PostHog
      posthog.identify(userId, {
        email: userData.user.email,
        name: userData.user.name,
        username: userData.user.username,
        email_verified: userData.user.email_verified,
        is_active: userData.user.is_active,
        is_machine: userData.user.is_machine,
        experimental_features: userData.user.experimental_features,
        organization_count: userData.organizations?.length || 0,
        current_organization_id: currentOrganization.id,
        created_at: userData.user.created_at,
        updated_at: userData.user.updated_at
      })

      // Track successful identification
      identifiedRef.current = userId

      // Track login event (method will be unknown for existing sessions)
      posthog.capture('user_authenticated', {
        method: 'session_restored',
        email_verified: userData.user.email_verified,
        organization_count: userData.organizations?.length || 0
      })
    },
    [posthog]
  )

  /**
   * Identify user from UserResponse with specific auth method (used by auth mutation callbacks)
   * This receives limited user data from auth endpoints, no organizations included
   */
  const identifyUserWithMethod = useCallback(
    (
      userData: UserResponse,
      method: 'email_password' | 'google' | 'github' | 'email_verification'
    ) => {
      if (!posthog || !userData?.user_id) return

      const userId = userData.user_id

      // Prevent duplicate identification for the same user
      if (identifiedRef.current === userId) return

      // Identify user with PostHog
      posthog.identify(userId, {
        email: userData.email,
        name: userData.name,
        username: userData.username,
        email_verified: userData.email_verified,
        is_active: userData.is_active,
        is_machine: userData.is_machine,
        experimental_features: userData.experimental_features,
        organization_count: 0, // UserResponse doesn't include organizations
        current_organization_id: userData.current_organization_id,
        created_at: userData.created_at,
        updated_at: userData.updated_at
      })

      // Track successful identification
      identifiedRef.current = userId

      // Track login event with specific method
      posthog.capture('user_authenticated', {
        method,
        email_verified: userData.email_verified,
        organization_count: 0
      })
    },
    [posthog]
  )

  const resetUser = useCallback(() => {
    if (!posthog) return

    // Reset PostHog user identification
    posthog.reset()

    // Clear our tracking
    identifiedRef.current = null

    // Track logout event
    posthog.capture('user_logged_out')
  }, [posthog])

  const updateUserProperties = useCallback(
    (properties: Record<string, unknown>) => {
      if (!posthog || !identifiedRef.current) return

      // Update user properties without re-identifying
      posthog.people.set(properties)
    },
    [posthog]
  )

  return {
    identifyUser,
    identifyUserWithMethod,
    resetUser,
    updateUserProperties,
    isIdentified: !!identifiedRef.current
  }
}
