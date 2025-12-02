import { ContentWrapper, PageWrapper } from '@/components/layouts/PageWrapper'
import { MAX_PAGE_WRAPPER_WIDTHS } from '@/constants'
import Header from './Header'

interface KnowledgePageWrapperProps {
  children: React.ReactNode
  isTeaser?: boolean
}

export default function KnowledgePageWrapper({
  children,
  isTeaser = false
}: KnowledgePageWrapperProps) {
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
