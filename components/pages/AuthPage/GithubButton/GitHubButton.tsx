import { type FC } from 'react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/LoginStore'
import { toast } from '@/components/ui/toast'
import { AuthenticationService } from '@/api/generated'
import { AGNO_API_URL } from '@/api/routes'

const GitHubButton: FC = () => {
  const { signingIn, setSigningIn } = useAuthStore()

  const handleGitHubLogin = async () => {
    try {
      setSigningIn('github')
      const response = await AuthenticationService.authSocialAuthorize({
        provider: 'github',
        redirectUri: `${AGNO_API_URL}/auth/social/callback`,
        state: 'github',
        userEmail: 'github'
      })
      window.location.href = response.authorization_url
    } catch (error) {
      toast.error({
        description: `Failed to get GitHub auth URL: ${error}`
      })
      setSigningIn(false)
    }
  }

  return (
    <Button
      type="button"
      onClick={handleGitHubLogin}
      isLoading={signingIn === 'github'}
      disabled={signingIn !== false}
      icon="GitHub"
    >
      Continue with GitHub
    </Button>
  )
}
export default GitHubButton
