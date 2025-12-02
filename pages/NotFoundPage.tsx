import NotFound from '@/components/pages/NotFoundPage/NotFound'

interface NotFoundPageProps {
  title?: string
  description?: string
  buttons?: React.ReactNode[]
}

export default function NotFoundPage({
  title,
  description,
  buttons
}: NotFoundPageProps) {
  return <NotFound title={title} description={description} buttons={buttons} />
}
