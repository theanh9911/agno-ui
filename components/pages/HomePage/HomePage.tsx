import { PageWrapper } from '@/components/layouts/PageWrapper'
import { MAX_PAGE_WRAPPER_WIDTHS } from '@/constants'
import { useUser } from '@/api/hooks/queries'
import { Helmet } from 'react-helmet-async'

import { HomePageLoadingState } from './BlankState'
import { ConnectedOSTeaserPage } from './BlankState'
import OsBlankState from '@/components/common/OsBlankState/OsBlankState'
import NoConnectedOS from './NoConnectedOS/NoConnectedOS'
import ConnectedOS from './ConnectedOS/ConnectedOS'
import {
  PageViewState,
  usePageViewOptions
} from '@/hooks/os/usePageViewOptions'

import HomePageLayout from './HomePageLayout'
import WelcomeModalTrigger from '@/components/common/WelcomeModal/WelcomeModalTrigger'

const HomePage = () => {
  const { data } = useUser()

  const user = data?.user

  const { view } = usePageViewOptions({
    additionalChecks: () => {
      return PageViewState.CONTENT
    }
  })

  return (
    <>
      <Helmet>
        <title>Home | Agno</title>
      </Helmet>

      <WelcomeModalTrigger />

      <PageWrapper customWidth={MAX_PAGE_WRAPPER_WIDTHS}>
        <HomePageLayout userName={user?.name}>
          {view === PageViewState.LOADING && <HomePageLoadingState />}

          {view === PageViewState.DISCONNECTED && <NoConnectedOS />}

          {(view === PageViewState.INACTIVE ||
            view === PageViewState.AUTH_FAILED ||
            view === PageViewState.MISSING_SECURITY_KEY) && (
            <>
              <ConnectedOSTeaserPage />
              <OsBlankState status={view} />
            </>
          )}

          {view === PageViewState.CONTENT && <ConnectedOS />}
        </HomePageLayout>
      </PageWrapper>
    </>
  )
}

export default HomePage
