import { useUser } from '@/api/hooks/queries'
import { usePostHogIdentify } from '@/hooks/usePostHogIdentify'
import { useEffect } from 'react'

/**
 * Component that monitors user data and identifies users with PostHog
 * when they first load after authentication
 */
export const PostHogIdentifier = () => {
  const { data: userData } = useUser()
  const { identifyUser } = usePostHogIdentify()

  const currentOrganization = userData?.organizations.find(
    (org) => org.id === userData?.user.current_organization_id
  )

  useEffect(() => {
    // Only identify if we have valid user data and haven't identified this user yet
    if (userData?.user?.user_id && currentOrganization) {
      identifyUser(userData, currentOrganization)
    }
  }, [userData, identifyUser])

  // This component doesn't render anything
  return null
}
