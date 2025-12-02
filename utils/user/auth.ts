import { toast } from '@/components/ui/toast'
import posthog from 'posthog-js'

import { QueryClient } from '@tanstack/react-query'
import { logError } from '../error'
import { AGNO_CACHE_PREFIX, CACHE_KEYS, getLocalStorageKey } from '@/constants'
import { ROUTES } from '@/routes'
import { UserData } from '@/types/User'
import { AuthenticationService } from '@/api/generated'

// Password validation utility functions
export const hasUppercase = (password: string) => /[A-Z]/.test(password)
export const hasLowercase = (password: string) => /[a-z]/.test(password)
export const hasNumber = (password: string) => /\d/.test(password)
export const hasSpecialChar = (password: string) =>
  /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password)

// Email validation utility function
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

// Email validation with custom message
export const validateEmail = (email: string): string | null => {
  if (!email || email.trim().length === 0) {
    return 'Email is required'
  }

  if (!isValidEmail(email)) {
    return 'Please enter a valid email address'
  }

  return null // No error
}

// Simple password complexity check (basic zxcvbn-like scoring)
export const calculatePasswordComplexity = (password: string): number => {
  let score = 0

  // Length contribution
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1

  // Character variety
  if (hasUppercase(password)) score += 1
  if (hasLowercase(password)) score += 1
  if (hasNumber(password)) score += 1
  if (hasSpecialChar(password)) score += 1

  // Pattern checks
  if (!/(.)\1{2,}/.test(password)) score += 1 // No repeated characters
  if (!/123|abc|qwe|pass|admin|user/i.test(password)) score += 1 // No common patterns

  return Math.min(score, 4)
}

export const signOut = async (
  queryClient?: QueryClient,
  redirectUrl: string = ROUTES.SignIn,
  router?: { push: (path: string) => void }
) => {
  try {
    // Track logout event and reset PostHog user identification
    posthog.capture('user_logged_out')
    posthog.reset()

    await AuthenticationService.authLogout()

    // Ensure all browser tabs log out:
    if (typeof window !== 'undefined') {
      // First remove specific items before clearing all storage
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(AGNO_CACHE_PREFIX)) {
          localStorage.removeItem(key)
        }
      })

      window.dispatchEvent(new Event('storage'))
    }

    if (queryClient) {
      queryClient.removeQueries()
      queryClient.clear()
    }

    if (router) {
      router.push(redirectUrl)
    } else {
      window.location.href = redirectUrl
    }
  } catch (error) {
    toast.error({
      description: 'Something went wrong whilst signing out'
    })

    if (error) {
      logError(error as Error)
    }
  }
}

interface PersistedUserQuery {
  queryKey: string[]
  state: {
    data: UserData
    status: 'success' | 'error' | 'pending'
  }
}

interface PersistedCache {
  clientState: {
    queries: PersistedUserQuery[]
  }
}

/**
 * Fallback function to get user data directly from localStorage
 * when React Query cache hasn't hydrated yet
 */
export const getUserDataFromLocalStorage = (): UserData | null => {
  if (typeof window === 'undefined') return null

  try {
    const stored = localStorage.getItem(getLocalStorageKey('reactQueryCache'))
    if (stored) {
      const parsedCache: PersistedCache = JSON.parse(stored)
      // Navigate to the user data in the persisted cache structure
      const userCacheKey = JSON.stringify(CACHE_KEYS.AUTH_CACHE_KEYS.USER)
      const userQuery = parsedCache?.clientState?.queries?.find(
        (query: PersistedUserQuery) =>
          JSON.stringify(query.queryKey) === userCacheKey
      )

      return userQuery?.state?.data || null
    }
  } catch {
    // Ignore localStorage errors
  }
  return null
}
