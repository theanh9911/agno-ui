import { PageWrapper, ContentWrapper } from '@/components/layouts/PageWrapper'
import { MAX_PAGE_WRAPPER_WIDTHS } from '@/constants'
import UserHeader from '../Header/UserHeader'

export default function UserMemoryPageWrapper({
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
      {!isTeaser && <UserHeader />}
      <ContentWrapper className="overflow-y-auto">{children}</ContentWrapper>
    </PageWrapper>
  )
}
