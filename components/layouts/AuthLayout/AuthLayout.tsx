import { PrivacyPolicy, TermsOfService } from '@/components/common/LegalLinks'
import AuthHeader from './AuthHeader'
import Paragraph from '@/components/ui/typography/Paragraph'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex h-screen w-full flex-col">
        <div className="relative flex size-full items-center justify-center bg-background">
          <div className="z-10 flex max-w-[600px] flex-col items-center justify-center gap-10 text-center will-change-transform">
            <AuthHeader />
            <div className="flex w-full max-w-[26rem] flex-col gap-y-6">
              {children}
            </div>
            <Paragraph size="body" className="text-muted/80">
              By creating an account you agree to our
              <TermsOfService />
              and
              <PrivacyPolicy />
            </Paragraph>
          </div>
          <div className="LoginGradient z-0" />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
