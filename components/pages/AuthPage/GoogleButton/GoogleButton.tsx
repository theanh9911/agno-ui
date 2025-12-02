import { type FC } from 'react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/LoginStore'
import { toast } from '@/components/ui/toast'
import { AuthenticationService } from '@/api/generated'
import { AGNO_API_URL } from '@/api/routes'

const GoogleButton: FC = () => {
  const { signingIn, setSigningIn } = useAuthStore()

  const handleGoogleLogin = async () => {
    try {
      setSigningIn('google')
      const response = await AuthenticationService.authSocialAuthorize({
        provider: 'google',
        redirectUri: `${AGNO_API_URL}/auth/social/callback`,
        state: 'google',
        userEmail: 'google'
      })
      window.location.href = response.authorization_url
    } catch (error) {
      toast.error({
        description: `Failed to get Google auth URL: ${error}`
      })
      setSigningIn(false)
    }
  }

  return (
    <Button
      type="button"
      onClick={handleGoogleLogin}
      isLoading={signingIn === 'google'}
      disabled={!!signingIn}
      icon="Google"
    >
      Continue with Google
    </Button>
  )
}
export default GoogleButton
