import { PageWrapper, ContentWrapper } from '@/components/layouts/PageWrapper'
import { MAX_PAGE_WRAPPER_WIDTHS } from '@/constants'
import Header from '../Header'

export default function MemoryPageWrapper({
  children,
  isTeaser = false
}: {
  children: React.ReactNode
  isTeaser?: boolean
}) {
  return (
    <PageWrapper
      customWidth={MAX_PAGE_WRAPPER_WIDTHS}
      className="relative overflow-hidden"
    >
      {!isTeaser && <Header />}
      <ContentWrapper className="overflow-y-auto">{children}</ContentWrapper>
    </PageWrapper>
  )
}
