import { useEffect, type FC } from 'react'
import MainLayout from '@/layouts/MainLayout'
import { type FallbackProps } from 'react-error-boundary'

import { ROUTES } from '@/routes'
import { logError } from '@/utils/error'
import { Error } from '@/components/common/Error'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import Link from '@/components/ui/Link'

const ErrorBoundaryShell: FC<FallbackProps> = ({
  error,
  resetErrorBoundary
}) => {
  useEffect(() => {
    if (error) {
      logError(error)
    }
  }, [error])
  const { resolvedTheme } = useTheme()
  const errorImageSrc =
    resolvedTheme === 'dark'
      ? '/icons/error_dark.svg'
      : '/icons/error_light.svg'
  const content = (
    <Error
      title="Something went wrong"
      description="We've been alerted and are working on getting things back to normal."
      imageSrc={errorImageSrc}
      buttons={[
        <Button key="secondary" variant="secondary">
          <Link
            href={ROUTES.Community}
            target="_blank"
            rel="noreferrer noopener"
          >
            Contact us
          </Link>
        </Button>,
        <Button key="primary" variant="secondary" onClick={resetErrorBoundary}>
          Refresh Page
        </Button>
      ]}
    />
  )

  return <MainLayout>{content}</MainLayout>
}
export default ErrorBoundaryShell
