import { useState, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@/utils/navigation'
import { signOut as signOutFn } from '@/utils/user/auth'
import { ROUTES } from '@/routes'

export const useSignOut = (defaultRedirect = ROUTES.SignIn) => {
  const [isSigningOut, setIsSigningOut] = useState(false)
  const queryClient = useQueryClient()
  const router = useRouter()

  const signOut = useCallback(
    async (redirectUrl = defaultRedirect) => {
      setIsSigningOut(true)
      await signOutFn(queryClient, redirectUrl, router)
    },
    [queryClient, router, defaultRedirect]
  )

  return { signOut, isSigningOut }
}
