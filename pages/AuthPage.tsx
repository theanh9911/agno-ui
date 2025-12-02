import AuthPage from '@/components/pages/AuthPage/AuthPage'
import { AuthPageProps } from '@/constants'

export default function AuthPageWrapper({ type = 'signin' }: AuthPageProps) {
  return <AuthPage type={type} />
}
