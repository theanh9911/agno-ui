import Paragraph from '@/components/ui/typography/Paragraph'
import EmailPasswordForm from './EmailPasswordForm/EmailPasswordForm'
import GitHubButton from './GitHubButton/GitHubButton'
import GoogleButton from './GoogleButton/GoogleButton'
import { Separator } from '@/components/ui/separator'
import { AuthPageProps } from '@/constants'
import AuthLayout from '@/components/layouts/AuthLayout/AuthLayout'

export default function AuthPage({ type = 'signin' }: AuthPageProps) {
  return (
    <AuthLayout>
      <>
        <div className="mx-auto flex w-full flex-col gap-y-2">
          <GitHubButton />
          <GoogleButton />
        </div>

        <div className="flex items-center gap-2">
          <Separator />
          <Paragraph size="label" className="text-muted">
            OR
          </Paragraph>
          <Separator />
        </div>

        <EmailPasswordForm type={type} />
      </>
    </AuthLayout>
  )
}
