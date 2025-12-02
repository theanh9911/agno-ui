import { useEffect, useRef } from 'react'
import { useDialog } from '@/providers/DialogProvider'
import { useAuthStatus } from '@/api/hooks/queries'
import { WelcomeDialogContent } from '@/components/modals/Welcome/WelcomeDialogContent'

const WELCOME_MODAL_KEY = 'agentOS_welcome_modal_shown'

// localStorage helper functions
const getWelcomeShown = (): boolean => {
  try {
    return localStorage.getItem(WELCOME_MODAL_KEY) === 'true'
  } catch {
    // Fallback if localStorage is not available (e.g., private browsing)
    return false
  }
}

const setWelcomeShown = (): void => {
  try {
    localStorage.setItem(WELCOME_MODAL_KEY, 'true')
  } catch {
    // Silently fail if localStorage is not available
  }
}

const WelcomeModalTrigger = () => {
  const { openDialog, closeDialog } = useDialog()
  const { data: authStatus, isLoading } = useAuthStatus()
  const attemptedRef = useRef(false)

  useEffect(() => {
    // Only show modal once per user when they become authenticated
    // Wait for loading to complete and ensure we have auth data
    // Use ref to prevent multiple attempts in the same session
    if (
      !isLoading &&
      authStatus?.authenticated &&
      !getWelcomeShown() &&
      !attemptedRef.current
    ) {
      attemptedRef.current = true
      // Add a small delay to ensure all providers are ready
      setTimeout(() => {
        openDialog(
          <WelcomeDialogContent
            onClose={() => {
              // Set flag when user closes modal
              setWelcomeShown()
              closeDialog()
            }}
          />
        )
        // Set flag after a short delay to ensure modal actually opened
        setTimeout(() => {
          setWelcomeShown()
        }, 50)
      }, 100)
    }
  }, [authStatus?.authenticated, isLoading, openDialog, closeDialog])

  return null // This component doesn't render anything
}

export default WelcomeModalTrigger
