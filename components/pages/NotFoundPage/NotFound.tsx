import { Helmet } from 'react-helmet-async'

import { useTheme } from 'next-themes'
import { Error } from '@/components/common/Error'
import { Button } from '@/components/ui/button'

interface NotFoundPageProps {
  title?: string
  description?: string
  buttons?: React.ReactNode[]
}

const NotFoundPage = ({ title, description, buttons }: NotFoundPageProps) => {
  const { resolvedTheme } = useTheme()
  const notFoundImageSrc =
    resolvedTheme === 'dark' ? '/icons/404_dark.svg' : '/icons/404_light.svg'

  return (
    <>
      <Helmet>
        <title>{title || 'Page Not Found'} | Agno App</title>
      </Helmet>
      <Error
        title={title || 'Page Not Found'}
        description={
          description ||
          "It looks like you're trying to access a page that has been deleted or doesn't exist."
        }
        buttons={
          buttons || [
            <Button
              key="primary"
              variant="secondary"
              className="uppercase"
              onClick={() => window.location.reload()}
            >
              Refresh
            </Button>
          ]
        }
        imageSrc={notFoundImageSrc}
      />
    </>
  )
}
export default NotFoundPage
